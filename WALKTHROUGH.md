# plus. — Build Walkthrough (Claude / Opus)

How plusthe.site became a full Digital-Agency site with a WordPress-style admin,
a real sales CRM, 1,500+ real leads, strong Indonesian SEO, honest copy,
a WYSIWYG blog editor, sales team management, and in-app notifications.

---

## 1. Sales CRM (the core)

**Single source of truth:** `src/lib/services.ts` — 7 service lines. Every lead &
opportunity is tagged with a `service` slug, so the pipeline is segmented for
direct sales reach-out. Also powers pricing.

- **Leads** (`/admin/leads`) — segmented by service, status filters, summary
  cards, WhatsApp/Call/Email, **Convert → Opportunity**, **bulk actions**,
  **+ New Lead** form.
- **Priority** (`/admin/priority`) — **lead scoring** (0–100) by deal value,
  reachability, funnel stage, source & recency; ranks the hottest prospects
  with Hot/Warm/Cold tiers so sales works the best leads first.
- **Opportunities** (`/admin/opportunities`) — pipeline with open/weighted/won +
  win-rate, per-service breakdown, inline stage editing, **bulk actions**,
  **+ New** form, and a drag-&-drop **Kanban board** (`/board`).
- **Accounts** (`/admin/accounts`) — companies roll up their leads, deals &
  pipeline value; auto-created/linked from forms and the importer.
- **Activities & Tasks** — log calls/WhatsApp/email/meetings/notes; schedule
  follow-ups; global **Tasks** page with overdue highlighting.
- **Quick-message templates** — organic, low-pressure WhatsApp/Email openers
  (warm, question-led, no hard sell, explains how we found them) that the rep
  personalises in an editable box before sending — built to earn trust, not spam.
- **Team management** (`/admin/team`) — sales rep roster with role badges
  (sales/manager/admin), avatar initials, assigned lead count + open pipeline
  per rep, toggle active/inactive, delete. Bulk assign dropdown uses rep list.
- **Sales Playbook** (`/admin/playbook`) — the sales team's hub: a **live,
  interactive funnel** (Leads → open pipeline by stage → Closed Won → active
  service, all clickable to drill into the Kanban) plus a complete Bahasa
  Indonesia guide — daily routine, the 6 pipeline stages and when to advance,
  organic outreach principles, BANT qualification, objection handling, and
  closing — so every rep knows how to turn a lead into Closed Won.

## 2. Real lead generation (Google Places API)

`scripts/import-places-leads.mjs` imports real local businesses via the official
Places API (New) — ToS-compliant, deduped by `place_id`, `--require-phone` so
every lead is reachable, auto-linked to an Account.

**≈1,492 reachable, de-duplicated leads** (~1,491 accounts, no orphans) across 16+ cities —
Jakarta, Surabaya, Bandung, Medan, Semarang, Makassar, Yogyakarta, Bali/Denpasar,
Malang, Bekasi, Tangerang and more. Segmented by service, weighted toward
high-revenue lines (property developers, 5-star hotels, private hospitals,
premium auto dealers, international schools, contractors).

Each lead carries an indicative deal value per service (importer auto-sets it),
so the dashboard shows **≈Rp 19 billion total pipeline potential** for the
sales team to prioritise.

**Data hygiene / dedup — done.** Imports are deduped by `place_id` at write time.
A reviewed SQL snippet (preview → delete, run by a human in the Supabase SQL
Editor) then removed ~10 fabricated seed leads, collapsed phone-duplicate chains,
and pruned orphan accounts: **1,492 clean leads · 1,491 accounts · 0 fabricated ·
0 phone duplicates · 0 orphans.** Bulk deletes on the live DB are intentionally
human-signed-off, never agent-run.

## 3. Real-time Dashboard

`/admin` polls `/api/admin/stats` every 12s. Live engagement + pipeline value,
hot opportunities, open/overdue follow-ups banner, **14-day new-leads chart** +
**pipeline-by-stage** breakdown. Fully responsive (2-up stat cards on mobile,
fluid type/padding).

**Today's Focus** — an eye-catching, mobile-first panel that answers "what do I
do now?": the **5 hottest scored leads** (one-tap WhatsApp/Call) and the
**follow-up tasks due today / overdue** (one-tap Done), each linking to its
record. Turns the dashboard into a daily action list, not just numbers.

## 4. WordPress-style Admin

Grouped sidebar (Content / Sales / Audience / Site / Tools), responsive mobile
drawer, global **Search**, **Export Center** (CSV), **Plugins**, **Users**,
**Settings**, **Email digest** (`/api/admin/digest`, optional Resend+cron).

