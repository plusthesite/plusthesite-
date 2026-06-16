-- ============================================================
-- plus. CRM — Leads enrichment + Opportunities pipeline
-- Idempotent: safe to run multiple times.
-- Reads/writes happen via the service-role key (bypasses RLS),
-- so RLS is enabled with no public policies (deny anon).
-- ============================================================

-- Shared updated_at trigger function ---------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- 1. Enrich the existing leads table ---------------------------
alter table public.leads add column if not exists phone          text;
alter table public.leads add column if not exists company        text;
alter table public.leads add column if not exists service        text;
alter table public.leads add column if not exists status         text not null default 'new';
alter table public.leads add column if not exists owner          text;
alter table public.leads add column if not exists value          numeric;
alter table public.leads add column if not exists notes          text;
alter table public.leads add column if not exists next_action    text;
alter table public.leads add column if not exists next_action_at timestamptz;
alter table public.leads add column if not exists updated_at     timestamptz not null default now();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
    before update on public.leads
    for each row execute function public.set_updated_at();

-- 2. Opportunities (sales pipeline) ----------------------------
create table if not exists public.opportunities (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,                       -- deal name
    company         text,
    contact_name    text,
    email           text,
    phone           text,
    value           numeric not null default 0,          -- deal value (IDR)
    currency        text not null default 'IDR',
    stage           text not null default 'new',         -- new|contacted|qualified|proposal|negotiation|won|lost
    probability     int  not null default 10,            -- 0–100 %
    source          text,                                -- website|referral|instagram|linkedin|blog|chatbot|event
    service         text,                                -- chatbot|digital-agency|mobile-app|mobile-game|crm|customer-support|ai-tools
    owner           text,                                -- assigned sales/account rep
    next_action     text,
    next_action_at  timestamptz,
    expected_close  date,
    notes           text,
    lead_id         uuid references public.leads(id) on delete set null,
    locale          text not null default 'id',
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index if not exists idx_opportunities_stage      on public.opportunities (stage);
create index if not exists idx_opportunities_owner       on public.opportunities (owner);
create index if not exists idx_opportunities_next_action on public.opportunities (next_action_at);

drop trigger if exists trg_opportunities_updated_at on public.opportunities;
create trigger trg_opportunities_updated_at
    before update on public.opportunities
    for each row execute function public.set_updated_at();

-- 3. Row Level Security (service-role only) --------------------
alter table public.opportunities enable row level security;
-- No anon/auth policies: only the service-role key (used by the
-- admin dashboard server actions) may read or write these rows.
