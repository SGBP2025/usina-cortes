import { spawn } from "child_process";
import * as path from "path";

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

const SCRIPT_PATH = path.join(__dirname, "../../scripts/transcribe.py");
const MODEL_SIZE = process.env.WHISPER_MODEL ?? "small";

export function transcribeAudio(audioPath: string): Promise<WordTimestamp[]> {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", [SCRIPT_PATH, audioPath, MODEL_SIZE]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (chunk) => { stdout += chunk; });
    py.stderr.on("data", (chunk) => { stderr += chunk; });

    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`faster-whisper falhou (código ${code}): ${stderr}`));
      }

      let words: WordTimestamp[];
      try {
        words = JSON.parse(stdout.trim());
      } catch {
        return reject(new Error(`Saída inválida do faster-whisper: ${stdout}`));
      }

      if (!Array.isArray(words) || words.length === 0) {
        return reject(new Error("Transcrição sem palavras — verifique o arquivo de áudio."));
      }

      resolve(words);
    });

    py.on("error", (err) => reject(new Error(`Erro ao iniciar Python: ${err.message}`)));
  });
}
