import OpenAI from "openai";
import * as fs from "fs";

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY não configurado");
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

export async function transcribeAudio(audioPath: string): Promise<WordTimestamp[]> {
  const client = getOpenAI();
  const audioStream = fs.createReadStream(audioPath);

  const response = await client.audio.transcriptions.create({
    file: audioStream,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  if (!response.words || response.words.length === 0) {
    throw new Error("Whisper retornou transcrição sem timestamps de palavras. Verifique o arquivo de áudio.");
  }

  return response.words.map((w) => ({
    word: w.word,
    start: w.start,
    end: w.end,
  }));
}
