-- Adiciona campo expires_at em generated_clips
-- Clipes são deletados do R2 após 7 dias — cliente precisa baixar antes.

ALTER TABLE generated_clips
  ADD COLUMN IF NOT EXISTS expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days');

-- Backfill de clipes já existentes (7 dias a partir da criação)
UPDATE generated_clips
  SET expires_at = created_at + interval '7 days'
  WHERE expires_at = (now() + interval '7 days'); -- só os que ainda estão no default