**Role-based access (RBAC).** The signed-in user's role is resolved by matching
their auth email against the `sales_reps` roster (`src/lib/role.ts`); owner /
unrostered logins default to `admin`. The sidebar is filtered per role
(`canAccess`) so **sales** only see selling tools (Priority, Leads,
Opportunities, Tasks, Accounts, Playbook, Search, Analytics), **manager** adds
Team + content + audience, **admin** sees everything. Sensitive pages
(Users / Settings / Plugins → admin-only, Team → admin+manager) also
`requireRole`-guard against direct-URL access.

**User provisioning** (`/admin/users/new`, admin-only) — admin creates a login
in one place: it calls the Supabase Auth admin API to create the account
(email pre-confirmed) **and** registers it in `sales_reps` with the chosen role,
so RBAC applies immediately. Includes a secure password generator and a
one-time credentials panel to hand to the new sales/manager/admin user.

## 5. Blog / Content + Article SEO

DB-first rendering (CMS overrides static seeds), **All Posts** manager with
Import-to-CMS. **TipTap WYSIWYG editor** replaces the raw HTML textarea —
bold, italic, underline, headings (H2/H3), bullet/ordered lists, blockquote,
code blocks, links, images, horizontal rule, undo/redo. Dynamically loaded
(no SSR) with a clean toolbar matching admin design. Every article carries
enriched `BlogPosting` JSON-LD (ImageObject, wordCount, isPartOf,
author/publisher linked to the org) + rich OpenGraph.

## 6. SEO & AI-Search Visibility (Indonesia)

- `Organization → ProfessionalService` with Indonesian address, areaServed (8
  cities + nationwide), contactPoint, priceRange/currency (IDR), makesOffer.
- `Service + Offer (IDR) + BreadcrumbList` JSON-LD on every product page.
- Indonesian keyword set; `og:alternateLocale`.
- CMS-aware sitemap; robots blocks /admin + allows AI crawlers; dynamic
  `/llms.txt` with Indonesia coverage + IDR tiers for AI-citation.

## 7. Copywriting & Integrity (copywriting skill)

Applied the `copywriting` skill site-wide — clarity > cleverness, benefit >
feature, specific, customer language:

- Hero, About, Products, AI Features, product cards, footer rewritten benefit-led.
- **Honesty fixes** (critical): removed fabricated stats ("Join 10,000+", "50M+
  Downloads", "500+ Happy Customers"), false "Free Trial" CTAs (plus. is an
  IDR-retainer agency) → "Get a Free Quote". Hid fabricated named testimonials.
- Replaced fake proof with a **ProofBand** of verifiable facts (90+ articles, 7
  services, ID/EN, AI+Human) + an honest **How We Work** 4-step section.

## Indonesian-market pricing & lead funnel

IDR tiers (Starter Rp 2.5jt / Professional Rp 7.5jt / Enterprise Rp 20jt, annual
−20%). Contact form + product CTAs create segmented leads (+ accounts).

## 9. In-App Notifications

Real-time notification center in the admin sidebar (desktop + mobile):

- **NotificationBell** — unread count badge (rose dot), dropdown panel, polls
  every 15s, click-outside-to-close.
- Auto-fires on: new lead created, new opportunity created, lead converted.
- Mark individual or **Mark all read**.
- Each notification links to the relevant admin page.
- `/api/admin/notifications` — GET (latest 30 + unread count), PATCH (mark
  read by IDs or all).
- `lib/notifications.ts` — fire-and-forget helper (never blocks main actions).
- DB: `supabase/notifications.sql` — indexed on unread + created_at.

---

## Database migrations (Supabase SQL Editor)

| File | Purpose | Status |
|---|---|---|
| `supabase/crm.sql` + `seed_crm.sql` | leads + opportunities | ✅ applied |
| `supabase/activities.sql` | activities & tasks | ✅ applied |
| `supabase/accounts.sql` | accounts + backfill | ✅ applied |
| `supabase/leads_places.sql` | Places import support | ✅ applied |
| `supabase/sales_reps.sql` | sales team roster | ⬜ run in SQL Editor |
| `supabase/notifications.sql` | in-app notifications | ⬜ run in SQL Editor |

## Optional env

`GOOGLE_MAPS_API_KEY` (✅ real lead import working) · `RESEND_API_KEY` +
`ADMIN_DIGEST_EMAIL` + `CRON_SECRET` (auto digest).

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ clean |
| `npx next build` | ✅ 232 pages |

> ⚠️ Two agents worked this repo in parallel — keep them synced (one git owner,
> or separate worktrees) to avoid clobbering.
