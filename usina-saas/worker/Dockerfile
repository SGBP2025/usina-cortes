FROM node:18-alpine

# Instalar FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package.json ./
RUN npm install --production=false

# Copiar código e compilar TypeScript
COPY tsconfig.json ./
COPY src/ ./src/
COPY services/ ./services/
RUN npm run build

# Remover devDependencies
RUN npm prune --production

CMD ["node", "dist/processor.js"]
