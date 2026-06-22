-- ============================================================
-- PLUS Pro Studio — KOL/influencer catalog (ViewKOL).
-- Shared read-only catalog: every signed-in user can browse it,
-- writes are admin/service-role only (no client write policy).
-- Idempotent.
-- ============================================================

create table if not exists public.studio_kols (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    handle      text not null unique,
    category    text not null,
    followers   text not null,
    er          text not null,
    price       integer not null default 0,
    tags        text[] not null default '{}',
    verified    boolean not null default false,
    created_at  timestamptz not null default now()
);
create index if not exists idx_studio_kols_category on public.studio_kols (category);

alter table public.studio_kols enable row level security;

drop policy if exists "read_studio_kols" on public.studio_kols;
create policy "read_studio_kols" on public.studio_kols
    for select to authenticated using (true);

-- Starter catalog seed (safe to re-run; keyed on the unique handle).
insert into public.studio_kols (name, handle, category, followers, er, price, tags, verified) values
    ('Sasa Kuliner',   '@sasaeats',   'F&B',        '45K',  '5.2%', 350000,  array['Micro','Halal'], true),
    ('OOTD Budi',      '@budistyle',  'Fashion',    '120K', '3.8%', 1200000, array['Macro','Style'], true),
    ('Gadget Rina',    '@rinatech',   'Technology', '25K',  '8.5%', 500000,  array['Nano','Review'], false),
    ('Mama Dapur',     '@mamacooks',  'F&B',        '80K',  '4.1%', 750000,  array['Micro','Resep'], true),
    ('Fit with Andi',  '@andifit',    'Health',     '200K', '2.9%', 2500000, array['Macro','Gym'],   true),
    ('Travel Santuy',  '@santuytrip', 'Travel',     '60K',  '6.0%', 900000,  array['Micro','Trip'],  false)
on conflict (handle) do nothing;
