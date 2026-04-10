interface ClipCardProps {
  id: string;
  storagePath: string;
  duration: number | null;
  youtubeTitle: string | null;
  tiktokDescription: string | null;
  instagramDescription: string | null;
  onDownload: (storagePath: string) => void;
}

export function ClipCard({
  duration,
  youtubeTitle,
  tiktokDescription,
  instagramDescription,
  storagePath,
  onDownload,
}: ClipCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-bg-surface p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{youtubeTitle ?? "Clip"}</p>
          {duration && (
            <p className="text-xs text-zinc-500 mt-0.5">{duration.toFixed(0)}s</p>
          )}
        </div>
        <button
          onClick={() => onDownload(storagePath)}
          className="flex-shrink-0 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          ⬇ Download
        </button>
      </div>
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
