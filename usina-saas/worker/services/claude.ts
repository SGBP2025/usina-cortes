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

  // Apenas modelos confirmados ativos (429 = existe mas rate limited, 404 = removido)
  const MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-3-27b-it:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
  ];

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const callModel = async (model: string) => {
    return fetch("https://openrouter.ai/api/v1/chat/completions", {
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
  };

  let lastError = "";
  // Para cada modelo, tenta até 3x com backoff em caso de 429
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const response = await callModel(model);

      if (!response.ok) {
        const err = await response.text();
        lastError = `OpenRouter erro ${response.status} (${model}): ${err.substring(0, 200)}`;
        if (response.status === 429) {
          const delay = attempt * 10000; // 10s, 20s, 30s
          console.log(`[Worker] Modelo ${model} rate limited, aguardando ${delay/1000}s (tentativa ${attempt}/3)...`);
          await sleep(delay);
          continue; // retry mesmo modelo
        }
        console.log(`[Worker] Modelo ${model} falhou (${response.status}), próximo modelo...`);
        break; // 404 ou outro erro: pula para próximo modelo
      }

      const data = await response.json() as { choices?: { message?: { content?: string } }[] };
      const text: string = data.choices?.[0]?.message?.content ?? "";

      if (!text) {
        lastError = `OpenRouter retornou resposta vazia (${model})`;
        break;
      }

      let clips: Clip[];
      try {
        const jsonStr = text.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
        clips = JSON.parse(jsonStr);
      } catch {
        lastError = `OpenRouter retornou JSON inválido (${model}): ${text.substring(0, 200)}`;
        break;
      }

      if (!Array.isArray(clips) || clips.length === 0) {
        lastError = `Modelo ${model} não identificou momentos virais`;
        break;
      }

      console.log(`[Worker] Modelo ${model} selecionou ${clips.length} clips`);
      return clips;
    }
  }

  throw new Error(lastError || "Todos os modelos falharam");
}
