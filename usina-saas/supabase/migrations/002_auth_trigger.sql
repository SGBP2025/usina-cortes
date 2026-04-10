-- ============================================================
-- USINA DE CORTES VIRAIS — Migration 002: Auth Trigger
-- Cria user_credits automaticamente após novo registro
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, plan_id, balance_minutes, total_purchased, total_consumed)
  VALUES (NEW.id, 'starter', 30, 30, 0);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
