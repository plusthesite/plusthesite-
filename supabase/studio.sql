-- ============================================================
-- PLUS Pro Studio — user data (written by the Studio app via the
-- ANON key, so RLS scopes every row to its owner: auth.uid()).
-- Idempotent. Without these tables the Studio's saves fail silently.
-- ============================================================

-- AI-generated images (ViewGenerator) -------------------------
create table if not exists public.generated_assets (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    prompt      text,
    style       text,
    ratio       text,
    image_url   text,
    created_at  timestamptz not null default now()
);
create index if not exists idx_generated_assets_user on public.generated_assets (user_id, created_at desc);

-- AI content calendars / campaigns (ViewPlanner) --------------
create table if not exists public.campaigns (
    id             uuid primary key default gen_random_uuid(),
    user_id        uuid not null references auth.users(id) on delete cascade,
    name           text,
    industry       text,
    market         text,
    idea           text,
    calendar_data  jsonb,
    created_at     timestamptz not null default now()
);
create index if not exists idx_campaigns_user on public.campaigns (user_id, created_at desc);

-- Saved AI strategies (ViewStrategy) — ready for persistence ---
create table if not exists public.strategies (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    title       text,
    brief       text,
    result      jsonb,
    created_at  timestamptz not null default now()
);
create index if not exists idx_strategies_user on public.strategies (user_id, created_at desc);

-- ============================================================
-- Row Level Security — each signed-in user manages only their own rows.
-- ============================================================
alter table public.generated_assets enable row level security;
alter table public.campaigns         enable row level security;
alter table public.strategies        enable row level security;

drop policy if exists "own_generated_assets" on public.generated_assets;
create policy "own_generated_assets" on public.generated_assets
    for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own_campaigns" on public.campaigns;
create policy "own_campaigns" on public.campaigns
    for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own_strategies" on public.strategies;
create policy "own_strategies" on public.strategies
    for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
