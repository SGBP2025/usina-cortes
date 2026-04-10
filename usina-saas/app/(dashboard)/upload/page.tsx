"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DropZone } from "@/components/molecules/DropZone";
import { UploadProgress } from "@/components/molecules/UploadProgress";
import { Button } from "@/components/atoms/Button";

type UploadState = "idle" | "uploading" | "processing" | "error";

export default function UploadPage() {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setState("uploading");
    setError(null);
    setProgress(0);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setState("error"); setError("Sessão expirada. Faça login novamente."); return; }

    // Upload direto para Supabase Storage (client-side, sem proxy Next.js)
    const storagePath = `${user.id}/${Date.now()}-${selectedFile.name}`;

    // Simular progresso enquanto faz upload (XMLHttpRequest para progresso real)
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 5, 90));
    }, 200);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("videos")
      .upload(storagePath, selectedFile, { upsert: false });

    clearInterval(progressInterval);

    if (uploadError || !uploadData) {
      setState("error");
      setError("Erro no upload. Tente novamente.");
      return;
    }

    setProgress(95);

    // Inserir registro em video_files
    const { data: videoFile, error: dbError } = await supabase
      .from("video_files")
      .insert({
        user_id: user.id,
        storage_path: storagePath,
        original_name: selectedFile.name,
        size_bytes: selectedFile.size,
      })
      .select("id")
      .single();

    if (dbError || !videoFile) {
      setState("error");
      setError("Erro ao registrar arquivo. Tente novamente.");
      return;
    }

    setState("processing");

    // Chamar API para criar job e enfileirar
    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoFileId: videoFile.id, storagePath }),
    });

    const json = await res.json();

    if (!res.ok) {
      setState("error");
      setError(json.error ?? "Erro ao iniciar processamento.");
      return;
    }

    setProgress(100);
    router.push(`/dashboard/jobs/${json.jobId}`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload de vídeo</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Envie um vídeo para gerar clipes virais automaticamente com IA.
        </p>
      </div>

      {state === "idle" && (
        <>
          <DropZone onFileSelect={setSelectedFile} />
          {selectedFile && (
            <div className="rounded-xl border border-zinc-800 bg-bg-surface p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                <p className="text-xs text-zinc-500">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
              <Button onClick={handleUpload} className="w-auto px-6">
                Processar vídeo
              </Button>
            </div>
          )}
        </>
      )}

      {(state === "uploading" || state === "processing") && selectedFile && (
        <UploadProgress filename={selectedFile.name} progress={progress} />
      )}

      {state === "error" && (
        <div className="rounded-xl border border-error/30 bg-error/5 p-6 space-y-4">
          <p className="text-error">{error}</p>
          <Button variant="ghost" onClick={() => { setState("idle"); setSelectedFile(null); }}>
            Tentar novamente
          </Button>
        </div>
      )}
    </div>
  );
}
