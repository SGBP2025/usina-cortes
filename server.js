require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Auto-detectar FFmpeg
function findFFmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    path.join(__dirname, 'ffmpeg', 'ffmpeg.exe'),
    path.join(__dirname, 'ffmpeg', 'bin', 'ffmpeg.exe'),
    'C:/Users/samel/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin/ffmpeg.exe',
  ].filter(Boolean);
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return 'ffmpeg'; // fallback: assume esta no PATH
}
const FFMPEG = findFFmpeg();

// Multer
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);
if (!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'));

// ============================================================
// HELPERS
// ============================================================

function checkEnv() {
  const missing = [];
  if (!process.env.OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
  if (!fs.existsSync(FFMPEG)) missing.push('FFMPEG (binario nao encontrado)');
  return missing;
}

function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    execFile(FFMPEG, args, { maxBuffer: 50 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(new Error(`FFmpeg falhou: ${stderr || err.message}`));
      else resolve({ stdout, stderr });
    });
  });
}

async function extractAudio(videoPath, outputPath) {
  await runFFmpeg([
    '-y', '-i', videoPath,
    '-map', 'a:0', '-vn',
    '-ac', '1', '-ar', '16000',
    '-c:a', 'pcm_s16le',
    outputPath
  ]);
}

async function cutClip(videoPath, outputPath, startSec, duration) {
  await runFFmpeg([
    '-y', '-hide_banner', '-loglevel', 'error',
    '-ss', startSec.toFixed(3),
    '-t', duration.toFixed(3),
    '-i', videoPath,
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1',
    '-c:v', 'libx264', '-crf', '22', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-ac', '2',
    '-movflags', '+faststart',
    outputPath
  ]);
}

async function getVideoDuration(videoPath) {
  const ffprobe = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');
  return new Promise((resolve, reject) => {
    execFile(ffprobe, [
      '-v', 'quiet', '-print_format', 'json', '-show_format', videoPath
    ], (err, stdout) => {
      if (err) reject(err);
      else {
        const info = JSON.parse(stdout);
        resolve(Number(info.format.duration || 0));
      }
    });
  });
}

async function whisperTranscribe(audioPath) {
  const audioBuffer = fs.readFileSync(audioPath);
  const blob = new Blob([audioBuffer], { type: 'audio/wav' });
  const file = new File([blob], 'audio.wav', { type: 'audio/wav' });

  const form = new FormData();
  form.append('file', file);
  form.append('model', 'whisper-1');
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities[]', 'word');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Whisper falhou (${res.status}): ${text}`);
  }
  return res.json();
}

async function selectClips(text, words, videoDuration) {
  const prompt = `Voce e um editor senior de videos curtos. Leia a transcricao COMPLETA e as marcacoes de tempo por palavra para escolher os 3 a 15 momentos MAIS VIRAIS para TikTok/Instagram Reels/YouTube Shorts. Cada clipe deve ter entre 15 e 60 segundos.

CONTRATO DE TEMPO FFMPEG — REQUISITOS OBRIGATORIOS:
- Retorne os timestamps como SEGUNDOS ABSOLUTOS desde o inicio do video.
- Numeros APENAS com ponto decimal (.), ate 3 casas decimais (exemplos: 0, 1.250, 17.350).
- Garanta que 0 <= start < end <= VIDEO_DURATION_SECONDS.
- Cada clipe deve ter entre 15 e 60 segundos.
- Prefira comecar 0.2-0.4s ANTES do gancho (hook) e terminar 0.2-0.4s DEPOIS da conclusao (payoff).
- Use momentos de silencio para cortes naturais; nunca corte no meio de uma palavra ou frase.
- ESTRITAMENTE NENHUM outro formato de tempo alem de segundos absolutos.

VIDEO_DURATION_SECONDS: ${videoDuration}

TRANSCRIPT_TEXT (raw):
${JSON.stringify(text)}

WORDS_JSON (array de {w, s, e} onde s/e sao segundos):
${JSON.stringify(words)}

EXCLUSOES OBRIGATORIAS:
- Sem introducoes/encerramentos genericos ou segmentos apenas de patrocinadores.
- Sem clipes menores que 15s ou maiores que 60s.

SAIDA — RETORNE APENAS JSON VALIDO (sem markdown, sem comentarios):
{
  "shorts": [
    {
      "start": <numero em segundos>,
      "end": <numero em segundos>,
      "video_description_for_tiktok": "<descricao>",
      "video_description_for_instagram": "<descricao>",
      "video_title_for_youtube_short": "<titulo>"
    }
  ]
}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Claude falhou (${res.status}): ${text}`);
  }

  const data = await res.json();
  const responseText = data.content?.[0]?.text || '';
  const cleaned = responseText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  try { return JSON.parse(cleaned); } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) return JSON.parse(m[0]);
  throw new Error('Claude retornou JSON invalido: ' + responseText.slice(0, 500));
}

// ============================================================
// SSE
// ============================================================

