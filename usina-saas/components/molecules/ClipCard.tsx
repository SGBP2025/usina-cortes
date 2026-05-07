"use client";

import { useState } from "react";

interface ClipCardProps {
  id: string;
  duration: number | null;
  youtubeTitle: string | null;
  tiktokDescription: string | null;
  instagramDescription: string | null;
  expiresAt: string | null;
  onDownload: (id: string) => void;
}

function daysUntil(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function ClipCard({
  id,
  duration,
  youtubeTitle,
  tiktokDescription,
  instagramDescription,
  expiresAt,
  onDownload,
}: ClipCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const days = expiresAt ? daysUntil(expiresAt) : null;
  const isUrgent = days !== null && days <= 2;
  const isExpired = days === 0;

  const handlePreview = async () => {
    if (previewUrl) {
      setPreviewUrl(null);
      return;
    }
    setLoadingPreview(true);
    try {
      const res = await fetch(`/api/clips/${id}/preview`);
      const data = await res.json();
      if (data?.url) setPreviewUrl(data.url);
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-bg-surface p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{youtubeTitle ?? "Clip"}</p>
          {duration && (
            <p className="text-xs text-zinc-500 mt-0.5">{duration.toFixed(0)}s</p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handlePreview}
            disabled={isExpired || loadingPreview}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loadingPreview ? "..." : previewUrl ? "✕ Fechar" : "▶ Preview"}
          </button>
          <button
            onClick={() => onDownload(id)}
            disabled={isExpired}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⬇ Download
          </button>
        </div>
      </div>

      {previewUrl && (
        <video
          src={previewUrl}
          controls
          autoPlay
          className="w-full rounded-lg bg-black"
          style={{ maxHeight: "360px" }}
        />
      )}

      {days !== null && (
        <div className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 ${
          isExpired
            ? "bg-error/10 text-error border border-error/20"
            : isUrgent
            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            : "bg-zinc-800/50 text-zinc-500"
        }`}>
          <span>{isExpired ? "🗑" : isUrgent ? "⚠️" : "🕐"}</span>
          {isExpired
            ? "Clipe expirado — arquivo removido"
            : days === 1
            ? "Expira amanhã — baixe agora!"
            : `Disponível por mais ${days} dias`}
        </div>
      )}

      {tiktokDescription && (
        <div className="text-xs text-zinc-400 bg-bg-elevated rounded-lg p-3">
          <span className="text-zinc-600 font-medium">TikTok: </span>
          {tiktokDescription}
        </div>
      )}
      {instagramDescription && (
        <div className="text-xs text-zinc-400 bg-bg-elevated rounded-lg p-3">
          <span className="text-zinc-600 font-medium">Instagram: </span>
          {instagramDescription}
        </div>
      )}
    </div>
  );
}
