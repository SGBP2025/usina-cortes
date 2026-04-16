import { execSync } from "child_process";
import * as path from "path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpeg = require("fluent-ffmpeg");

function detectFfmpegPath(): string {
  const candidates = [
    "/usr/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
    "/opt/homebrew/bin/ffmpeg",
    "ffmpeg",
  ];

  try {
    const result = execSync("which ffmpeg", { encoding: "utf-8" }).trim();
    if (result) return result;
  } catch {
    // which falhou — testar caminhos candidatos
  }

  for (const candidate of candidates) {
    try {
      execSync(`${candidate} -version`, { stdio: "ignore" });
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error("FFmpeg não encontrado. Instale via: brew install ffmpeg (Mac) ou apt-get install ffmpeg (Linux)");
}

// Configura o path do FFmpeg uma vez
const ffmpegPath = detectFfmpegPath();
ffmpeg.setFfmpegPath(ffmpegPath);

export async function extractAudio(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate("32k")
      .audioFrequency(16000)
      .audioChannels(1)
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err: Error) => reject(err))
      .run();
  });
}

export async function cutClip(
  inputPath: string,
  outputPath: string,
  startSeconds: number,
  endSeconds: number
): Promise<void> {
  const duration = endSeconds - startSeconds;
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .seekInput(startSeconds)
      .duration(duration)
      .videoCodec("copy")  // sem re-encoding — rápido e sem uso de memória
      .audioCodec("copy")
      .outputOptions(["-avoid_negative_ts make_zero"])
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err: Error) => reject(err))
      .run();
  });
}

export function getVideoDuration(inputPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err: Error | null, metadata: { format?: { duration?: number } }) => {
      if (err) return reject(err);
      const duration = metadata?.format?.duration;
      if (!duration) return reject(new Error("Não foi possível obter duração do vídeo"));
      resolve(duration);
    });
  });
}

export function getOutputPath(dir: string, filename: string): string {
  return path.join(dir, filename);
}
