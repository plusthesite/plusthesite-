-- ============================================================
-- Realign CRM data to what we actually sell
-- Run manually in the Supabase SQL Editor after previewing rows.
--
-- Goal: keep the pipeline real so dashboards and forecasts stay useful.
--   1. Remove fabricated demo opportunities + demo leads from seed_crm.sql.
--   2. Review older service tags that may no longer reflect the active offer.
--
-- SAFE / REVERSIBLE-MINDED:
--   - run each PREVIEW select first
--   - confirm the row set by eye
--   - only then run the matching write
-- ============================================================

-- ---- 1a. PREVIEW fabricated seed records -------------------
select 'lead' as kind, name, company, service
from public.leads
where email in (
    'andi@batiknusantara.co.id','siti@kliniksehat.id','budi@edupintar.com',
    'maya@gofreshmart.id','rizky@fitlifegym.co.id','dewi@travelkita.id',
    'hendra@otomart.id','nina@fashionku.co.id','sarah@brightlabs.io','michael@playnova.gg'
)
union all
select 'opportunity', name, company, service
from public.opportunities
where email in (
    'andi@batiknusantara.co.id','siti@kliniksehat.id','budi@edupintar.com',
    'maya@gofreshmart.id','rizky@fitlifegym.co.id','dewi@travelkita.id',
    'hendra@otomart.id','nina@fashionku.co.id','sarah@brightlabs.io','michael@playnova.gg'
);

-- ---- 1b. DELETE fabricated seed records --------------------
-- delete from public.opportunities where email in (
--     'andi@batiknusantara.co.id','siti@kliniksehat.id','budi@edupintar.com',
--     'maya@gofreshmart.id','rizky@fitlifegym.co.id','dewi@travelkita.id',
--     'hendra@otomart.id','nina@fashionku.co.id','sarah@brightlabs.io','michael@playnova.gg'
-- );
-- delete from public.leads where email in (
--     'andi@batiknusantara.co.id','siti@kliniksehat.id','budi@edupintar.com',
--     'maya@gofreshmart.id','rizky@fitlifegym.co.id','dewi@travelkita.id',
--     'hendra@otomart.id','nina@fashionku.co.id','sarah@brightlabs.io','michael@playnova.gg'
-- );

-- ---- 2a. PREVIEW legacy mobile-app records -----------------
-- Keep this preview because earlier sales logic sometimes re-tagged
-- mobile-app interest into other lanes before the service became active.
select count(*) as mobile_app_leads, coalesce(sum(value), 0) as current_value
from public.leads
where service = 'mobile-app';

select count(*) as mobile_app_opportunities, coalesce(sum(value), 0) as current_value
from public.opportunities
where service = 'mobile-app';

-- ---- 2b. OPTIONAL re-tagging example -----------------------
-- Use only if your current commercial model needs to consolidate an old lane.
-- update public.leads
--    set service = 'digital-agency',
--        value = case when value is null or value > 15000000 then 15000000 else value end
--  where service = 'mobile-app';

-- update public.opportunities
--    set service = 'digital-agency'
--  where service = 'mobile-app'
--    and email not in (
--      'budi@edupintar.com','hendra@otomart.id'
--    );

-- ---- 3. AFTER: confirm pipeline shape ----------------------
-- select service, count(*), coalesce(sum(value), 0) as pipeline
-- from public.leads
-- group by service
-- order by pipeline desc;
