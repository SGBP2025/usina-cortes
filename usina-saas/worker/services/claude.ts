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

  // Enviar transcript completo — Claude Haiku tem 200K tokens de contexto
  // e o custo de input para 1h de vídeo (~9000 palavras) é < $0,01
  // Fallback models (llama, etc.) têm contexto menor: limitamos a 6000 palavras para eles
  const FULL_TRANSCRIPT = transcription
    .map((w) => `[${w.start.toFixed(1)}s] ${w.word}`)
    .join(" ");
  const FALLBACK_TRANSCRIPT = transcription.slice(0, 6000)
    .map((w) => `[${w.start.toFixed(1)}s] ${w.word}`)
    .join(" ");

  const MODELS = [
    "z-ai/glm-5.1",
    "anthropic/claude-sonnet-4-5",
    "openai/gpt-4o",
  ];

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Modelos com contexto grande recebem o transcript completo
  const LARGE_CONTEXT_MODELS = ["z-ai/glm-5.1", "anthropic/claude-sonnet-4-5", "anthropic/claude-3.5-sonnet", "anthropic/claude-3.5-haiku", "openai/gpt-4o", "openai/gpt-4o-mini"];

  const callModel = async (model: string) => {
    const transcript = LARGE_CONTEXT_MODELS.includes(model) ? FULL_TRANSCRIPT : FALLBACK_TRANSCRIPT;
    console.log(`[Worker] Modelo ${model}: enviando ${transcription.length} palavras${LARGE_CONTEXT_MODELS.includes(model) ? " (completo)" : " (limitado a 6000)"}`);

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
        max_tokens: 4096,
        messages: [
        {
          role: "user",
          content: `Você é um especialista em criação de conteúdo viral para redes sociais.
Analise esta transcrição e selecione os 3-5 melhores momentos para clips virais (entre 15-90 segundos cada).

O QUE DEVE SER UM BOM CLIP:
- Contém uma ideia COMPLETA: começa, desenvolve e conclui. O espectador entende a mensagem sem precisar ver o resto do vídeo.
- Pode ser uma história curta, um insight poderoso, uma virada, uma provocação com resposta, uma lição de vida.
- O clip deve TERMINAR com a conclusão da ideia — nunca com uma deixa como "deixa eu explicar", "vou mostrar", "como vou falar sobre" sem a explicação vir logo depois.

O QUE NUNCA DEVE SER UM CLIP:
- Apresentação pessoal ou introdução ("vou me apresentar", "meu nome é", "hoje vou falar sobre")
- Transição entre assuntos
- Momentos que terminam em gancho sem resolver ("e aí eu descobri que..." — fim)
- Conteúdo sem começo claro (iniciando no meio de um raciocínio)

REGRAS DE TIMESTAMP:
- O "start" deve coincidir com o início de uma frase completa — NUNCA no meio de uma frase em andamento.
- O "end" deve ser imediatamente após a última palavra da conclusão da ideia (máximo 0.5s depois).
- NUNCA corte no meio de uma frase.

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
        const raw = JSON.stringify(data).substring(0, 300);
        lastError = `OpenRouter retornou resposta vazia (${model}): ${raw}`;
        console.log(`[Worker] Resposta bruta: ${raw}`);
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
