-- ============================================================
-- plus. CRM — support importing real businesses from the
-- official Google Places API into the leads pipeline.
-- Idempotent. Run once (after crm.sql).
-- ============================================================

-- Google Places place_id, used to dedupe re-imports.
alter table public.leads add column if not exists place_id text;
alter table public.leads add column if not exists website  text;
alter table public.leads add column if not exists address  text;

-- Business leads (phone-only) may have no email — allow NULL.
alter table public.leads alter column email drop not null;

-- Unique per place_id (Postgres treats NULLs as distinct, so existing
-- non-Places leads with NULL place_id are unaffected).
create unique index if not exists idx_leads_place_id on public.leads (place_id);
