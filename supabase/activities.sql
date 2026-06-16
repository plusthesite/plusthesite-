-- ============================================================
-- plus. CRM — Activities & Tasks (Salesforce/LeadSquared pattern)
-- Polymorphic: an activity belongs to a lead OR an opportunity.
-- Idempotent. Run after crm.sql.
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create table if not exists public.activities (
    id            uuid primary key default gen_random_uuid(),
    parent_type   text not null check (parent_type in ('lead', 'opportunity')),
    parent_id     uuid not null,
    parent_label  text,                                   -- denormalized name/company for list views
    type          text not null default 'note',           -- call|whatsapp|email|meeting|note|task
    subject       text,
    body          text,
    owner         text,
    status        text not null default 'done',           -- open (future task) | done (logged)
    due_at        timestamptz,
    done_at       timestamptz,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index if not exists idx_activities_parent on public.activities (parent_type, parent_id, created_at desc);
create index if not exists idx_activities_open    on public.activities (status, due_at);

drop trigger if exists trg_activities_updated_at on public.activities;
create trigger trg_activities_updated_at
    before update on public.activities
    for each row execute function public.set_updated_at();

alter table public.activities enable row level security;
-- Service-role only (admin dashboard); no anon/auth policies.
