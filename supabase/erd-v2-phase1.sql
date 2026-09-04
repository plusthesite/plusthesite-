-- ============================================================
-- plus. — ERD v2, FASE 1: additive DDL (index, kolom paralel, CHECK not-valid)
-- Idempotent. Aman dijalankan kapan pun; tidak mengubah kode yang ada.
-- Ledger: 20260904000100_erd_v2_phase1
-- ============================================================

-- 1. Index yang hilang ---------------------------------------------------
create index if not exists idx_chat_messages_session on public.chat_messages (session_id);

-- 2. sales_reps: email unique ------------------------------------------
create unique index if not exists uq_sales_reps_email on public.sales_reps (email);

-- 3. notifications: scoping per user ------------------------------------
alter table public.notifications add column if not exists user_id uuid
    references auth.users(id) on delete cascade;
create index if not exists idx_notifications_user on public.notifications (user_id);
create index if not exists idx_notifications_user_unread on public.notifications (user_id, is_read);

-- 4. CRM: owner_id (paralel, nullable — backfill fase 2) ----------------
alter table public.accounts     add column if not exists owner_id uuid references public.sales_reps(id) on delete set null;
alter table public.leads        add column if not exists owner_id uuid references public.sales_reps(id) on delete set null;
alter table public.opportunities add column if not exists owner_id uuid references public.sales_reps(id) on delete set null;

-- 5. activities: kolom FK eksplisit (paralel, nullable — backfill fase 2)
alter table public.activities add column if not exists lead_id uuid references public.leads(id) on delete cascade;
alter table public.activities add column if not exists opportunity_id uuid references public.opportunities(id) on delete cascade;
create index if not exists idx_activities_lead on public.activities (lead_id);
create index if not exists idx_activities_opportunity on public.activities (opportunity_id);

-- 6. studio_kols: tipe numeric + handle unique ---------------------------
--    (via kolom baru: followers_int, er_num; kolom lama tetap sampai fase 2)
alter table public.studio_kols add column if not exists followers_int integer;
alter table public.studio_kols add column if not exists er_num numeric(5,2);
create unique index if not exists uq_studio_kols_handle on public.studio_kols (handle);

-- 7. studio_kol_shortlist: FK sungguhan (paralel) ------------------------
alter table public.studio_kol_shortlist add column if not exists kol_uuid uuid
    references public.studio_kols(id) on delete cascade;
create index if not exists idx_kol_shortlist_kol_uuid on public.studio_kol_shortlist (kol_uuid);

-- 8. CHECK constraints NOT VALID (divalidasi penuh setelah backfill) ----
--    leads.status
do $$ begin
    if not exists (select 1 from pg_constraint where conname='leads_status_chk') then
        alter table public.leads add constraint leads_status_chk
            check (status in ('new','contacting','qualified','proposal','won','lost','converted')) not valid;
    end if;
end $$;
--    opportunities.stage
do $$ begin
    if not exists (select 1 from pg_constraint where conname='opportunities_stage_chk') then
        alter table public.opportunities add constraint opportunities_stage_chk
            check (stage in ('new','qualified','proposal','negotiation','won','lost')) not valid;
    end if;
end $$;
--    opportunities.probability
do $$ begin
    if not exists (select 1 from pg_constraint where conname='opportunities_probability_chk') then
        alter table public.opportunities add constraint opportunities_probability_chk
            check (probability between 0 and 100) not valid;
    end if;
end $$;

-- 9. leads.account_id: NO ACTION -> SET NULL -----------------------------
--    (rule matrix ERD v2: lead boleh yatim; jangan gagalkan delete account)
do $$ begin
    if exists (select 1 from pg_constraint where conname='leads_account_id_fkey') then
        alter table public.leads drop constraint leads_account_id_fkey;
    end if;
end $$;
alter table public.leads add constraint leads_account_id_fkey
    foreign key (account_id) references public.accounts(id) on delete set null
    not valid;

-- 10. opportunities.account_id: NO ACTION -> RESTRICT --------------------
do $$ begin
    if exists (select 1 from pg_constraint where conname='opportunities_account_id_fkey') then
        alter table public.opportunities drop constraint opportunities_account_id_fkey;
    end if;
end $$;
alter table public.opportunities add constraint opportunities_account_id_fkey
    foreign key (account_id) references public.accounts(id) on delete restrict
    not valid;

-- 11. Ledger -------------------------------------------------------------
insert into public.schema_migrations (version)
    values ('20260904000100')
on conflict (version) do nothing;
