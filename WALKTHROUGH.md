# plus. — Build Walkthrough (Claude / Opus)

What was built to turn **plusthe.site** into a full Digital-Agency site with a
WordPress-style admin + sales CRM. Companion to the parallel agent's notes.

---

## 1. Sales CRM (the core)

**Single source of truth:** `src/lib/services.ts` — 7 service lines (chatbot,
digital-agency, mobile-app, mobile-game, crm, customer-support, ai-tools). Every
lead & opportunity is tagged with a `service` slug, so the pipeline is segmented
for direct sales reach-out. Also powers pricing.

- **Leads** (`/admin/leads`) — segmented by service, status filters, summary
  cards, WhatsApp/Call/Email reach-out, **Convert → Opportunity**, **bulk
  actions** (set status / assign owner / delete).
- **Opportunities** (`/admin/opportunities`) — pipeline with open/weighted/won
  value + win-rate, per-service breakdown, inline stage editing, **bulk
  actions**, and a drag-&-drop **Kanban board** (`/board`).
- **Accounts** (`/admin/accounts`) — companies roll up their leads, deals &
  pipeline value; auto-created/linked from forms and the Places importer.
- **Activities & Tasks** — Salesforce/LeadSquared-style. Log calls / WhatsApp /
  email / meetings / notes on any lead or deal; set a due date to schedule a
  follow-up. Global **Tasks** page (`/admin/tasks`) with overdue highlighting.
- **Quick-message templates** — pre-filled WhatsApp/Email per record
  (`src/lib/templates.ts`, bilingual).
- **Real-business lead import** — `scripts/import-places-leads.mjs` pulls local
  businesses via the **official Google Places API** (ToS-compliant; deduped by
  `place_id`; auto-links accounts). No scraping.

## 2. Real-time Dashboard

`/admin` polls `/api/admin/stats` every 12s (+ on tab focus). Live engagement +
pipeline value, hot opportunities, **open/overdue follow-ups banner**, and live
charts: **new-leads (14-day) bar chart** + **pipeline-by-stage** breakdown.

## 3. WordPress-style Admin

Grouped sidebar (Content / Sales / Audience / Site / Tools), responsive mobile
drawer, global **Search** (`/admin/search` — leads, deals, accounts, articles),
**Export Center** (`/admin/export` → CSV per entity via `/api/admin/export`),
**Plugins** (live integration status), **Users** (Supabase Auth), **Settings**,
and a daily **pipeline email digest** (`/api/admin/digest`, optional Resend+cron).

## 4. Blog / Content

DB-first rendering — CMS posts override the 94 static seeds (deduped by slug), so
dashboard edits are authoritative. **All Posts** manager lists every article in
one place with status tabs and **Import-to-CMS** (makes a static article editable).

## 5. SEO & AI-Search Visibility

- CMS-aware `sitemap.xml` (includes published CMS posts).
- `robots.ts` blocks `/admin` + `/api`, explicitly allows AI crawlers
  (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …); removed the stale
  static `robots.txt` that left `/admin` crawlable.
- Dynamic `/llms.txt` — overview + full article index for AI ingestion.
- `BlogPosting` + `BreadcrumbList` + `FAQPage` + Organization/WebSite JSON-LD.

## 6. Indonesian-market Pricing & Lead Funnel

- IDR tiers (Starter Rp 2.5jt / Professional Rp 7.5jt / Enterprise Rp 20jt,
  annual −20%), fully bilingual.
- Contact form captures service + phone and creates a **segmented lead** (+
  account); product-page CTAs deep-link to `/contact-us?service=<slug>`.

---

## Database migrations (Supabase SQL Editor)

| File | Purpose | Status |
|---|---|---|
| `supabase/crm.sql` | leads enrichment + opportunities | ✅ applied |
| `supabase/seed_crm.sql` | sample pipeline (replace with real) | ✅ applied |
| `supabase/activities.sql` | activities & tasks | ⏳ run me |
| `supabase/accounts.sql` | accounts + backfill | ⏳ run me |
| `supabase/leads_places.sql` | Places import support | ⏳ run me |

## Optional env (for full features)

`GOOGLE_MAPS_API_KEY` (real lead import) · `RESEND_API_KEY` +
`ADMIN_DIGEST_EMAIL` + `CRON_SECRET` (auto digest).

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ clean |
| `npx next build` | ✅ 228 pages |
| Admin routes | ✅ dynamic |
| Blog | ✅ 94 SSG paths + DB-first |

> ⚠️ Two agents worked this repo in parallel — keep them synced (one owner for
> git, or separate worktrees) to avoid clobbering.
