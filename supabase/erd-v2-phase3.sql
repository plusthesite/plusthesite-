-- ============================================================
-- plus. — ERD v2, FASE 3: drop legacy columns/tables.
-- Hanya aman SETELAH Fase 2 code live + verified.
-- Idempotent. Ledger: 20260904000300_erd_v2_phase3
-- ============================================================

-- 1. Tabel contacts digabung ke leads (sudah 0 rows, kode sudah nulis ke leads)
drop table if exists public.contacts cascade;
drop policy if exists contacts_auth_read on public.contacts;  -- ikut cascade; no-op kalau sudah

-- 2. Kolom polymorphic activities
alter table public.activities drop column if exists parent_type;
alter table public.activities drop column if exists parent_id;
alter table public.activities drop column if exists parent_label;
drop index if exists idx_activities_parent;

-- 3. Kolom owner text (semua akses sudah via owner_id FK)
alter table public.accounts      drop column if exists owner;
alter table public.leads         drop column if exists owner;
alter table public.opportunities drop column if exists owner;
alter table public.activities   drop column if exists owner;

-- 4. studio_kols: kolom teks legacy (sudah dikonversi ke followers_int/er_num)
alter table public.studio_kols drop column if exists followers;
alter table public.studio_kols drop column if exists er;

-- 5. studio_kol_shortlist: kol_id text + snapshot (sudah digantikan kol_uuid FK)
alter table public.studio_kol_shortlist drop column if exists kol_id;
alter table public.studio_kol_shortlist drop column if exists kol_name;
alter table public.studio_kol_shortlist drop column if exists handle;
-- unique lama (user_id, kol_id) otomatis hilang bersama kolom; pasang yang baru
do $$ begin
    if not exists (select 1 from pg_constraint where conname='uq_kol_shortlist_user_kol_uuid') then
        alter table public.studio_kol_shortlist
            add constraint uq_kol_shortlist_user_kol_uuid unique (user_id, kol_uuid);
    end if;
end $$;

-- 6. RLS lama contacts sudah ikut tabel. Pastikan leads/opportunities tetap tanpa RLS publik
--    (akses via service-role server-side; anon tidak punya policy di tabel CRM).

-- 7. Ledger
insert into public.schema_migrations (version)
    values ('20260904000300')
on conflict (version) do nothing;
