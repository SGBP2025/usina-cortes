"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ClipCard } from "@/components/molecules/ClipCard";
import Link from "next/link";

const STEPS = [
  { key: "pending", label: "Na fila", icon: "⏳" },
  { key: "processing:download", label: "Download", icon: "⬇" },
  { key: "processing:audio", label: "Áudio", icon: "🎵" },
  { key: "processing:transcription", label: "Transcrição", icon: "📝" },
  { key: "processing:ai", label: "IA", icon: "🤖" },
  { key: "processing:clips", label: "Corte", icon: "✂️" },
  { key: "completed", label: "Concluído", icon: "✅" },
];

interface Clip {
  id: string;
  storage_path: string;
  duration: number | null;
  tiktok_description: string | null;
  instagram_description: string | null;
  youtube_title: string | null;
}

interface JobStatusViewProps {
  jobId: string;
  initialStatus: string;
  initialClips: Clip[];
}

export function JobStatusView({ jobId, initialStatus, initialClips }: JobStatusViewProps) {
  const [status, setStatus] = useState(initialStatus);
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "completed" || status === "error" || status === "cancelled") return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/jobs/${jobId}/status`);
      if (!res.ok) return;
      const data = await res.json();
      setStatus(data.job.status);
      if (data.job.error_message) setError(data.job.error_message);
      if (data.clips?.length > 0) setClips(data.clips);
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleDownload = async (storagePath: string) => {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("clips")
      .createSignedUrl(storagePath, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const activeStepIndex = status === "completed" ? STEPS.length - 1
    : status === "error" ? -1
    : status === "pending" ? 0
    : 3; // processing genérico

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Status do processamento</h1>
        <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">← Voltar</Link>
      </div>

      {/* Progress steps */}
      <div className="rounded-2xl border border-zinc-800 bg-bg-surface p-6">
        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                i < activeStepIndex ? "bg-success/10 text-success border border-success/30"
                : i === activeStepIndex ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30 animate-pulse"
                : "bg-bg-elevated text-zinc-600 border border-zinc-800"
              }`}>
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && <span className="text-zinc-700">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="rounded-xl border border-error/30 bg-error/5 p-6 space-y-3">
          <p className="text-error font-medium">Processamento falhou</p>
          <p className="text-sm text-zinc-400">{error ?? "Erro desconhecido"}</p>
          <Link
            href="/dashboard/upload"
            className="inline-block text-sm text-brand-primary hover:underline"
          >
            Tentar com outro vídeo →
          </Link>
        </div>
      )}

      {/* Clips */}
      {status === "completed" && clips.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {clips.length} clipe{clips.length !== 1 ? "s" : ""} gerado{clips.length !== 1 ? "s" : ""}
          </h2>
          {clips.map((clip) => (
            <ClipCard
              key={clip.id}
              id={clip.id}
              storagePath={clip.storage_path}
              duration={clip.duration}
              youtubeTitle={clip.youtube_title}
              tiktokDescription={clip.tiktok_description}
              instagramDescription={clip.instagram_description}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* Waiting */}
      {(status === "pending" || status === "processing") && (
        <p className="text-sm text-zinc-500 text-center animate-pulse">
          Atualizando a cada 3 segundos...
        </p>
      )}
    </div>
  );
}
