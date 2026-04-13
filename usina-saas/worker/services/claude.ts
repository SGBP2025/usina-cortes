import type { WordTimestamp } from "./whisper";

export interface Clip {
  start: number;
  end: number;
  tiktok_description: string;
  instagram_description: string;
  youtube_title: string;
}

export async function selectViralMoments(
  transcription: WordTimestamp[]
): Promise<Clip[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY não configurado");

  const transcript = transcription
    .map((w) => `[${w.start.toFixed(1)}s] ${w.word}`)
    .join(" ");

  const MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "google/gemma-3-27b-it:free",
    "mistralai/mistral-7b-instruct:free",
  ];

  let lastError = "";
  for (const model of MODELS) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://usinadecortes.netlify.app",
        "X-Title": "Usina de Cortes Virais",
      },
      body: JSON.stringify({
        model,
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
    }),
  });

    if (!response.ok) {
      const err = await response.text();
      lastError = `OpenRouter erro ${response.status} (${model}): ${err.substring(0, 200)}`;
      console.log(`[Worker] Modelo ${model} falhou (${response.status}), tentando próximo...`);
      continue;
    }

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const text: string = data.choices?.[0]?.message?.content ?? "";

    if (!text) {
      lastError = `OpenRouter retornou resposta vazia (${model})`;
      continue;
    }

    let clips: Clip[];
    try {
      const jsonStr = text.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
      clips = JSON.parse(jsonStr);
    } catch {
      lastError = `OpenRouter retornou JSON inválido (${model}): ${text.substring(0, 200)}`;
      continue;
    }

    if (!Array.isArray(clips) || clips.length === 0) {
      lastError = `Modelo ${model} não identificou momentos virais`;
      continue;
    }

    console.log(`[Worker] Modelo ${model} selecionou ${clips.length} clips`);
    return clips;
  }

  throw new Error(lastError || "Todos os modelos falharam");
}
