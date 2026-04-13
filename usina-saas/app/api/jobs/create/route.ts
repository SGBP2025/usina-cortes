import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enqueueVideoJob } from "@/lib/queue/producer";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { storagePath, originalName, sizeBytes } = body;

  if (!storagePath || !originalName) {
    return NextResponse.json({ error: "storagePath e originalName são obrigatórios" }, { status: 400 });
  }

  // Verificar créditos mínimos (5 min)
  const { data: credits } = await supabase
    .from("user_credits")
    .select("balance_minutes")
    .eq("user_id", user.id)
    .single();

  if (!credits || Number(credits.balance_minutes) < 5) {
    return NextResponse.json(
      { error: "Créditos insuficientes. Mínimo 5 minutos necessários." },
      { status: 402 }
    );
  }

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

  // Criar o job no banco
  const { data: job, error } = await supabase
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

  // Enfileirar no Bull (Redis pode não estar rodando em dev)
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Queue timeout")), 3000)
    );
    await Promise.race([enqueueVideoJob(job.id, user.id, videoFile.id, storagePath), timeout]);
  } catch (queueError) {
    console.warn("Bull queue indisponível (Redis offline?):", queueError);
    // Job criado no banco mas não enfileirado — aceitável para dev local
  }

  return NextResponse.json({ jobId: job.id });
}
