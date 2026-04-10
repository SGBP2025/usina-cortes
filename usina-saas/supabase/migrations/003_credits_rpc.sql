-- ============================================================
-- Migration 003: RPC get_user_credits
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_credits(p_user_id UUID)
RETURNS TABLE (
  balance_minutes   NUMERIC,
  total_purchased   NUMERIC,
  total_consumed    NUMERIC,
  plan_id           TEXT,
  plan_name         TEXT,
  included_minutes  INTEGER,
  concurrent_jobs   INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    uc.balance_minutes,
    uc.total_purchased,
    uc.total_consumed,
    p.id AS plan_id,
    p.name AS plan_name,
    p.included_minutes,
    p.concurrent_jobs
  FROM user_credits uc
  JOIN plans p ON p.id = uc.plan_id
  WHERE uc.user_id = p_user_id
  LIMIT 1;
END;
$$;
