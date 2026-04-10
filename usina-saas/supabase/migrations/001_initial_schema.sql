-- ============================================================
-- USINA DE CORTES VIRAIS — Migration 001: Schema Inicial
-- ============================================================

-- ENUM para status de jobs
CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'error', 'cancelled');

-- ENUM para serviços de IA
CREATE TYPE ai_service AS ENUM ('whisper', 'claude', 'ffmpeg');

-- ============================================================
-- TABELA: plans
-- ============================================================
CREATE TABLE plans (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  price_per_minute NUMERIC(10,4) NOT NULL,
  included_minutes INTEGER NOT NULL DEFAULT 0,
  concurrent_jobs  INTEGER NOT NULL DEFAULT 1,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- plans NÃO tem RLS — dados públicos de pricing

-- ============================================================
-- TABELA: user_credits
-- ============================================================
CREATE TABLE user_credits (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id          TEXT NOT NULL REFERENCES plans(id),
  balance_minutes  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_purchased  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_consumed   NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_credits: own data only" ON user_credits
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TABELA: video_files
-- ============================================================
CREATE TABLE video_files (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path   TEXT NOT NULL,
  original_name  TEXT NOT NULL,
  size_bytes     BIGINT,
  duration_seconds NUMERIC(10,2),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE video_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "video_files: own data only" ON video_files
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TABELA: processing_jobs
-- ============================================================
CREATE TABLE processing_jobs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_file_id     UUID REFERENCES video_files(id) ON DELETE SET NULL,
  status            job_status NOT NULL DEFAULT 'pending',
  credits_consumed  NUMERIC(10,2),
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "processing_jobs: own data only" ON processing_jobs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TABELA: generated_clips
-- ============================================================
CREATE TABLE generated_clips (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id               UUID NOT NULL REFERENCES processing_jobs(id) ON DELETE CASCADE,
  video_file_id        UUID REFERENCES video_files(id) ON DELETE SET NULL,
  storage_path         TEXT NOT NULL,
  start_time           NUMERIC(10,2),
  end_time             NUMERIC(10,2),
  duration             NUMERIC(10,2),
  tiktok_description   TEXT,
  instagram_description TEXT,
  youtube_title        TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE generated_clips ENABLE ROW LEVEL SECURITY;

-- RLS via JOIN com processing_jobs (usuário só vê clips de seus jobs)
CREATE POLICY "generated_clips: own jobs only" ON generated_clips
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM processing_jobs pj
      WHERE pj.id = generated_clips.job_id
      AND pj.user_id = auth.uid()
    )
  );

CREATE POLICY "generated_clips: insert own jobs" ON generated_clips
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM processing_jobs pj
      WHERE pj.id = generated_clips.job_id
      AND pj.user_id = auth.uid()
    )
  );

-- ============================================================
-- TABELA: usage_metrics
-- ============================================================
CREATE TABLE usage_metrics (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id           UUID REFERENCES processing_jobs(id) ON DELETE SET NULL,
  service          ai_service NOT NULL,
  cost_usd         NUMERIC(10,6),
  duration_seconds NUMERIC(10,2),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_metrics: own data only" ON usage_metrics
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- TABELA: invoices
-- ============================================================
CREATE TABLE invoices (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_brl                NUMERIC(10,2) NOT NULL,
  stripe_payment_intent_id  TEXT,
  status                    TEXT NOT NULL DEFAULT 'pending',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices: own data only" ON invoices
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_jobs_user_id    ON processing_jobs(user_id);
CREATE INDEX idx_jobs_status     ON processing_jobs(status);
CREATE INDEX idx_clips_job_id    ON generated_clips(job_id);
CREATE INDEX idx_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_video_files_user_id ON video_files(user_id);
CREATE INDEX idx_usage_metrics_user_id ON usage_metrics(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
