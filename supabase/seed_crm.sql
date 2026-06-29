-- ============================================================
-- plus. CRM — Sample pipeline data (segmented by service line)
-- Run AFTER crm.sql. Idempotent:
--   • leads are guarded per-email (won't duplicate)
--   • opportunities seed only if the table is empty
-- Gives the sales / account team ready-to-reach-out prospects.
-- ============================================================

-- ---- Sample leads (top-of-funnel, per service) --------------
insert into public.leads (name, email, phone, company, service, status, value, source, owner, next_action, next_action_at, message, locale)
select * from (values
    ('Andi Wijaya',     'andi@batiknusantara.co.id',   '+6281234500011', 'Batik Nusantara',      'chatbot',          'new',        8000000,  'website',   'Aulia (Sales)', 'Send chatbot demo deck',          now() + interval '1 day',  'Mau chatbot WhatsApp untuk CS toko batik online.', 'id'),
    ('Siti Rahmawati',  'siti@kliniksehat.id',         '+6281234500012', 'Klinik Sehat Sentosa', 'customer-support', 'contacted',  6000000,  'instagram', 'Citra (Sales)', 'Follow-up call re: ticketing',     now() + interval '2 days', 'Butuh sistem support pasien terpadu.',             'id'),
    ('Budi Santoso',    'budi@edupintar.com',          '+6281234500013', 'EduPintar',            'mobile-app',       'qualified',  35000000, 'referral',  'Bima (Account)','Scope MVP workshop',              now() + interval '3 days', 'Aplikasi belajar untuk siswa SMA, butuh MVP.',     'id'),
    ('Maya Putri',      'maya@gofreshmart.id',         '+6281234500014', 'GoFresh Mart',         'crm',              'new',        12000000, 'blog',      'Aulia (Sales)', 'Qualify pipeline volume',         now() + interval '1 day',  'Ingin CRM untuk kelola pelanggan grocery.',        'id'),
    ('Rizky Pratama',   'rizky@fitlifegym.co.id',      '+6281234500015', 'FitLife Gym',          'chatbot',          'contacted',  8000000,  'website',   'Citra (Sales)', 'Send pricing IDR',                now() + interval '2 days', 'Chatbot booking kelas + membership.',              'id'),
    ('Dewi Lestari',    'dewi@travelkita.id',          '+6281234500016', 'TravelKita',           'digital-agency',   'qualified',  15000000, 'linkedin',  'Bima (Account)','Brand audit proposal',            now() + interval '4 days', 'Rebranding + konten media sosial travel.',         'id'),
    ('Hendra Gunawan',  'hendra@otomart.id',           '+6281234500017', 'Bengkel Otomart',      'mobile-app',       'new',        30000000, 'website',   'Aulia (Sales)', 'Intro call',                      now() + interval '1 day',  'Aplikasi booking servis kendaraan.',               'id'),
    ('Nina Kartika',    'nina@fashionku.co.id',        '+6281234500018', 'Fashionku Boutique',   'ai-tools',         'new',        4000000,  'instagram', 'Citra (Sales)', 'Demo AI image generator',         now() + interval '2 days', 'Mau generate katalog produk pakai AI.',            'id'),
    ('Sarah Johnson',   'sarah@brightlabs.io',         '+15551230020',   'Bright Labs',          'digital-agency',   'contacted',  20000000, 'referral',  'Bima (Account)','Share case studies',              now() + interval '3 days', 'Need a full rebrand + landing pages.',             'en'),
    ('Michael Chen',    'michael@playnova.gg',         '+15551230021',   'PlayNova Studios',     'mobile-game',      'qualified',  50000000, 'website',   'Aulia (Sales)', 'Game scope estimation',           now() + interval '5 days', 'Looking for a Unity dev partner for a casual game.','en')
) as v(name, email, phone, company, service, status, value, source, owner, next_action, next_action_at, message, locale)
where not exists (select 1 from public.leads l where l.email = v.email);

-- ---- Sample opportunities (sales pipeline, per service) ------
do $$
begin
  if (select count(*) from public.opportunities) = 0 then
    insert into public.opportunities
      (name, company, contact_name, email, phone, value, stage, probability, source, service, owner, next_action, next_action_at, expected_close, notes, locale)
    values
      ('AI Chatbot WhatsApp — Batik Nusantara', 'Batik Nusantara',      'Andi Wijaya',    'andi@batiknusantara.co.id', '+6281234500011', 8000000,  'proposal',    60, 'website',   'chatbot',          'Aulia (Sales)',  'Send proposal v2',            now() + interval '1 day',  current_date + 14, 'Hot — wants WA + IG integration. Budget approved.',           'id'),
      ('Support Desk — Klinik Sehat',           'Klinik Sehat Sentosa', 'Siti Rahmawati', 'siti@kliniksehat.id',       '+6281234500012', 9000000,  'qualified',   40, 'instagram', 'customer-support', 'Citra (Sales)',  'Demo ticketing flow',         now() + interval '2 days', current_date + 21, 'Needs multi-agent inbox + SLA reporting.',                    'id'),
      ('Learning App MVP — EduPintar',          'EduPintar',            'Budi Santoso',   'budi@edupintar.com',        '+6281234500013', 45000000, 'negotiation', 75, 'referral',  'mobile-app',       'Bima (Account)', 'Finalize SOW + timeline',     now() + interval '1 day',  current_date + 10, 'Strong intent. Negotiating payment in 3 milestones.',         'id'),
      ('CRM Rollout — GoFresh Mart',            'GoFresh Mart',         'Maya Putri',     'maya@gofreshmart.id',       '+6281234500014', 14000000, 'contacted',   25, 'blog',      'crm',              'Aulia (Sales)',  'Discovery call',              now() + interval '3 days', current_date + 30, 'Wants loyalty + WhatsApp broadcast.',                         'id'),
      ('Chatbot — FitLife Gym',                 'FitLife Gym',          'Rizky Pratama',  'rizky@fitlifegym.co.id',    '+6281234500015', 8000000,  'proposal',    55, 'website',   'chatbot',          'Citra (Sales)',  'Pricing call',                now() + interval '2 days', current_date + 18, 'Booking + membership renewal reminders.',                     'id'),
      ('Rebrand + Social — TravelKita',         'TravelKita',           'Dewi Lestari',   'dewi@travelkita.id',        '+6281234500016', 18000000, 'qualified',   45, 'linkedin',  'digital-agency',   'Bima (Account)', 'Send brand audit',            now() + interval '4 days', current_date + 25, 'Q3 campaign for Lebaran season.',                             'id'),
      ('Service Booking App — Otomart',         'Bengkel Otomart',      'Hendra Gunawan', 'hendra@otomart.id',         '+6281234500017', 32000000, 'new',         15, 'website',   'mobile-app',       'Aulia (Sales)',  'Intro + qualify budget',      now() + interval '1 day',  current_date + 35, 'Inbound from website form.',                                  'id'),
      ('AI Catalog — Fashionku',                'Fashionku Boutique',   'Nina Kartika',   'nina@fashionku.co.id',      '+6281234500018', 5000000,  'contacted',   30, 'instagram', 'ai-tools',         'Citra (Sales)',  'Send sample renders',         now() + interval '2 days', current_date + 12, 'Wants 200 product shots/month.',                              'id'),
      ('Casual Game — PlayNova',                'PlayNova Studios',     'Michael Chen',   'michael@playnova.gg',       '+15551230021',   55000000, 'qualified',   50, 'website',   'mobile-game',      'Aulia (Sales)',  'Scope estimation workshop',   now() + interval '5 days', current_date + 45, 'Unity, hyper-casual. Targeting global launch.',               'en'),
      ('Full Rebrand — Bright Labs',            'Bright Labs',          'Sarah Johnson',  'sarah@brightlabs.io',       '+15551230020',   22000000, 'proposal',    60, 'referral',  'digital-agency',   'Bima (Account)', 'Present proposal deck',       now() + interval '3 days', current_date + 20, 'Rebrand + 5 landing pages + design system.',                  'en'),
      ('Enterprise Chatbot — Logistik Cepat',   'Logistik Cepat',       'Putra Nugraha',  'putra@logistikcepat.id',    '+6281234500019', 25000000, 'won',         100,'referral',  'chatbot',          'Bima (Account)', 'Kickoff scheduled',           now() + interval '2 days', current_date - 2,  'Closed! Tracking-status bot for couriers.',                   'id'),
      ('CRM Pilot — Properti Jaya',             'Properti Jaya',        'Lina Hartono',   'lina@propertijaya.id',      '+6281234500020', 12000000, 'lost',        0,  'blog',      'crm',              'Citra (Sales)',  'Re-engage next quarter',      now() + interval '60 days',current_date - 5,  'Lost to in-house build. Revisit Q4.',                         'id');
  end if;
end $$;
