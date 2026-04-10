-- ============================================================
-- Migration 004: Billing MercadoPago
-- ============================================================

-- Adapta tabela invoices para suportar MercadoPago
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS mp_preference_id  TEXT,
  ADD COLUMN IF NOT EXISTS mp_payment_id     TEXT,
  ADD COLUMN IF NOT EXISTS minutes_purchased INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pack_id           TEXT;

CREATE INDEX IF NOT EXISTS idx_invoices_mp_preference ON invoices(mp_preference_id);
CREATE INDEX IF NOT EXISTS idx_invoices_mp_payment    ON invoices(mp_payment_id);

-- ============================================================
-- RPC: add_purchased_credits
-- Chamada pelo webhook (service_role) após pagamento aprovado
-- ============================================================
CREATE OR REPLACE FUNCTION add_purchased_credits(
  p_user_id   UUID,
  p_minutes   INTEGER,
  p_invoice_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Evita crédito duplicado se webhook for chamado 2x
  IF EXISTS (
    SELECT 1 FROM invoices
    WHERE id = p_invoice_id AND status = 'paid'
  ) THEN
    RETURN;
  END IF;

  -- Marca invoice como paga
  UPDATE invoices
  SET status = 'paid'
  WHERE id = p_invoice_id;

  -- Adiciona créditos ao usuário
  UPDATE user_credits
  SET
    balance_minutes  = balance_minutes  + p_minutes,
    total_purchased  = total_purchased  + p_minutes,
    updated_at       = NOW()
  WHERE user_id = p_user_id;
END;
$$;
