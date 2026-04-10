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
  const { videoFileId, storagePath } = body;

  if (!videoFileId || !storagePath) {
    return NextResponse.json({ error: "videoFileId e storagePath são obrigatórios" }, { status: 400 });
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

  // Criar o job no banco
  const { data: job, error } = await supabase
    .from("processing_jobs")
    .insert({
      user_id: user.id,
      video_file_id: videoFileId,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Erro ao criar job" }, { status: 500 });
  }

  // Enfileirar no Bull
  await enqueueVideoJob(job.id, user.id, videoFileId, storagePath);

  return NextResponse.json({ jobId: job.id });
}
