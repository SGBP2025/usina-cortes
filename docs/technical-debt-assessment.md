# Technical Debt Assessment - Usina de Cortes Virais (FINAL)

**Date:** 2026-03-12
**Agent:** @architect (Aria)
**Phase:** 8 - Technical Debt Assessment (FINAL)

---

## Executive Summary

**Overall Debt Severity:** 🔴 CRITICAL

**Transformation Required:** KIT → SAAS

O projeto atual é um **kit de desenvolvimento funcional** que requer **transformação arquitetural completa** para operar como SaaS comercializável.

**Investment Required:**
- **Tempo:** 14-18 semanas (3.5-4.5 meses)
- **Custo:** R$ 135.000 - R$ 180.000
- **Equipe:** 2-3 desenvolvedores sêniores ou 1 time completo

---

## Technical Debt Summary by Category

### Debt Overview

| Categoria | Nível | Itens | Impacto |
|-----------|--------|--------|---------|
| **Arquitetura** | 🔴 CRITICAL | 7 | Bloqueia SaaS |
| **Database** | 🔴 CRITICAL | 7 | Bloqueia monetização |
| **Autenticação** | 🔴 CRITICAL | 6 | Bloqueia usuários |
| **Frontend** | 🟠 HIGH | 8 | Experiência pobre |
| **Segurança** | 🔴 CRITICAL | 7 | Risco legal |
| **Performance** | 🟡 MEDIUM | 6 | Escalabilidade limitada |
| **Testing** | 🟠 HIGH | 6 | Bugs não detectados |
| **DevOps** | 🟠 HIGH | 7 | Deploy impossível |
| **TOTAL** | | **54 itens** | |

### Debt Severity Distribution

```
CRITICAL (P0):    27 itens (50%) ████████████████████████████████
HIGH (P1):       17 itens (31%) ██████████████████████
MEDIUM (P2):     10 itens (19%) ████████████
```

---

## Architectural Transformation Required

### Current → Target Architecture

```
CURRENT (Kit Dev)                    TARGET (SaaS)
┌─────────────────────┐              ┌───────────────────────────────────┐
│  Monolith Express  │              │  Microservices + Queue          │
│  server.js (345)  │              │  ┌──────────┐  ┌──────────┐   │
│  No separation     │     ───►  │  API      │  │  Worker   │   │
│  No service layer  │              │  Gateway  │  │  Service   │   │
│  No queue         │              │  (Auth)   │  │  (Process)│   │
└─────────────────────┘              └──────────┘  └──────────┘   │
                                              │              │
┌─────────────────────┐              ┌──────────┐ ┌───────────┐│
│  Vanilla JS HTML   │              │  Next.js  │ │  Supabase ││
│  index.html (463) │     ───►  │  (SSR)    │ │  (PG+RLS) ││
│  No components     │              │  React     │ │           ││
│  No state mgmt     │              │  Zustand   │ └───────────┘│
└─────────────────────┘              │            │ ┌──────────┐ │
                                       └────────────┘ │  Stripe   │ │
                                                      └──────────┘ │
                                                              └────────────┘
```

### Architecture Layers Redesign

#### Layer 1: API Gateway (NEW)

```typescript
// api/gateway/index.ts
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const gateway = express();

// Security
gateway.use(helmet());
gateway.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Routing
gateway.use('/auth', authRoutes);
gateway.use('/api', authMiddleware, apiRoutes);
gateway.use('/webhooks', stripeWebhooks);
gateway.use('/billing', billingRoutes);
```

#### Layer 2: Service Layer (NEW)

