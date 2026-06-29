-- ============================================================
-- plus. — Site appearance settings (single row). Lets the admin
-- re-theme the public site's brand colors from the dashboard.
-- Idempotent.
-- ============================================================

create table if not exists public.site_settings (
    id              smallint primary key default 1,
    primary_color   text,
    secondary_color text,
    tertiary_color  text,
    updated_at      timestamptz not null default now(),
    constraint site_settings_single_row check (id = 1)
);

-- Add the accent color to an already-created table (idempotent).
alter table public.site_settings add column if not exists tertiary_color text;

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Colors aren't sensitive — allow public read so the site can theme itself.
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
    on public.site_settings for select using (true);
-- Writes only via the service-role key (admin dashboard).
