import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const COMPRESS_THRESHOLD_MB = 200; // comprime arquivos > 200MB

export function needsCompression(file: File): boolean {
  return file.size > COMPRESS_THRESHOLD_MB * 1024 * 1024;
}

export async function compressVideo(
  file: File,
  onProgress: (progress: number) => void
): Promise<File> {
  const ffmpeg = new FFmpeg();

  ffmpeg.on("progress", ({ progress }) => {
    onProgress(Math.round(progress * 100));
  });

  // Carrega ffmpeg.wasm (single-thread para evitar problemas de COOP/COEP em dev)
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  const inputName = "input.mp4";
  const outputName = "output.mp4";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // CRF 28 = boa qualidade com ~70-80% de redução de tamanho
  // scale=-2:720 = limita a 720p mantendo proporção
  await ffmpeg.exec([
    "-i", inputName,
    "-vcodec", "libx264",
    "-crf", "28",
    "-preset", "fast",
    "-vf", "scale=-2:720",
    "-acodec", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);
  const blob = new Blob([data], { type: "video/mp4" });

  // Retorna um File com mesmo nome do original
  return new File([blob], file.name.replace(/\.[^.]+$/, ".mp4"), {
    type: "video/mp4",
  });
}
