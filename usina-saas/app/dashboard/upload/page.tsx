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

    const storagePath = `${user.id}/${Date.now()}-${selectedFile.name}`;

    // Gera signed URL no servidor (session do usuário via cookies)
    const signedRes = await fetch("/api/upload/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storagePath }),
    });

    if (!signedRes.ok) {
      const { error } = await signedRes.json();
      setState("error");
      setError(`Erro ao preparar upload: ${error}`);
      return;
    }

    const { token } = await signedRes.json();

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 5, 90));
    }, 200);

    // uploadToSignedUrl do SDK inclui apikey + Authorization automaticamente
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .uploadToSignedUrl(storagePath, token, selectedFile, { cacheControl: "3600" });

    clearInterval(progressInterval);

    if (uploadError) {
      setState("error");
      setError(`Erro no upload: ${uploadError.message}`);
      return;
    }

    setProgress(95);
    setState("processing");

    // Servidor cria video_files + job + enfileira
    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storagePath,
        originalName: selectedFile.name,
        sizeBytes: selectedFile.size,
      }),
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
