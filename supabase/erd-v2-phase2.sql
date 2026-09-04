-- ============================================================
-- plus. — ERD v2, FASE 2: backfill + konversi + validasi CHECK
-- Idempotent. Data nyaris kosong, tapi tetap harus benar.
-- Ledger: 20260904000200_erd_v2_phase2
-- ============================================================

-- 1. Backfill owner_id dari owner text (match by name) --------------------
update public.accounts a
   set owner_id = sr.id
  from public.sales_reps sr
 where upper(a.owner) = upper(sr.name)
   and a.owner_id is null;

update public.leads l
   set owner_id = sr.id
  from public.sales_reps sr
 where upper(l.owner) = upper(sr.name)
   and l.owner_id is null;

update public.opportunities o
   set owner_id = sr.id
  from public.sales_reps sr
 where upper(o.owner) = upper(sr.name)
   and o.owner_id is null;

-- 2. Backfill activities: parent_* -> lead_id / opportunity_id ------------
update public.activities set lead_id = parent_id
 where parent_type = 'lead' and lead_id is null;

update public.activities set opportunity_id = parent_id
 where parent_type = 'opportunity' and opportunity_id is null;

-- 3. Backfill shortlist: kol_id (text) -> kol_uuid ------------------------
update public.studio_kol_shortlist s
   set kol_uuid = k.id
  from public.studio_kols k
 where s.kol_id::uuid = k.id::text::uuid  -- kol_id menyimpan UUID-as-string
    or upper(s.kol_id) = upper(k.handle)
   and s.kol_uuid is null;
-- (di-guard: kalau kol_id bukan uuid valid, cocokkan via handle)

-- 4. Konversi studio_kols: followers/er text -> numeric -------------------
update public.studio_kols
   set followers_int = nullif(regexp_replace(followers, '[^0-9]', '', 'g'), '')::integer
 where followers_int is null and followers is not null;

update public.studio_kols
   set er_num = nullif(regexp_replace(er, '[^0-9.]', '', 'g'), '')::numeric
 where er_num is null and er is not null;

-- 5. CHECK XOR activities (dipasang SETELAH backfill, langsung valid) -----
do $$ begin
    if not exists (select 1 from pg_constraint where conname='activities_parent_xor_chk') then
        alter table public.activities add constraint activities_parent_xor_chk
            check (num_nonnulls(lead_id, opportunity_id) = 1);
    end if;
end $$;

-- 6. Validasi CHECK yang tadinya NOT VALID --------------------------------
alter table public.leads validate constraint leads_status_chk;
alter table public.opportunities validate constraint opportunities_stage_chk;
alter table public.opportunities validate constraint opportunities_probability_chk;
alter table public.leads validate constraint leads_account_id_fkey;
alter table public.opportunities validate constraint opportunities_account_id_fkey;

-- 7. Backfill contacts -> leads ------------------------------------------
--    (contacts punya kolom: name, email, company, message, created_at)
insert into public.leads (name, email, message, locale, source, company, created_at)
select c.name, c.email, c.message, 'en', 'contact-form', c.company, c.created_at
  from public.contacts c
where not exists (
    select 1 from public.leads l
     where l.email = c.email and l.source = 'contact-form'
       and l.created_at = c.created_at
);
-- contacts RLS read-policy tidak dipakai kode manapun setelah fase 2.

-- 8. Ledger ---------------------------------------------------------------
insert into public.schema_migrations (version)
    values ('20260904000200')
on conflict (version) do nothing;