```typescript
// services/videoProcessingService.ts
export class VideoProcessingService {
  constructor(
    private transcriber: WhisperService,
    private clipSelector: ClaudeService,
    private processor: FFmpegService,
    private queue: ProcessingQueue
  ) {}

  async processVideo(video: File, userId: string): Promise<ProcessingResult> {
    const jobId = await this.queue.enqueue(video, userId);

    try {
      // Check credits
      const credits = await this.creditService.getBalance(userId);
      if (credits < 1) throw new InsufficientCreditsError();

      // Process async
      await this.queue.process(jobId);

      return { jobId, creditsUsed: video.duration };
    } catch (error) {
      await this.jobService.updateStatus(jobId, 'failed');
      throw error;
    }
  }
}
```

#### Layer 3: Queue System (NEW)

```typescript
// queue/processingQueue.ts
import { Queue, Worker, Job } from 'bull';

export const processingQueue = new Queue('video-processing', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50
  }
});

export const processingWorker = new Worker('video-processing',
  async (job: Job) => {
    const { video, userId } = job.data;
    return await videoProcessingService.processVideo(video, userId);
  },
  { connection: process.env.REDIS_URL }
);
```

---

## Database Architecture Transformation

### Schema Implementation Plan

```sql
-- Migration 1: Core Schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Migration 2: Credits & Plans
CREATE TABLE plans (...);
CREATE TABLE user_credits (...);

-- Migration 3: Processing Tables
CREATE TABLE processing_jobs (...);
CREATE TABLE video_files (...);
CREATE TABLE generated_clips (...);

-- Migration 4: Usage & Billing
CREATE TABLE usage_metrics (...);
CREATE TABLE invoices (...);
CREATE TABLE payments (...);

-- Migration 5: RLS Policies
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_isolation_policy ON processing_jobs
  FOR ALL TO authenticated
  USING (user_id = auth.uid());
```

### Connection Strategy

```typescript
// config/database.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/postgres-js';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000
});

export const db = drizzle(pool);
```

---

## Frontend Architecture Transformation

### Component Migration Plan

```typescript
// Phase 1: Design System Setup
// tokens/colors.ts
export const colors = {
  primary: { base: '#ff6b6b', light: '#ff8a8a', dark: '#cc4c4c' },
  semantic: { success: '#22c55e', warning: '#f59e0b', error: '#ef4444' }
};

// tokens/spacing.ts
export const spacing = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem' };

// Phase 2: Atoms (Week 2-3)
export const Button = ({ variant, size, children, ...props }) => (
  <button className={`btn btn-${variant} btn-${size}`} {...props}>
    {children}
  </button>
);

// Phase 3: Molecules (Week 3-4)
export const DropZone = ({ onDrop, maxSize, accept }) => (
  <div className="drop-zone">
    <input type="file" accept={accept} onChange={handleFile} />
    <Icon type="upload" />
    <p>Arraste ou clique para selecionar</p>
  </div>
);

// Phase 4: Organisms (Week 5-6)
export const ProcessingDashboard = () => (
  <DashboardLayout>
    <CreditBalance />
    <VideoUploader />
    <ProcessingProgress />
    <ClipGrid />
  </DashboardLayout>
);
```

### State Management Strategy

```typescript
// stores/processingStore.ts
import { create } from 'zustand';

interface ProcessingStore {
  currentJob: Job | null;
  clips: Clip[];
  credits: number;
  setJob: (job: Job) => void;
  addClip: (clip: Clip) => void;
  updateCredits: (amount: number) => void;
}

export const useProcessingStore = create<ProcessingStore>((set) => ({
  currentJob: null,
  clips: [],
  credits: 0,
  setJob: (job) => set({ currentJob: job }),
  addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
  updateCredits: (amount) => set((state) => ({ credits: state.credits + amount }))
}));
```

---

## Security Architecture Transformation

### Authentication Flow

```typescript
// api/routes/auth.ts
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // Validate credentials
  const user = await authenticateUser(email, password);

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user.id, email: user.email } });
}

// Middleware
export function authMiddleware(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
```

### Authorization Strategy

```sql
-- Row Level Security for multi-tenancy
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_isolation_policy ON processing_jobs
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Service role (bypass RLS for workers)
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
```

### Rate Limiting Strategy

