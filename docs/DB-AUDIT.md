# Database Audit - Usina de Cortes Virais

**Date:** 2026-03-12
**Agent:** @data-engineer (Dara)
**Phase:** 2 - Database Assessment

---

## Executive Summary

**Status:** ❌ NO DATABASE DETECTED

O projeto atual **não possui banco de dados**. Todas as operações são baseadas em sistema de arquivos:

- `uploads/` - Armazenamento temporário de uploads
- `downloads/` - Armazenamento persistente de clipes gerados

**Impacto:** Para transformar em SaaS com monetização por minuto, é **CRITICAL** implementar uma camada de dados completa.

---

## Current Data Storage

### File-Based Storage Analysis

| Diretório | Propósito | Persistência | Problemas |
|-----------|-----------|--------------|-----------|
| `uploads/` | Uploads temporários durante processamento | ❌ Temporária | - Sem cleanup automático<br>- Acumula arquivos temporários<br>- Não rastreia processamento |
| `downloads/` | Clipes gerados para download | ✅ Persistente | - Sem associação a usuário<br>- Sem histórico de processamento<br>- Sem controle de versão<br>- Permanece para sempre |

### Data Flow Atual

```
User Upload → Multer salva em uploads/ (arquivo temporário)
         ↓
    Processamento (Whisper → Claude → FFmpeg)
         ↓
    Clipes salvos em downloads/ (arquivos permanentes)
         ↓
    Arquivo upload original deletado
         ↓
    Clipes permanecem até deleção manual
```

**Problemas Críticos:**
1. **Zero tracing** - Não há registro de qual usuário processou o quê
2. **No usage metrics** - Impossível calcular custo por minuto
3. **No data persistence** - Re-upload necessário para processar novamente
4. **No multi-tenancy** - Todos os dados são compartilhados globalmente
5. **No data isolation** - Usuários podem acessar clipes de outros
6. **No history** - Sem registro de operações ou métricas

---

## Database Requirements for SaaS (Billing por Minuto)

Para monetização por minuto, são necessárias as seguintes entidades:

### 1. Users Table
```sql
users
├── id (UUID, PK)
├── email (unique, indexed)
├── password_hash (bcrypt/scrypt)
├── stripe_customer_id (nullable)
├── created_at
├── updated_at
└── deleted_at (soft delete)
```

### 2. Plans / Credits Table
```sql
plans
├── id (UUID, PK)
├── name
├── price_per_minute (decimal)
├── min_credits
├── max_concurrent_jobs
├── created_at
└── is_active (boolean)

user_credits
├── id (UUID, PK)
├── user_id (FK → users.id)
├── balance (decimal) - Saldo em minutos ou créditos
├── last_purchased_at
├── created_at
└── updated_at
```

### 3. Processing Jobs Table
```sql
processing_jobs
├── id (UUID, PK)
├── user_id (FK → users.id, NOT NULL)
├── video_file_id (FK → video_files.id)
├── status (enum: pending, processing, completed, failed)
├── credits_used (decimal) - Minutos consumidos
├── started_at
├── completed_at
├── error_message (nullable)
├── metadata (jsonb) - Dados do processamento (APIs usadas, etc)
├── created_at
└── updated_at
```

### 4. Video Files Table
```sql
video_files
├── id (UUID, PK)
├── user_id (FK → users.id, NOT NULL)
├── original_filename
├── storage_path (S3/R2 ou local)
├── file_size (bigint)
├── duration_seconds (decimal)
├── uploaded_at
├── deleted_at (soft delete)
├── created_at
└── updated_at
```

### 5. Generated Clips Table
```sql
generated_clips
├── id (UUID, PK)
├── user_id (FK → users.id, NOT NULL)
├── job_id (FK → processing_jobs.id)
├── original_video_id (FK → video_files.id)
├── clip_index (smallint) - #1, #2, etc.
├── storage_path (onde está o arquivo)
├── start_time (decimal)
├── end_time (decimal)
├── duration_seconds
├── file_size (bigint)
├── metadata (jsonb) - descrições TikTok, Instagram, YouTube
├── created_at
└── deleted_at (soft delete)
```

### 6. Usage Metrics Table
```sql
usage_metrics
├── id (UUID, PK)
├── user_id (FK → users.id, NOT NULL)
├── job_id (FK → processing_jobs.id)
├── metric_type (enum: whisper_seconds, claude_tokens, ffmpeg_seconds)
├── value (decimal)
├── cost_usd (decimal) - Custo estimado
├── recorded_at
└── created_at
```

### 7. Billing Tables
```sql
invoices
├── id (UUID, PK)
├── user_id (FK → users.id, NOT NULL)
├── stripe_invoice_id (unique)
├── amount (decimal)
├── credits_purchased (decimal)
├── status (enum: pending, paid, failed)
├── paid_at
├── created_at
└── updated_at

payments
├── id (UUID, PK)
├── invoice_id (FK → invoices.id)
├── stripe_payment_id (unique)
├── amount (decimal)
├── status (enum: pending, completed, failed)
├── created_at
└── updated_at
```

---

## Recommended Database Technology

### Option 1: Supabase (RECOMMENDED)

**Why:**
- Built-in PostgreSQL com RLS (Row Level Security)
- Auth nativo (email/password, OAuth)
- Edge Functions para processamento assíncrono
- Storage para vídeos/clipes (S3-compatible)
- Realtime para atualizações de progresso
- Free tier generoso para MVP

