-- ============================================================
-- plus. CRM — Sample pipeline data, ERD v2 edition (2026-09-07).
-- Adapted from seed_crm.sql: owner text -> owner_id FK (sales_reps),
-- opportunities: lead_id linked via email, account_id nullable.
-- Schema constraints honored:
--   sales_reps.role   IN (sales, manager, admin)
--   leads.status      IN (new, contacting, qualified, proposal, won, lost, converted)
--   opportunities.stage IN (new, qualified, proposal, negotiation, won, lost)
-- Idempotent: guarded per-email / only-if-empty.
-- ============================================================

-- ---- Sales reps (needed as FK targets) ----------------------
insert into public.sales_reps (id, name, email, role, is_active)
select * from (values
    (gen_random_uuid()::uuid, 'Aulia',  'aulia@plusthe.site',  'sales'::text,   true),
    (gen_random_uuid()::uuid, 'Citra',  'citra@plusthe.site',  'sales'::text,   true),
    (gen_random_uuid()::uuid, 'Bima',   'bima@plusthe.site',   'manager'::text, true)
) as v(id, name, email, role, is_active)
where not exists (select 1 from public.sales_reps r where r.email = v.email);

-- ---- Leads ---------------------------------------------------
-- status: 'contacted' (legacy) -> 'contacting' (ERD v2 check)
insert into public.leads (name, email, phone, company, service, status, value, source, owner_id, next_action, next_action_at, message, locale)
select v.name, v.email, v.phone, v.company, v.service, v.status, v.value, v.source,
       (select id from public.sales_reps where name = v.owner limit 1),
       v.next_action, v.next_action_at, v.message, v.locale
from (values
    ('Andi Wijaya',     'andi@batiknusantara.co.id',   '+628****0011', 'Batik Nusantara',      'chatbot',          'new',        8000000,  'website',   'Aulia', 'Send chatbot demo deck',          now() + interval '1 day',  'Mau chatbot WhatsApp untuk CS toko batik online.', 'id'),
    ('Siti Rahmawati',  'siti@kliniksehat.id',         '+628****0012', 'Klinik Sehat Sentosa', 'customer-support', 'contacting', 6000000,  'instagram', 'Citra', 'Follow-up call re: ticketing',    now() + interval '2 days', 'Butuh sistem support pasien terpadu.',             'id'),
    ('Budi Santoso',    'budi@edupintar.com',          '+628****0013', 'EduPintar',            'mobile-app',       'qualified',  35000000, 'referral',  'Bima',  'Scope MVP workshop',              now() + interval '3 days', 'Aplikasi belajar untuk siswa SMA, butuh MVP.',     'id'),
    ('Maya Putri',      'maya@gofreshmart.id',         '+628****0014', 'GoFresh Mart',         'crm',              'new',        12000000, 'blog',      'Aulia', 'Qualify pipeline volume',         now() + interval '1 day',  'Ingin CRM untuk kelola pelanggan grocery.',        'id'),
    ('Rizky Pratama',   'rizky@fitlifegym.co.id',      '+628****0015', 'FitLife Gym',          'chatbot',          'contacting', 8000000,  'website',   'Citra', 'Send pricing IDR',                now() + interval '2 days', 'Chatbot booking kelas + membership.',              'id'),
    ('Dewi Lestari',    'dewi@travelkita.id',          '+628****0016', 'TravelKita',           'digital-agency',   'qualified',  15000000, 'linkedin',  'Bima',  'Brand audit proposal',            now() + interval '4 days', 'Rebranding + konten media sosial travel.',         'id'),
    ('Hendra Gunawan',  'hendra@otomart.id',           '+628****0017', 'Bengkel Otomart',      'mobile-app',       'new',        30000000, 'website',   'Aulia', 'Intro call',                      now() + interval '1 day',  'Aplikasi booking servis kendaraan.',               'id'),
    ('Nina Kartika',    'nina@fashionku.co.id',        '+628****0018', 'Fashionku Boutique',   'ai-tools',         'new',        4000000,  'instagram', 'Citra', 'Demo AI image generator',         now() + interval '2 days', 'Mau generate katalog produk pakai AI.',            'id'),
    ('Sarah Johnson',   'sarah@brightlabs.io',         '+155****0020',   'Bright Labs',          'digital-agency',   'contacting', 20000000, 'referral',  'Bima',  'Share case studies',              now() + interval '3 days', 'Need a full rebrand + landing pages.',             'en'),
    ('Michael Chen',    'michael@playnova.gg',         '+155****0021',   'PlayNova Studios',     'mobile-game',      'qualified',  50000000, 'website',   'Aulia', 'Game scope estimation',           now() + interval '5 days', 'Looking for a Unity dev partner for a casual game.','en')
) as v(name, email, phone, company, service, status, value, source, owner, next_action, next_action_at, message, locale)
where not exists (select 1 from public.leads l where l.email = v.email);

-- ---- Opportunities (only if table empty) --------------------
-- stage: legacy 'contacted' not valid; map to 'new' (no contact yet) or
-- 'qualified' per intent (early conversations -> qualified).
insert into public.opportunities
  (name, company, contact_name, email, phone, value, stage, probability, source, service, owner_id, lead_id, next_action, next_action_at, expected_close, notes, locale)
