-- ============================================================
-- Realign CRM data to what we actually sell (run in Supabase SQL Editor).
--
-- Goal: keep the pipeline REAL so it forecasts real revenue.
--   1. Remove the fabricated demo opportunities + demo leads from seed_crm.sql
--      (they are not real prospects — they inflate the pipeline).
--   2. Mobile App Development is "coming soon" → re-tag its real leads to our
--      flagship Digital Agency line so the reach-out effort isn't wasted.
--
-- SAFE / REVERSIBLE-MINDED: run each PREVIEW select first, eyeball the rows,
-- then run the matching write. Bulk writes on the live DB are human-signed-off.
-- ============================================================

-- ---- 1a. PREVIEW the fabricated seed records ----------------
-- These exact emails come from supabase/seed_crm.sql (demo data only).
select 'lead' as kind, name, company, service from public.leads
where email in (
    'andi@batiknusantara.co.id','siti@kliniksehat.id','budi@edupintar.com',
    'maya@gofreshmart.id','rizky@fitlifegym.co.id','dewi@travelkita.id',
    'hendra@otomart.id','nina@fashionku.co.id','sarah@brightlabs.io','michael@playnova.gg'
)
union all
select 'opportunity', name, company, service from public.opportunities
where email in (
    'andi@batiknusantara.co.id','siti@kliniksehat.id','budi@edupintar.com',
    'maya@gofreshmart.id','rizky@fitlifegym.co.id','dewi@travelkita.id',
    'hendra@otomart.id','nina@fashionku.co.id','sarah@brightlabs.io','michael@playnova.gg'
);

-- ---- 1b. DELETE the fabricated seed records -----------------
-- (uncomment to run once the preview looks right)
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

-- ---- 2a. PREVIEW mobile-app leads to re-tag -----------------
select count(*) as mobile_app_leads, coalesce(sum(value), 0) as current_value
from public.leads where service = 'mobile-app';

-- ---- 2b. RE-TAG real mobile-app leads → digital-agency ------
-- (Digital Agency starting value is Rp 15jt — keep values realistic.)
-- update public.leads
--    set service = 'digital-agency',
--        value = case when value is null or value > 15000000 then 15000000 else value end
--  where service = 'mobile-app';

-- Same for any real opportunities still tagged mobile-app:
-- update public.opportunities
--    set service = 'digital-agency'
--  where service = 'mobile-app'
--    and email not in (  -- exclude the demo rows handled in step 1
--      'budi@edupintar.com','hendra@otomart.id'
--    );

-- ---- 3. After: confirm the pipeline is real -----------------
-- select service, count(*), coalesce(sum(value),0) as pipeline
-- from public.leads group by service order by pipeline desc;
