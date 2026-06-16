-- ============================================================
-- plus. CRM — Accounts (companies) grouping leads & opportunities
-- Idempotent. Run after crm.sql. Backfills accounts from existing
-- company names and links current leads/opps.
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create table if not exists public.accounts (
    id          uuid primary key default gen_random_uuid(),
    name        text not null unique,
    industry    text,
    website     text,
    phone       text,
    email       text,
    owner       text,
    notes       text,
    locale      text not null default 'id',
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

drop trigger if exists trg_accounts_updated_at on public.accounts;
create trigger trg_accounts_updated_at
    before update on public.accounts
    for each row execute function public.set_updated_at();

alter table public.accounts enable row level security;  -- service-role only

-- Link leads & opportunities to an account.
alter table public.leads          add column if not exists account_id uuid references public.accounts(id) on delete set null;
alter table public.opportunities  add column if not exists account_id uuid references public.accounts(id) on delete set null;
create index if not exists idx_leads_account on public.leads (account_id);
create index if not exists idx_opps_account  on public.opportunities (account_id);

-- Backfill: one account per distinct company name.
insert into public.accounts (name)
select distinct company from (
    select company from public.leads         where company is not null and btrim(company) <> ''
    union
    select company from public.opportunities where company is not null and btrim(company) <> ''
) c
where not exists (select 1 from public.accounts a where a.name = c.company);

-- Link existing rows to their account.
update public.leads l         set account_id = a.id from public.accounts a where l.company = a.name and l.account_id is null;
update public.opportunities o set account_id = a.id from public.accounts a where o.company = a.name and o.account_id is null;
