"use client";

import { useCallback, useState } from "react";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED = ["video/mp4", "video/quicktime", "video/x-msvideo"];
const MAX_SIZE_MB = 4096; // 4GB — vídeos grandes são comprimidos automaticamente no browser

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    if (!ACCEPTED.includes(file.type)) return "Formato inválido. Use MP4, MOV ou AVI.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `Arquivo muito grande. Máximo ${MAX_SIZE_MB}MB.`;
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError(null);
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label
        className={`
          flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed
          p-12 cursor-pointer transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragging ? "border-brand-primary bg-brand-primary/5" : "border-zinc-700 hover:border-zinc-500 bg-bg-elevated"}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <div className="text-5xl">🎬</div>
        <div className="text-center">
          <p className="text-white font-medium">Arraste seu vídeo aqui</p>
          <p className="text-sm text-zinc-400 mt-1">ou clique para selecionar</p>
          <p className="text-xs text-zinc-600 mt-2">MP4, MOV ou AVI • Até 4GB</p>
        </div>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo"
          onChange={onInputChange}
          disabled={disabled}
          className="hidden"
        />
      </label>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
