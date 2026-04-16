import * as fs from "fs";

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

export async function transcribeAudio(audioPath: string): Promise<WordTimestamp[]> {
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY não configurada");

  const fileBuffer = fs.readFileSync(audioPath);
  const blob = new Blob([fileBuffer], { type: "audio/wav" });

  const form = new FormData();
  form.append("file", blob, "audio.wav");
  form.append("model", "whisper-large-v3-turbo");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq Whisper falhou (${res.status}): ${err}`);
  }

  const data = await res.json() as { words?: { word: string; start: number; end: number }[] };

  const words = data.words ?? [];
  if (words.length === 0) throw new Error("Transcrição sem palavras — verifique o arquivo de áudio.");

  return words.map((w) => ({ word: w.word, start: w.start, end: w.end }));
}
