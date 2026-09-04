# plus. — Database Audit & ERD v2 (landasan struktur baru)

Tanggal: 2026-09-04 · Auditor: Hermes (audit berbasis query live, bukan asumsi)
DB: vpsplus-postgres/plusthesite (Supabase-local) · 20 tabel public · 69 migrations

---

## 1. VERDICT AUDIT — jujur, bukan yang kamu duga

**"Terlalu banyak one-to-many" → TIDAK TERBUKTI.** Total cuma 9 FK. Pola
`auth.users → {campaigns, content_packs, generated_assets, strategies,
live_products, studio_kol_shortlist}` itu bentuk SaaS yang BENAR (satu user
punya banyak artifact) — bukan kekusutan. Menggabungkan 6 tabel studio itu
menjadi 1 tabel `ai_artifacts` justru memperburuk (query shape tiap fitur beda).

**Yang benar-benar kusut (terbukti dari skema + kode):**

| # | Masalah | Bukti | Dampak |
|---|---------|-------|--------|
| 1 | `contacts` duplikat `leads` | dua tabel menampung inbound orang; `leads.source='contact-form'` vs tabel `contacts` terpisah; contactRepo upsert account sekalian | 2 repo + 2 tabel untuk 1 konsep |
| 2 | `owner text` di 4 tabel (accounts, leads, opportunities, activities) | grep `.eq("owner"` = 0 hasil — kode tidak pernah filter owner! Nilainya string bebas, bisa typo | Denormalisasi tanpa manfaat; seharusnya `owner_id uuid → sales_reps` |
| 3 | `activities` polymorphic (`parent_type`/`parent_id`) | hanya 2 parent (lead & opportunity); tidak bisa FK, tidak bisa JOIN, tidak ada integrity | Anti-pattern untuk kasus sekecil ini |
| 4 | `studio_kol_shortlist.kol_id text` | bukan FK ke `studio_kols.id`; nama/handle disalin snapshot | Orphan bookmarks tak terdeteksi |
| 5 | Tipe salah: `studio_kols.followers text`, `er text` | "12000"/"12.5%" disimpan sebagai string | Tidak bisa sort/aggregate numeric |
| 6 | `notifications` tanpa `user_id` | semua notif global, tidak bisa per-admin | RLS scoping mustahil |
| 7 | FK delete rules inkonsisten | user_id → CASCADE, tapi leads.account_id & opportunities.* → NO ACTION ('n') | Delete account gagal diam-diam; UX mati |
| 8 | `chat_messages` tanpa index `session_id` | hanya pkey; getMessages selalu filter session_id | Full scan per chat load |
| 9 | `sales_reps.email` tidak unique | hanya pkey | Bisa dobel | 

**Yang sudah BAGUS dan tidak usah dirombak:** posts (idx slug/status/locale/published_at
lengkap), article_views (counter idempotent + RPC atomic), subscribers (email unique),
site_settings (single-row CHECK), user-scoped tabel studio, RLS hardening (harden_rls.sql).

**Fakta penting untuk strategi migrasi:** data nyaris kosong — 95 article_views,
1 lead, 1 campaign, 6 kols, 1 admin. Migrasi murah secara DATA; yang mahal itu
perubahan KODE (repository + admin UI).

---

## 2. ERD v2 — target struktur

```mermaid
erDiagram
    auth_users ||--o{ campaigns : "owns"
    auth_users ||--o{ content_packs : "owns"
    auth_users ||--o{ generated_assets : "owns"
    auth_users ||--o{ strategies : "owns"
    auth_users ||--o{ live_products : "owns"
    auth_users ||--o{ studio_kol_shortlist : "curates"
    auth_users |o--o{ notifications : "targets (null = global)"

    sales_reps ||--o{ accounts : "owner_id"
    sales_reps ||--o{ leads : "owner_id"
    sales_reps ||--o{ opportunities : "owner_id"
    accounts |o--o{ leads : "SET NULL"
    accounts ||--o{ opportunities : "RESTRICT"
    leads |o--o{ opportunities : "SET NULL"
    leads ||--o{ activities : "lead_id"
    opportunities ||--o{ activities : "opportunity_id"

    studio_kols ||--o{ studio_kol_shortlist : "CASCADE"

    posts |||| article_views : "slug counter"
```

### Perubahan per tabel

**Domain CRM**
- `contacts` → **DIHAPUS**. Backfill ke `leads(source='contact-form', company, message)`.
  `contactRepo.insertContact()` → tulis ke `leads`. (View kompat `contacts` bisa
  disediakan masa transisi.)
- `leads`: + `owner_id uuid → sales_reps ON DELETE SET NULL`; `account_id` berubah
  ke `SET NULL`; `status` diberi CHECK (`new|contacting|qualified|proposal|won|lost`);
  kolom `owner text` di-drop setelah backfill by-name.
