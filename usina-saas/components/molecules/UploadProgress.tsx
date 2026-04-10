interface UploadProgressProps {
  filename: string;
  progress: number; // 0-100
}

export function UploadProgress({ filename, progress }: UploadProgressProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">Enviando vídeo...</p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-xs">{filename}</p>
        </div>
        <span className="text-sm font-bold text-brand-primary">{progress}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2">
        <div
          className="bg-brand-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
