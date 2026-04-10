import Anthropic from "@anthropic-ai/sdk";
import type { WordTimestamp } from "./whisper";

export interface Clip {
  start: number;
  end: number;
  tiktok_description: string;
  instagram_description: string;
  youtube_title: string;
}

let anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY não configurado");
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

export async function selectViralMoments(
  transcription: WordTimestamp[]
): Promise<Clip[]> {
  const client = getAnthropic();

  const transcript = transcription
    .map((w) => `[${w.start.toFixed(1)}s] ${w.word}`)
    .join(" ");

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Você é um especialista em criação de conteúdo viral para redes sociais.
Analise esta transcrição e selecione os 3-5 melhores momentos para clips virais (entre 15-90 segundos cada).

Transcrição com timestamps:
${transcript}

Retorne APENAS um JSON válido (sem markdown, sem explicação) neste formato:
[
  {
    "start": 10.5,
    "end": 45.2,
    "tiktok_description": "Descrição otimizada para TikTok com hashtags relevantes #viral",
    "instagram_description": "Descrição para Instagram com emojis e hashtags",
    "youtube_title": "Título atrativo para YouTube Shorts"
  }
]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Claude retornou resposta inesperada");
  }

  let clips: Clip[];
  try {
    // Remover possível markdown code block
    const jsonStr = content.text.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    clips = JSON.parse(jsonStr);
  } catch {
    throw new Error(`Claude retornou JSON inválido: ${content.text.substring(0, 200)}`);
  }

  if (!Array.isArray(clips) || clips.length === 0) {
    throw new Error("Claude não identificou momentos virais no vídeo");
  }

  return clips;
}
