-- ============================================================
-- Migration 005: RPC consume_job_credits
-- Chamada pelo worker após job concluído para descontar créditos
-- ============================================================

CREATE OR REPLACE FUNCTION consume_job_credits(
  p_user_id   UUID,
  p_job_id    UUID,
  p_minutes   NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Evita duplo desconto se worker chamar 2x
  IF EXISTS (
    SELECT 1 FROM processing_jobs
    WHERE id = p_job_id AND credits_consumed IS NOT NULL AND status = 'completed'
  ) THEN
    RETURN;
  END IF;

  -- Desconta do saldo e acumula total consumido
  UPDATE user_credits
  SET
    balance_minutes = GREATEST(balance_minutes - p_minutes, 0),
    total_consumed  = total_consumed + p_minutes,
    updated_at      = NOW()
  WHERE user_id = p_user_id;
END;
$$;