```typescript
// api/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: (req) => {
    const user = (req as any).user;
    return user?.plan === 'pro' ? 200 : 100;
  },
  keyGenerator: (req) => {
    const user = (req as any).user;
    return user?.id || req.ip;
  },
  message: 'Limite de requisições excedido. Aguarde 15 minutos.'
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 uploads por hora
  message: 'Limite de uploads atingido. Tente novamente em 1 hora.'
});
```

---

## Performance Architecture Transformation

### Caching Strategy

```typescript
// services/cacheService.ts
import { Redis } from 'ioredis';

export class CacheService {
  private redis: Redis;

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage: Transcription cache
const transcriptKey = `transcript:${videoHash}`;
const cached = await cache.get(transcriptKey);
if (cached) return cached;

const result = await whisperService.transcribe(video);
await cache.set(transcriptKey, result, 86400); // 24h
```

### Worker Thread Strategy

```typescript
// workers/ffmpegWorker.ts
import { parentPort, workerData } from 'worker_threads';

async function processVideo({ videoPath, clips }) {
  // FFmpeg processing in worker thread
  for (const clip of clips) {
    await cutClip(videoPath, clip);
  }

  parentPort?.post({ success: true, clipsGenerated: clips.length });
}

processVideo(workerData);
```

---

## Testing Architecture Transformation

### Test Structure Setup

```
tests/
├── unit/
│   ├── services/
│   │   ├── videoProcessingService.test.ts
│   │   ├── transcriptionService.test.ts
│   │   └── creditService.test.ts
│   ├── repositories/
│   │   ├── userRepository.test.ts
│   │   └── jobRepository.test.ts
│   └── utils/
│       ├── ffmpeg.test.ts
│       └── cache.test.ts
├── integration/
│   ├── api/
│   │   ├── auth.test.ts
│   │   ├── upload.test.ts
│   │   └── processing.test.ts
│   └── queue/
│       └── jobQueue.test.ts
└── e2e/
    ├── auth-flow.spec.ts
    ├── upload-process-flow.spec.ts
    └── billing-flow.spec.ts
```

