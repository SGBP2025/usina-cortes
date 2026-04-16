import type { WordTimestamp } from "./whisper";

export interface Clip {
  start: number;
  end: number;
  tiktok_description: string;
  instagram_description: string;
  youtube_title: string;
}

interface Sentence {
  text: string;
  start: number;
  end: number;
}

// Agrupa palavras em frases completas usando pontuação e pausas longas.
// Isso garante que o AI só consiga selecionar timestamps que correspondem
// a limites naturais de frase — nunca no meio de uma frase.
function groupIntoSentences(words: WordTimestamp[]): Sentence[] {
  const sentences: Sentence[] = [];
  let current: Sentence | null = null;
  const MAX_SENTENCE_SECONDS = 15; // força quebra após 15s sem pontuação
  const PAUSE_THRESHOLD = 1.2; // pausa > 1.2s = nova frase

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = words[i + 1];

    if (!current) {
      current = { text: word.word, start: word.start, end: word.end };
    } else {
      current.text += " " + word.word;
      current.end = word.end;
    }

    const trimmed = word.word.trim();
    const endsWithPunct = /[.!?]$/.test(trimmed);
    const longPause = nextWord ? (nextWord.start - word.end) > PAUSE_THRESHOLD : true;
    const tooLong = current.end - current.start >= MAX_SENTENCE_SECONDS;

    if (endsWithPunct || longPause || tooLong || i === words.length - 1) {
      sentences.push(current);
      current = null;
    }
  }

  return sentences;
}

export async function selectViralMoments(
  transcription: WordTimestamp[]
): Promise<Clip[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY não configurado");

  const sentences = groupIntoSentences(transcription);

  // Formata como "FRASE_ID [start → end] texto" para que o AI copie os timestamps exatos
  const formatSentences = (sents: Sentence[]) =>
    sents.map((s, i) => `S${i + 1} [${s.start.toFixed(1)} → ${s.end.toFixed(1)}] ${s.text}`).join("\n");

  const FULL_TRANSCRIPT = formatSentences(sentences);
  const FALLBACK_TRANSCRIPT = formatSentences(sentences.slice(0, 800));

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

A transcrição abaixo está dividida em FRASES NUMERADAS. Cada frase tem um ID (S1, S2...) e timestamps exatos de início e fim.

COMO SELECIONAR UM CLIP:
1. Encontre um bloco de frases consecutivas que forme uma ideia COMPLETA (15-90 segundos no total).
2. Use o "start" da primeira frase do bloco e o "end" da última frase do bloco — COPIADOS EXATAMENTE da lista.
3. O clip deve ser autocontido: o espectador entende a mensagem sem ver o resto do vídeo.

TIPOS DE CONTEÚDO IDEAL:
- História curta com começo, meio e fim
- Insight ou lição de vida com explicação completa
- Argumento com tese, desenvolvimento e conclusão
- Pergunta retórica com a resposta incluída no mesmo clip

NUNCA SELECIONAR:
- Apresentações pessoais ("meu nome é", "hoje vou falar sobre")
- Transições entre assuntos
- Frases que terminam em gancho sem resolução ("vou explicar agora..." — sem a explicação)
- Frases que começam no meio de um raciocínio anterior

REGRA ABSOLUTA:
- Os valores de "start" e "end" no JSON devem ser COPIADOS EXATAMENTE dos timestamps da lista (não invente ou ajuste).
- start = timestamp "→ início" da primeira frase selecionada
- end = timestamp "→ fim" da última frase selecionada

Transcrição em frases:
${transcript}

Retorne APENAS um JSON válido (sem markdown, sem explicação):
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