- `accounts`: `owner` → `owner_id → sales_reps SET NULL`.
- `opportunities`: `account_id` → **NOT NULL** + `ON DELETE RESTRICT` (opp wajib
  punya company; menghapus account yang masih punya opp harus ditolak eksplisit);
  `lead_id` tetap nullable `SET NULL`; `owner_id → sales_reps`; CHECK
  `probability BETWEEN 0 AND 100`; CHECK `stage`.
- `activities`: **hapus polymorphism**. Ganti `parent_type/parent_id/parent_label`
  dengan `lead_id uuid NULL → leads` + `opportunity_id uuid NULL → opportunities`
  + `CHECK (num_nonnulls(lead_id, opportunity_id) = 1)`. `owner` → `owner_id`.
  Integrity, JOIN, dan index jadi mungkin — parent_label selalu bisa diderive.
- `sales_reps`: + `UNIQUE(email)`.
- `notifications`: + `user_id uuid NULL → auth.users`; index `(user_id, is_read)`;
  `NULL` berarti broadcast semua admin.

**Domain Studio**
- `studio_kols`: `followers → integer`, `er → numeric(5,2)`, + `UNIQUE(handle)`.
- `studio_kol_shortlist`: `kol_id text` → `kol_uuid uuid → studio_kols ON DELETE CASCADE`;
  drop snapshot `kol_name/handle` (JOIN ke katalog; kalau katalog di-refresh nama
  ikut mut — itu perilaku yang diinginkan). Unique `(user_id, kol_uuid)` dipertahankan.
- `campaigns`/`content_packs`/`generated_assets`/`strategies`/`live_products`:
  **tetap** — bentuk user-scoped append-only sudah benar.

**Domain Public site** — `posts`, `article_views`, `subscribers`, `site_settings`,
`chat_messages` (kecuali + `NOT NULL session_id` + `index session_id`).

### Matrix aturan delete (konsisten, ada alasannya)

| Relasi | Rule | Alasan |
|---|---|---|
| auth.users → semua tabel studio | CASCADE | artifact user tidak bermakna tanpa user |
| sales_reps → owner_id (3 tabel) | SET NULL | data CRM tidak ikut hilang saat staff keluar |
| accounts → leads | SET NULL | lead individu boleh yatim |
| accounts → opportunities | RESTRICT | hapus company = aksi destruktif, wajib sadar |
| leads → opportunities | SET NULL | opp tetap ada walau lead dihapus |
| studio_kols → shortlist | CASCADE | bookmark ikut katalognya |

---

## 3. Rencana migrasi (phased — jangan big-bang)

**Fase 1 — additive, 0 kode berubah, bisa live hari ini (~1 jam):**
tambah index `chat_messages(session_id)`, `sales_reps UNIQUE(email)`,
`notifications.user_id NULL`, kolom `owner_id`/`lead_id`/`opportunity_id` baru
(nullable, paralel kolom lama), CHECK constraints. Semua idempotent, aman re-run.

**Fase 2 — backfill + kode (ini bagian terberat, jujur: ~6–10 file):**
backfill owner→owner_id (by name), activities parent_* → FK baru, contacts→leads
(contactRepo 1–2 file), ViewKOL join katalog (2–3 file), activities repo + halaman
admin yang render parent_* (ActivityPanel, TodayFocus, tasks, leads/[id],
opportunities/[id] — ±6 file), notificationRepo scoping.

**Fase 3 — drop legacy:** contacts, parent_* cols, owner text, kol snapshot cols,
NOT NULL tightening. Hanya setelah Fase 2 stabil di produksi.

Dua jalur alternatif yang kupertimbangkan dan tolak:
- **Big-bang rebuild**: data cuma ~100 rows jadi migrasi murah, tapi 69 migrations
  + RLS hardening + kode harus ganti serentak — blast radius tidak sepadan.
- **Merge 6 tabel studio jadi 1**: salah sasaran, query shape beda-beda.

---

## 4. DDL Fase 1 (draft — siap di-review)

```sql
-- idempotent, additive only
create index if not exists idx_chat_messages_session on public.chat_messages (session_id);
create unique index if not exists uq_sales_reps_email on public.sales_reps (email);
alter table public.notifications add column if not exists user_id uuid;
create index if not exists idx_notifications_user_unread on public.notifications (user_id, is_read);

alter table public.accounts  add column if not exists owner_id uuid references public.sales_reps(id) on delete set null;
alter table public.leads     add column if not exists owner_id uuid references public.sales_reps(id) on delete set null;
alter table public.opportunities add column if not exists owner_id uuid references public.sales_reps(id) on delete set null;

alter table public.activities add column if not exists lead_id uuid references public.leads(id) on delete cascade;
alter table public.activities add column if not exists opportunity_id uuid references public.opportunities(id) on delete cascade;

alter table public.leads add constraint leads_status_chk check (status in ('new','contacting','qualified','proposal','won','lost')) not valid;
-- (not valid = tidak memvalidasi row lama; divalidasi setelah backfill status)
```

*Catatan: CHECK parent tunggal activities hanya dipasang di Fase 2 setelah kode
menulis kolom baru. Kolom lama (parent_type/parent_id/owner) JANGAN di-drop di Fase 1.*
