import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { enqueueVideoJob } from "@/lib/queue/producer";

// Teto máximo de duração por job (minutos). Guarda-costas contra um usuário
// com saldo pequeno enviar um vídeo de horas e consumir muito além do saldo
// (o débito só acontece pós-processamento no worker via consume_job_credits,
// que faz GREATEST(saldo - x, 0) → o excedente sairia "de graça").
const MAX_JOB_MINUTES = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { storagePath, originalName, sizeBytes, durationSeconds } = body;

  if (!storagePath || !originalName) {
    return NextResponse.json({ error: "storagePath e originalName são obrigatórios" }, { status: 400 });
  }

  // Verificar créditos mínimos (5 min)
  const { data: credits } = await supabase
    .from("user_credits")
    .select("balance_minutes")
    .eq("user_id", user.id)
    .single();

  const balanceMinutes = credits ? Number(credits.balance_minutes) : 0;

  if (!credits || balanceMinutes < 5) {
    return NextResponse.json(
      { error: "Créditos insuficientes. Mínimo 5 minutos necessários." },
      { status: 402 }
    );
  }

  // Teto de duração vs saldo. Se o client informar durationSeconds do vídeo,
  // rejeitamos quando a duração estimada excede o saldo ou o teto por job.
  const rawDuration =
    durationSeconds != null ? Number(durationSeconds) : null;
  const estimatedMinutes =
    rawDuration != null && Number.isFinite(rawDuration) && rawDuration > 0
      ? rawDuration / 60
      : null;

  if (estimatedMinutes != null) {
    if (estimatedMinutes > balanceMinutes) {
      return NextResponse.json(
        {
          error: `Vídeo estimado em ${estimatedMinutes.toFixed(
            1
          )} min excede seu saldo de ${balanceMinutes.toFixed(1)} min.`,
        },
        { status: 402 }
      );
    }
    if (estimatedMinutes > MAX_JOB_MINUTES) {
      return NextResponse.json(
        {
          error: `Vídeo excede o limite de ${MAX_JOB_MINUTES} min por job. Divida o vídeo em partes.`,
        },
        { status: 413 }
      );
    }
  }
  // TODO(reserva-atômica): sem durationSeconds confiável não há como reservar
  // o crédito no momento da criação — um vídeo longo com saldo pequeno ainda
  // seria aceito, e o débito pós-processamento (consume_job_credits) floors em 0,
  // deixando o excedente "de graça". Fix ideal: extrair a duração real antes de
  // enfileirar e reservar min(estimado, saldo) atomicamente aqui, liberando o
  // saldo não usado ao final do job. Até lá, MAX_JOB_MINUTES limita o prejuízo.

  // Criar registro do arquivo
  const { data: videoFile, error: fileError } = await supabase
    .from("video_files")
    .insert({
      user_id: user.id,
      storage_path: storagePath,
      original_name: originalName,
      size_bytes: sizeBytes ?? null,
    })
    .select("id")
    .single();

  if (fileError || !videoFile) {
    return NextResponse.json({ error: "Erro ao registrar arquivo" }, { status: 500 });
  }

  // Criar o job no banco.
  // IMPORTANTE: escrita em processing_jobs é feita com o service role client —
  // a RLS de processing_jobs é SELECT-only para o usuário (ver migration 007),
  // justamente para impedir que o usuário faça UPDATE marcando job como
  // completed/credits_consumed=0 e pule o débito. O worker também escreve via
  // service role.
  const admin = createServiceClient();
  const { data: job, error } = await admin
    .from("processing_jobs")
    .insert({
      user_id: user.id,
      video_file_id: videoFile.id,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Erro ao criar job" }, { status: 500 });
  }

  // Enfileirar no Bull. Se falhar (Redis offline/lento), o job ficaria 'pending'
  // órfão e o front faria polling infinito. Então marcamos como 'error' e
  // devolvemos falha — o usuário vê o erro e pode tentar de novo.
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Queue timeout")), 3000)
    );
    await Promise.race([enqueueVideoJob(job.id, user.id, videoFile.id, storagePath), timeout]);
  } catch (queueError) {
    console.error("Bull queue indisponível (Redis offline?):", queueError);
    await admin
      .from("processing_jobs")
      .update({
        status: "error",
        error_message: "Não foi possível iniciar o processamento agora. Tente novamente em instantes.",
      })
      .eq("id", job.id);

    return NextResponse.json(
      { error: "Não foi possível iniciar o processamento agora. Tente novamente em instantes." },
      { status: 503 }
    );
  }

  return NextResponse.json({ jobId: job.id });
}
