FROM node:18-slim

# Instalar FFmpeg + Python
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Instalar faster-whisper
RUN pip3 install --no-cache-dir faster-whisper --break-system-packages

WORKDIR /app

COPY package.json ./
RUN npm install --production=false

COPY tsconfig.json ./
COPY src/ ./src/
COPY services/ ./services/
COPY scripts/ ./scripts/
RUN npm run build

RUN npm prune --production

# small = bom equilíbrio qualidade/velocidade em CPU
# Trocar para "medium" se Railway tiver plano com mais RAM
ENV WHISPER_MODEL=small

CMD ["node", "dist/src/processor.js"]