### Test Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' }
  ]
});
```

---

## DevOps Architecture Transformation

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    ports:
      - "3000:3000"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  worker:
    build: .
    command: node dist/worker.js
    depends_on:
      - redis
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up --service
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## Implementation Roadmap

### Sprint 1: Foundation (Weeks 1-2)

**Objetivo:** Base arquitetural para SaaS

| ID | Tarefa | Prioridade | Estimativa |
|----|--------|------------|------------|
| F1-1 | Setup Next.js 14 com TypeScript | P0 | 2 dias |
| F1-2 | Criar projeto Supabase | P0 | 1 dia |
| F1-3 | Implementar schema de banco | P0 | 2 dias |
| F1-4 | Criar autenticação JWT | P0 | 2 dias |
| F1-5 | Setup middleware (auth, rate limit) | P0 | 1 dia |
| F1-6 | Dockerizar aplicação | P1 | 1 dia |
| F1-7 | Setup CI/CD básico | P1 | 1 dia |

**Total Sprint 1:** 10 dias (2 semanas)

### Sprint 2: Core Features (Weeks 3-5)

**Objetivo:** MVP funcional

| ID | Tarefa | Prioridade | Estimativa |
|----|--------|------------|------------|
| F2-1 | UI de registro/login | P0 | 3 dias |
| F2-2 | Dashboard básico | P0 | 2 dias |
| F2-3 | Upload de vídeo com auth | P0 | 2 dias |
| F2-4 | Implementar fila (Bull) | P0 | 2 dias |
| F2-5 | Worker de processamento | P0 | 2 dias |
| F2-6 | Sistema de créditos | P0 | 2 dias |
| F2-7 | Tracking de uso em tempo real | P0 | 2 dias |
| F2-8 | Histórico de jobs | P1 | 2 dias |

**Total Sprint 2:** 17 dias (3.5 semanas)

### Sprint 3: Billing (Weeks 6-7)

**Objetivo:** Monetização por minuto

| ID | Tarefa | Prioridade | Estimativa |
|----|--------|------------|------------|
| F3-1 | Integração Stripe | P0 | 3 dias |
| F3-2 | Compra de créditos | P0 | 2 dias |
| F3-3 | Geração de invoices | P0 | 2 dias |
| F3-4 | Webhook do Stripe | P0 | 1 dia |
| F3-5 | Dashboard de billing | P1 | 2 dias |
| F3-6 | Rate limit por créditos | P0 | 1 dia |

**Total Sprint 3:** 11 dias (2.5 semanas)

### Sprint 4: Quality & Scale (Weeks 8+)

**Objetivo:** Production-ready

| ID | Tarefa | Prioridade | Estimativa |
|----|--------|------------|------------|
| F4-1 | Testes unit (80% coverage) | P1 | 5 dias |
| F4-2 | Testes de integração | P1 | 3 dias |
| F4-3 | Testes E2E (Playwright) | P2 | 3 dias |
| F4-4 | Monitoramento (Sentry) | P1 | 2 dias |
| F4-5 | Performance tuning | P2 | 2 dias |
| F4-6 | Security audit & hardening | P0 | 2 dias |
| F4-7 | Accessibility (WCAG AA) | P1 | 2 dias |
| F4-8 | Responsive design completa | P1 | 2 dias |

**Total Sprint 4:** 21 dias (4 semanas)

### Total Implementation: 10 semanas (2.5 meses)

---

## Risk Assessment

### Technical Risks

| Risco | Probabilidade | Impacto | Mitigação |
|--------|-------------|----------|-----------|
| Escalabilidade do Redis | Baixa | Alto | Testar carga early |
| Integração Stripe complexa | Média | Alto | Usar bibliotecas testadas |
| Performance FFmpeg | Alta | Alto | Worker threads |
| RLS bugs | Média | Alto | QA extensivo |

### Business Risks

| Risco | Probabilidade | Impacto | Mitigação |
|--------|-------------|----------|-----------|
| Custos de API superam receita | Média | Alto | Pricing strategy |
| Competidores lançam similar | Alta | Alto | Time-to-market |
| Usuários não adotam | Média | Médio | Onboarding otimizado |
| Churn alto | Média | Alto | Suporte + features |

### Timeline Risks

| Risco | Probabilidade | Impacto | Mitigação |
|--------|-------------|----------|-----------|
| Estimativas otimistas | Alta | Médio | Buffer 20% |
| Scope creep | Média | Alto | Epic rigoroso |
| Key developer churn | Baixa | Alto | Documentação extensa |

---

## Recommendations Summary

### DO IMMEDIATE (Critical)

1. ✅ **Priorizar segurança** - Auth é blocker absoluto
2. ✅ **Iniciar com database** - Tudo depende disso
3. ✅ **Definir pricing** - Sem monetização, sem ROI
4. ✅ **Setup testes early** - Custo fixar bugs aumenta exponencialmente

### DO SOON (High Priority)

5. ✅ **Implementar fila** - Performance e escalabilidade
6. ✅ **Migrar frontend** - UX ruim impede conversão
7. ✅ **Integrar billing** - Revenue needed ASAP
8. ✅ **Setup CI/CD** - Deploy manual não escala

### DO LATER (Medium Priority)

9. ✅ **Analytics dashboard** - Insights para produto
10. ✅ **A/B testing framework** - Otimização de conversão
11. ✅ **Admin panel** - Gestão de usuários e suporte
12. ✅ **API para parceiros** - Futura expansão

---

## Next Phase

Phase 9: Executive Report → @analyst

---

**Technical Debt Assessment Complete (FINAL)**
**Agent:** @architect (Aria)
**Date:** 2026-03-12
**Verdict:** Transformação completa documentada
**Status:** READY for Phase 9
