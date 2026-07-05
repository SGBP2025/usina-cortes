-- ============================================================
-- Migration 007: Hardening de RLS — invoices e processing_jobs
-- ============================================================
-- Contexto (auditoria fix/audit-jul05):
--
-- 1) invoices (CRÍTICO — compra quebrava com 500):
--    A migration 001 já criava a policy de invoices apenas FOR SELECT
--    ("invoices: own data only"). Ou seja, o usuário NUNCA teve permissão
--    de INSERT/UPDATE na tabela. A rota /api/billing/create-preference
--    fazia INSERT + UPDATE em invoices com o client do usuário → a RLS
--    negava a escrita → 500 e a compra nunca era registrada.
--    FIX (no código): create-preference passou a usar o service role client
--    (createServiceClient) para o INSERT/UPDATE em invoices. O webhook já
--    usava service role. Esta migration apenas REAFIRMA/DOCUMENTA que a
--    escrita em invoices é feita exclusivamente por service role
--    (que ignora RLS) e mantém a policy do usuário como SELECT-only.
--
-- 2) processing_jobs (CRÍTICO — processamento grátis):
--    A migration 001 dava ao usuário uma policy FOR ALL
--    ("processing_jobs: own data only"), permitindo UPDATE arbitrário.
--    Um usuário podia dar UPDATE no próprio job (status='completed',
--    credits_consumed=0), fazendo o job "concluir" sem débito e pulando
--    o consume_job_credits. FIX: restringir o usuário a FOR SELECT.
--    A escrita legítima é feita apenas pelo worker (Railway) via
--    SUPABASE_SERVICE_ROLE_KEY, que bypassa RLS. A rota /api/jobs/create
--    passou a inserir/atualizar o job também via service role client.
-- ============================================================

-- ------------------------------------------------------------
-- invoices: garantir SELECT-only para o usuário (escrita = service role)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "invoices: own data only" ON invoices;

CREATE POLICY "invoices: select own only" ON invoices
  FOR SELECT
  USING (auth.uid() = user_id);

-- Sem policy de INSERT/UPDATE/DELETE para o usuário: apenas o service role
-- (create-preference e webhook) escreve em invoices.

-- ------------------------------------------------------------
-- processing_jobs: derrubar FOR ALL do usuário, deixar SELECT-only
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "processing_jobs: own data only" ON processing_jobs;

CREATE POLICY "processing_jobs: select own only" ON processing_jobs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Sem policy de INSERT/UPDATE/DELETE para o usuário: a criação do job
-- (/api/jobs/create) e toda a evolução de status/credits_consumed são
-- feitas via SUPABASE_SERVICE_ROLE_KEY (bypassa RLS). Isso remove o
-- exploit de marcar job como completed com credits_consumed=0.
