"use client";

import { ClipCard } from "@/components/molecules/ClipCard";
import Link from "next/link";

interface Clip {
  id: string;
  job_id: string;
  storage_path: string;
  duration: number | null;
  tiktok_description: string | null;
  instagram_description: string | null;
  youtube_title: string | null;
  created_at: string;
  expires_at: string | null;
}

export function ClipsGallery({ clips }: { clips: Clip[] }) {
  const handleDownload = async (clipId: string) => {
    const res = await fetch(`/api/clips/${clipId}/download`);
    const data = await res.json();
    if (data?.url) window.open(data.url, "_blank");
  };

  if (clips.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-4xl">✂️</p>
        <p className="text-white font-medium">Nenhum clipe gerado ainda</p>
        <p className="text-sm text-zinc-500">
          <Link href="/dashboard/upload" className="text-brand-primary hover:underline">
            Processe seu primeiro vídeo →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {clips.map((clip) => (
        <ClipCard
          key={clip.id}
          id={clip.id}
          duration={clip.duration}
          youtubeTitle={clip.youtube_title}
          tiktokDescription={clip.tiktok_description}
          instagramDescription={clip.instagram_description}
          expiresAt={clip.expires_at}
          onDownload={handleDownload}
        />
      ))}
    </div>
  );
}