function sendEvent(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// ============================================================
// ROTAS
// ============================================================

app.get('/api/status', (req, res) => {
  const missing = checkEnv();
  res.json({ ok: missing.length === 0, missing });
});

app.post('/api/process', upload.single('video'), async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const filePath = req.file.path;
  const fileName = req.file.originalname;

  const keepalive = setInterval(() => {
    sendEvent(res, 'ping', { ts: Date.now() });
  }, 15000);

  try {
    // 1. Extrair audio localmente
    sendEvent(res, 'progress', { step: 1, total: 5, msg: 'Extraindo audio com FFmpeg local...' });
    const audioPath = filePath + '.wav';
    await extractAudio(filePath, audioPath);
    sendEvent(res, 'progress', { step: 1, total: 5, msg: 'Audio extraido!' });

    // 2. Duracao do video
    sendEvent(res, 'progress', { step: 2, total: 5, msg: 'Obtendo duracao do video...' });
    const videoDuration = await getVideoDuration(filePath);
    sendEvent(res, 'progress', { step: 2, total: 5, msg: `Duracao: ${videoDuration.toFixed(0)}s` });

    // 3. Whisper
    sendEvent(res, 'progress', { step: 3, total: 5, msg: 'Transcrevendo com Whisper...' });
    const whisperResult = await whisperTranscribe(audioPath);

    // Limpar audio temporario
    fs.unlinkSync(audioPath);

    const words = (whisperResult.words || []).map(w => ({
      w: w.word,
      s: Math.round(w.start * 1000) / 1000,
      e: Math.round(w.end * 1000) / 1000
    }));

    sendEvent(res, 'progress', {
      step: 3, total: 5,
      msg: `Transcricao OK — ${videoDuration.toFixed(0)}s, ${words.length} palavras`
    });

    // 4. Claude Sonnet — selecionar clipes
    sendEvent(res, 'progress', { step: 4, total: 5, msg: 'Claude Sonnet analisando momentos virais...' });
    const claudeResult = await selectClips(whisperResult.text, words, videoDuration);
    const shorts = claudeResult.shorts || [];

    if (!shorts.length) throw new Error('Claude nao encontrou momentos virais');

    sendEvent(res, 'progress', {
      step: 4, total: 5,
      msg: `${shorts.length} cortes selecionados! Cortando...`
    });

    // 5. Cortar clips localmente
    sendEvent(res, 'progress', { step: 5, total: 5, msg: `Cortando ${shorts.length} clips com FFmpeg local...` });

    const results = [];
    for (let i = 0; i < shorts.length; i++) {
      const s = shorts[i];
      let startSec = Number(s.start);
      let endSec = Number(s.end);
      let duration = endSec - startSec;
      if (duration < 15) endSec = startSec + 15;
      if (duration > 60) endSec = startSec + 60;
      duration = endSec - startSec;

      sendEvent(res, 'progress', {
        step: 5, total: 5,
        msg: `Cortando clip ${i + 1}/${shorts.length} (${startSec.toFixed(1)}s - ${endSec.toFixed(1)}s)...`
      });

      const clipName = `short_${i + 1}.mp4`;
      const clipPath = path.join(downloadsDir, clipName);
      await cutClip(filePath, clipPath, startSec, duration);

      const stat = fs.statSync(clipPath);
      results.push({
        index: i + 1,
        file: clipName,
        start: startSec,
        end: endSec,
        duration,
        size: stat.size,
        tiktok: s.video_description_for_tiktok || '',
        instagram: s.video_description_for_instagram || '',
        youtube: s.video_title_for_youtube_short || ''
      });

      sendEvent(res, 'clip_ready', {
        ...results[results.length - 1],
        downloadUrl: `/downloads/${clipName}`
      });
    }

    // Limpar upload original
    fs.unlinkSync(filePath);

    sendEvent(res, 'done', { clips: results, total: results.length });

  } catch (err) {
    sendEvent(res, 'error', { msg: err.message });
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  clearInterval(keepalive);
  res.end();
});

app.use('/downloads', express.static(downloadsDir));

app.get('/api/clips', (req, res) => {
  const files = fs.readdirSync(downloadsDir)
    .filter(f => f.endsWith('.mp4'))
    .map(f => ({
      name: f,
      url: `/downloads/${f}`,
      size: fs.statSync(path.join(downloadsDir, f)).size
    }));
  res.json(files);
});

app.delete('/api/clips', (req, res) => {
  const files = fs.readdirSync(downloadsDir);
  files.forEach(f => fs.unlinkSync(path.join(downloadsDir, f)));
  res.json({ deleted: files.length });
});

app.listen(PORT, () => {
  const missing = checkEnv();
  console.log(`\n  Usina de Cortes Virais rodando em http://localhost:${PORT}`);
  console.log(`  FFmpeg: ${FFMPEG}\n`);
  if (missing.length) {
    console.log(`  ⚠ Faltam: ${missing.join(', ')}\n`);
  } else {
    console.log(`  ✓ Tudo configurado!\n`);
  }
});
