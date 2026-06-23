-- ============================================================
-- Supabase Storage — applied to the live project
-- (qsklgxeovoegxxiutkzh) via the create_studio_assets_storage_bucket
-- migration on 2026-06-23. Source-of-truth record; idempotent.
--
-- studio-assets: PRIVATE bucket for AI-generated images (ViewGenerator).
-- Replaces storing raw base64 in generated_assets.image_url (heavy rows /
-- slow gallery queries). Each row now stores the object path
-- "{auth.uid()}/{uuid}.png"; the client renders via short-lived signed URLs.
-- Owner-only: a user can read/write/delete ONLY their own folder — same
-- privacy guarantee as the owner-scoped table RLS.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('studio-assets', 'studio-assets', false)
on conflict (id) do nothing;

drop policy if exists "studio_assets_select_own" on storage.objects;
create policy "studio_assets_select_own" on storage.objects
    for select to authenticated
    using (bucket_id = 'studio-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "studio_assets_insert_own" on storage.objects;
create policy "studio_assets_insert_own" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'studio-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "studio_assets_delete_own" on storage.objects;
create policy "studio_assets_delete_own" on storage.objects
    for delete to authenticated
    using (bucket_id = 'studio-assets' and (storage.foldername(name))[1] = auth.uid()::text);
