-- ============================================================
-- USINA DE CORTES VIRAIS — Seed: Planos
-- ============================================================

INSERT INTO plans (id, name, price_per_minute, included_minutes, concurrent_jobs) VALUES
  ('starter',  'Starter',  0.10, 30,  1),
  ('pro',      'Pro',      0.08, 100, 2),
  ('business', 'Business', 0.05, 500, 5)
ON CONFLICT (id) DO NOTHING;