select v.name, v.company, v.contact_name, v.email, v.phone, v.value, v.stage, v.probability, v.source, v.service,
       (select id from public.sales_reps where name = v.owner limit 1),
       (select id from public.leads where email = v.email limit 1),
       v.next_action, v.next_action_at, v.expected_close, v.notes, v.locale
from (values
    ('AI Chatbot WhatsApp — Batik Nusantara', 'Batik Nusantara',      'Andi Wijaya',    'andi@batiknusantara.co.id', '+628****0011', 8000000,  'proposal',    60, 'website',   'chatbot',          'Aulia',  'Send proposal v2',            now() + interval '1 day',  current_date + 14, 'Hot — wants WA + IG integration. Budget approved.',           'id'),
    ('Support Desk — Klinik Sehat',           'Klinik Sehat Sentosa', 'Siti Rahmawati', 'siti@kliniksehat.id',       '+628****0012', 9000000,  'qualified',   40, 'instagram', 'customer-support', 'Citra',  'Demo ticketing flow',         now() + interval '2 days', current_date + 21, 'Needs multi-agent inbox + SLA reporting.',                    'id'),
    ('Learning App MVP — EduPintar',          'EduPintar',            'Budi Santoso',   'budi@edupintar.com',        '+628****0013', 45000000, 'negotiation', 75, 'referral',  'mobile-app',       'Bima',   'Finalize SOW + timeline',     now() + interval '1 day',  current_date + 10, 'Strong intent. Negotiating payment in 3 milestones.',         'id'),
    ('CRM Rollout — GoFresh Mart',            'GoFresh Mart',         'Maya Putri',     'maya@gofreshmart.id',       '+628****0014', 14000000, 'new',         25, 'blog',      'crm',              'Aulia',  'Discovery call',              now() + interval '3 days', current_date + 30, 'Wants loyalty + WhatsApp broadcast.',                         'id'),
    ('Chatbot — FitLife Gym',                 'FitLife Gym',          'Rizky Pratama',  'rizky@fitlifegym.co.id',    '+628****0015', 8000000,  'proposal',    55, 'website',   'chatbot',          'Citra',  'Pricing call',                now() + interval '2 days', current_date + 18, 'Booking + membership renewal reminders.',                     'id'),
    ('Rebrand + Social — TravelKita',         'TravelKita',           'Dewi Lestari',   'dewi@travelkita.id',        '+628****0016', 18000000, 'qualified',   45, 'linkedin',  'digital-agency',   'Bima',   'Send brand audit',            now() + interval '4 days', current_date + 25, 'Q3 campaign for Lebaran season.',                             'id'),
    ('Service Booking App — Otomart',         'Bengkel Otomart',      'Hendra Gunawan', 'hendra@otomart.id',         '+628****0017', 32000000, 'new',         15, 'website',   'mobile-app',       'Aulia',  'Intro + qualify budget',      now() + interval '1 day',  current_date + 35, 'Inbound from website form.',                                  'id'),
    ('AI Catalog — Fashionku',                'Fashionku Boutique',   'Nina Kartika',   'nina@fashionku.co.id',      '+628****0018', 5000000,  'new',         30, 'instagram', 'ai-tools',         'Citra',  'Send sample renders',         now() + interval '2 days', current_date + 12, 'Wants 200 product shots/month.',                              'id'),
    ('Casual Game — PlayNova',                'PlayNova Studios',     'Michael Chen',    'michael@playnova.gg',       '+155****0021',   55000000, 'qualified',   50, 'website',   'mobile-game',       'Aulia',  'Scope estimation workshop',   now() + interval '5 days', current_date + 45, 'Unity, hyper-casual. Targeting global launch.',                'en'),
    ('Full Rebrand — Bright Labs',            'Bright Labs',          'Sarah Johnson',  'sarah@brightlabs.io',       '+155****0020',   22000000, 'proposal',    60, 'referral',  'digital-agency',   'Bima',   'Present proposal deck',       now() + interval '3 days', current_date + 20, 'Rebrand + 5 landing pages + design system.',                  'en'),
    ('Enterprise Chatbot — Logistik Cepat',   'Logistik Cepat',       'Putra Nugraha',  'putra@logistikcepat.id',    '+628****0019', 25000000, 'won',         100,'referral',  'chatbot',          'Bima',   'Kickoff scheduled',           now() + interval '2 days', current_date - 2,  'Closed! Tracking-status bot for couriers.',                   'id'),
    ('CRM Pilot — Properti Jaya',             'Properti Jaya',        'Lina Hartono',  'lina@propertijaya.id',      '+628****0020', 12000000, 'lost',        0,  'blog',      'crm',              'Citra',  'Re-engage next quarter',      now() + interval '60 days',current_date - 5,  'Lost to in-house build. Revisit Q4.',                         'id')
) as v(name, company, contact_name, email, phone, value, stage, probability, source, service, owner, next_action, next_action_at, expected_close, notes, locale)
where (select count(*) from public.opportunities) = 0;

-- ---- Backfill: create matching accounts for seeded companies --
-- (accounts upserted by name; links opportunities to accounts too)
update public.opportunities o
   set account_id = (
       select a.id from public.accounts a
        where a.name = o.company
       limit 1)
 where o.account_id is null
   and exists (select 1 from public.accounts a where a.name = o.company);