**Migration Path:**
```bash
npx supabase init
npx supabase db push  # Aplicar schema acima
```

### Option 2: PostgreSQL Direto

**When to use:**
- Full control necessário
- Infraestrutura existente PostgreSQL
- Multi-tenant custom

**Migration Path:**
- Instalar `pg` package
- Criar migrations com `node-pg-migrate` ou similar
- Configurar connection pooling (pgbouncer)

---

## Security Considerations

### Row Level Security (RLS) Policies

**MUST Implement:**

```sql
-- Users só podem ver dados de próprio user_id
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_jobs ON processing_jobs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Same pattern para: video_files, generated_clips, usage_metrics, etc.
```

### Critical Security Requirements

1. **Authentication Required** - TODAS as tabelas exceto `users`
2. **RLS Policies** - Isolar dados por `user_id = auth.uid()`
3. **Service Role** - Edge functions podem bypass RLS com cuidado extremo
4. **Input Validation** - Validar todos os inputs antes de queries
5. **Rate Limiting** - Limitar requisições por usuário
6. **Audit Logging** - Log de todas as operações de billing

---

## Performance Considerations

### Indexes Required

```sql
-- Usuários: login rápido
CREATE INDEX idx_users_email ON users(email);

-- Jobs: consultas por usuário e status
CREATE INDEX idx_jobs_user_status ON processing_jobs(user_id, status);
CREATE INDEX idx_jobs_created_at ON processing_jobs(created_at DESC);

-- Clips: usuário + data
CREATE INDEX idx_clips_user_created ON generated_clips(user_id, created_at DESC);

-- Usage: billing calculations
CREATE INDEX idx_usage_user_date ON usage_metrics(user_id, recorded_at);
```

### Connection Pooling

Recomendado: **Pooler connection** (Supabase)
- Reduz latência de handshake
- Melhora throughput sob carga
- Config: `DATABASE_URL` com `&pgbouncer=true`

---

## Migration Strategy

### Phase 1: Setup (Day 1)
1. Criar projeto Supabase
2. Inicializar `supabase/` no projeto
3. Criar migrations iniciais (`supabase/migrations/`)

### Phase 2: Core Schema (Day 2-3)
1. Migrations para `users`, `user_credits`
2. Migrations para `plans` (pré-carregar planos)
3. Teste de autenticação

### Phase 3: Processing Tables (Day 4-5)
1. Migrations para `video_files`, `processing_jobs`
2. Migrations para `generated_clips`, `usage_metrics`
3. Update server.js para usar database

### Phase 4: Billing Tables (Day 6-7)
1. Migrations para `invoices`, `payments`
2. Stripe integration
3. Teste de fluxo completo

### Phase 5: RLS & Security (Day 8)
1. Criar RLS policies para todas as tabelas
2. Teste de isolamento multi-tenant
3. QA de segurança

---

## Technical Debt - Database Layer

### CRITICAL Issues

1. **No database at all** - File system não escalável para SaaS
2. **No data isolation** - Usuários podem acessar dados de outros
3. **No audit trail** - Impossível rastrear histórico
4. **No billing data** - Monetização por minuto impossível sem tracking

### HIGH Priority

1. **No backup strategy** - Arquivos perdidos se storage falhar
2. **No cleanup automation** - Acumula arquivos eternamente
3. **No versioning** - Clipes sobrescritos sem controle
4. **No migration system** - Mudanças de schema sem rollback

### MEDIUM Priority

1. **No query optimization** - Sem indexes ou análise de performance
2. **No data validation** - Sem constraints no database level
3. **No connection pooling** - Performance degradará sob carga

---

## Cost Estimates

### Supabase Free Tier (Initial MVP)

| Resource | Limit | Estimated Usage | Note |
|-----------|-------|----------------|------|
| Database | 500MB | ~200MB inicial | Adequado para 100-500 usuários iniciais |
| Storage | 1GB | ~500MB inicial | Expandível |
| Bandwidth | 2GB/mês | ~1GB inicial | Expandível |
| Auth | 50k MAUs | ~1k MAUs | Adequado |
| Edge Functions | 500k executions/mês | ~50k/mês | Adequado |

**Estimativa:** Free tier suficiente para MVP com 500-1000 usuários ativos.

### Scaling Pro Tier

| Tamanho | Custo estimado/mês |
|---------|-------------------|
| 1k usuários | ~$50-100 |
| 10k usuários | ~$200-400 |
| 100k usuários | ~$1000-2000 |

---

## Recommendations Summary

### IMMEDIATE (Phase 1-3)

1. ✅ **Setup Supabase project** - Criar conta + projeto
2. ✅ **Create core schema** - users, credits, plans
3. ✅ **Implement auth** - Registro + login flow
4. ✅ **RLS policies** - Isolar todos os dados por usuário

### SHORT TERM (Phase 4-6)

5. ✅ **Processing tables** - jobs, videos, clips
6. ✅ **Usage tracking** - metrics table + counters
7. ✅ **Billing tables** - invoices, payments
8. ✅ **Stripe integration** - Webhook handling

### MEDIUM TERM (Phase 7+)

9. ✅ **Performance tuning** - Indexes, query optimization
10. ✅ **Monitoring** - Slow query logs, performance metrics
11. ✅ **Backup strategy** - Point-in-time recovery

---

## Next Phase

Phase 3: Frontend Assessment → @ux-design-expert

---

**Database Audit Complete**
**Agent:** @data-engineer (Dara)
**Date:** 2026-03-12
**Status:** READY for Phase 3
