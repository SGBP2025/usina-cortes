import "dotenv/config";
import Bull from "bull";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { extractAudio, cutClip, getVideoDuration } from "../services/ffmpeg";
import { transcribeAudio } from "../services/whisper";
import { selectViralMoments } from "../services/claude";
import { downloadFromR2, uploadToR2, deleteFromR2, R2_VIDEOS_BUCKET, R2_CLIPS_BUCKET } from "../services/r2";

// NOTA: O worker usa SUPABASE_SERVICE_ROLE_KEY que bypassa RLS.
// Isso é INTENCIONAL — o worker processa jobs de qualquer usuário.
// Nunca expor esta chave no cliente/frontend.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface VideoJobData {
  jobId: string;
  userId: string;
  videoFileId: string;
  storagePath: string;
}

const videoQueue = new Bull<VideoJobData>("video-jobs", {
  redis: process.env.REDIS_URL || "redis://localhost:6379",
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

async function updateJobStatus(
  jobId: string,
  status: string,
  extra: Record<string, unknown> = {}
) {
  await supabase
    .from("processing_jobs")
    .update({ status, ...extra })
    .eq("id", jobId);
}

videoQueue.process(async (job) => {
  const { jobId, userId, videoFileId, storagePath } = job.data;
  const tmpDir = path.join("/tmp", jobId);

  try {
    console.log(`[Worker] Iniciando job ${jobId} para usuário ${userId}`);
    await updateJobStatus(jobId, "processing", { started_at: new Date().toISOString() });

    // Criar diretório temporário
    fs.mkdirSync(tmpDir, { recursive: true });

    // Step 1: Download do vídeo do R2
    console.log(`[Worker] Step 1: Download do vídeo ${storagePath}`);
    const videoPath = path.join(tmpDir, "input.mp4");
    await downloadFromR2(R2_VIDEOS_BUCKET, storagePath, videoPath);

    // Obter duração do vídeo para cálculo de créditos
    const videoDurationSeconds = await getVideoDuration(videoPath);
    const creditsConsumed = videoDurationSeconds / 60;

    // Step 2: Extração de áudio
    console.log(`[Worker] Step 2: Extraindo áudio`);
    const audioPath = path.join(tmpDir, "audio.mp3");
    await extractAudio(videoPath, audioPath);

    // Step 3: Transcrição via Whisper
    console.log(`[Worker] Step 3: Transcrevendo áudio`);
    const transcription = await transcribeAudio(audioPath);

    // Registrar uso de Whisper
    await supabase.from("usage_metrics").insert({
      user_id: userId,
      job_id: jobId,
      service: "whisper",
    });

    // Step 4: Seleção de momentos virais via Claude
    console.log(`[Worker] Step 4: Selecionando momentos virais`);
    const rawClips = await selectViralMoments(transcription);
    const clips = rawClips.filter(c => (c.end - c.start) >= 15);
    if (clips.length === 0) throw new Error("Nenhum clip com duração mínima de 15s foi gerado. Tente com um vídeo mais longo.");

    // Registrar uso do Claude
    await supabase.from("usage_metrics").insert({
      user_id: userId,
      job_id: jobId,
      service: "claude",
    });

    // Step 5-6: Corte e upload de clipes
    console.log(`[Worker] Steps 5-6: Cortando e fazendo upload de ${clips.length} clipes`);
    const clipInserts: Record<string, unknown>[] = [];

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const clipFilename = `clip-${i + 1}.mp4`;
      const clipPath = path.join(tmpDir, clipFilename);

      await cutClip(videoPath, clipPath, Math.max(0, clip.start - 0.5), clip.end + 1);

      // Upload para R2
      const clipStoragePath = `${userId}/${jobId}/${clipFilename}`;
      await uploadToR2(R2_CLIPS_BUCKET, clipStoragePath, clipPath);

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      clipInserts.push({
        job_id: jobId,
        video_file_id: videoFileId,
        storage_path: clipStoragePath,
        start_time: clip.start,
        end_time: clip.end,
        duration: clip.end - clip.start,
        tiktok_description: clip.tiktok_description,
        instagram_description: clip.instagram_description,
        youtube_title: clip.youtube_title,
        expires_at: expiresAt,
      });
    }

    // Step 7: INSERT em generated_clips e UPDATE processing_jobs
    await supabase.from("generated_clips").insert(clipInserts);

    // Step 8: Descontar créditos ANTES de marcar o job como completed
    // (a guarda de idempotência do RPC verifica credits_consumed IS NULL)
    const { error: rpcError } = await supabase.rpc("consume_job_credits", {
      p_user_id: userId,
      p_job_id: jobId,
      p_minutes: creditsConsumed,
    });
    if (rpcError) console.error(`[Worker] Erro ao descontar créditos: ${rpcError.message}`);
    else console.log(`[Worker] Créditos descontados: ${creditsConsumed.toFixed(2)} min`);

    await updateJobStatus(jobId, "completed", {
      completed_at: new Date().toISOString(),
      credits_consumed: creditsConsumed,
    });

    console.log(`[Worker] Job ${jobId} concluído com ${clips.length} clipes`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error(`[Worker] Job ${jobId} falhou:`, message);
    await updateJobStatus(jobId, "error", { error_message: message });
    throw error; // Bull fará retry
  } finally {
    // CRÍTICO: limpeza sempre executada, independente de sucesso ou falha
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      console.log(`[Worker] Tmp limpo: ${tmpDir}`);
    }
    // Deletar vídeo original do R2 sempre (sucesso ou erro sem retry)
    try {
      await deleteFromR2(R2_VIDEOS_BUCKET, storagePath);
      console.log(`[Worker] Vídeo original deletado do R2: ${storagePath}`);
    } catch (e) {
      console.error(`[Worker] Falha ao deletar vídeo do R2: ${storagePath}`, e);
    }
  }
});

videoQueue.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job.id} falhou após ${job.attemptsMade} tentativas:`, err.message);
});

videoQueue.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completado`);
});

console.log("[Worker] Aguardando jobs na fila video-jobs...");
