-- ================================================================
-- RLS / privilege hardening — APPLIED to the live project
-- (qsklgxeovoegxxiutkzh) via MCP migrations on 2026-06-21.
-- This file is the source-of-truth record; re-running it is idempotent.
--
-- Context: several tables/policies exposed data to the public `anon` role
-- (the anon key is shipped to the browser). All real access now goes through
-- the API routes using the service-role key, which bypasses RLS — so the safe
-- end state is "RLS enabled, no permissive policy" (service-role-only).
-- ================================================================

-- 1) Sensitive tables that were anon-readable/writable -> service-role-only.
--    (notifications: staff notification center; sales_reps: staff name/email/role)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can manage notifications" ON public.notifications;

ALTER TABLE public.sales_reps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read reps" ON public.sales_reps;
DROP POLICY IF EXISTS "Service role can manage reps" ON public.sales_reps;

-- 2) Remove anon/authenticated WRITE surface. Writes go via the service role
--    (/api/contact, /api/chat). analytics_events + kol_database are unused.
DROP POLICY IF EXISTS "contacts_insert" ON public.contacts;
DROP POLICY IF EXISTS "contacts_anon_insert" ON public.contacts;
DROP POLICY IF EXISTS "chat_insert" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_select" ON public.chat_messages;
DROP POLICY IF EXISTS "analytics_insert" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_select" ON public.analytics_events;
DROP POLICY IF EXISTS "kol_insert" ON public.kol_database;
DROP POLICY IF EXISTS "kol_update" ON public.kol_database;
DROP POLICY IF EXISTS "kol_select" ON public.kol_database;
-- (contacts keeps "contacts_select" TO authenticated — harmless; admin reads
--  go via the service role anyway.)

-- 3) Lock down the view-counter RPC. /api/view calls it via the service role,
--    which has its own explicit EXECUTE grant — so revoking the default PUBLIC
--    grant closes anon/authenticated access without breaking the app.
REVOKE EXECUTE ON FUNCTION public.increment_article_view(text) FROM PUBLIC, anon, authenticated;

-- 4) Pin a non-mutable search_path on our functions (bodies already use
--    fully-qualified names + pg_catalog builtins, so '' is safe).
ALTER FUNCTION public.increment_article_view(text) SET search_path = '';
ALTER FUNCTION public.set_updated_at() SET search_path = '';

-- ----------------------------------------------------------------
-- Verify (expect: no anon/authenticated policies; func acl has no `=X` PUBLIC):
--   SELECT tablename, policyname, cmd, roles FROM pg_policies
--   WHERE schemaname='public' ORDER BY tablename;
--
-- Still TODO (manual, not SQL): Dashboard -> Authentication -> enable
--   "Leaked Password Protection" (HaveIBeenPwned).
-- ----------------------------------------------------------------
