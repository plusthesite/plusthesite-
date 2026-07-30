# Documentation — plus. Website

> **plus.**  
> Build Smarter Brands. Faster. With AI + Human Creativity.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Design System](#design-system)
5. [Core Routes](#core-routes)
6. [Content Source of Truth](#content-source-of-truth)
7. [Notes](#notes)

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.6 | App Router framework |
| React | 19.2.0+ | UI layer |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | v4 | Styling |
| `next-themes` | current | Theme switching |
| Vitest | current | Unit tests |

---

## Getting Started

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Default local app URL:

```text
http://localhost:3000
```

---

## Project Structure

```text
src/
  app/
    [locale]/
      page.tsx                 Home
      blog/                    Blog index + article pages
      chat-bot/                Product landing
      customer-support/        Product landing
      mobile-app/              Product landing
      crm/                     Product landing
      digital-agency/          Product landing
      mobile-game/             Product landing
      studio/                  Studio app
      contact-us/              Contact page
      payment/                 Plan request flow
    admin/                     Internal dashboard
    api/                       App endpoints
  components/                  Shared site UI
  i18n/                        Active dictionaries + provider
  data/                        Long-form article content
  lib/                         Shared helpers and taxonomy
  server/                      Service / repository layer
```

---

## Design System

The active visual system lives in:

- `src/app/globals.css`
- `src/components/*`
- `src/i18n/dictionaries/en.ts`
- `src/i18n/dictionaries/id.ts`

Key rules:

- Light and dark mode are both supported.
- Shared sections should prefer existing tokens over hardcoded colors.
- Homepage and product pages now use the current bilingual route structure, not legacy static page URLs.
- Footer and product navigation should always point to internal localized routes when available.

---

## Core Routes

Localized public routes:

| Area | EN | ID |
|------|----|----|
| Home | `/en` | `/id` |
| Chat Bot | `/en/chat-bot` | `/id/chat-bot` |
| Customer Support | `/en/customer-support` | `/id/customer-support` |
| Mobile App | `/en/mobile-app` | `/id/mobile-app` |
| CRM | `/en/crm` | `/id/crm` |
| Digital Agency | `/en/digital-agency` | `/id/digital-agency` |
| Mobile Game | `/en/mobile-game` | `/id/mobile-game` |
| Blog | `/en/blog` | `/id/blog` |
| Contact | `/en/contact-us` | `/id/contact-us` |
| Studio | `/en/studio` | `/id/studio` |

AI generator routes:

- `/en/ai-image-generator`
- `/en/ai-text-generator`
- `/en/ai-video-generator`
- `/en/ai-music-generator`
- Indonesian equivalents under `/id/...`

---

## Content Source of Truth

Current active source of truth:

- Product and homepage copy: `src/i18n/dictionaries/en.ts` and `src/i18n/dictionaries/id.ts`
- Blog articles: `src/data/articles.ts`
- Service taxonomy and pricing helpers: `src/lib/services.ts`
- SEO / structured data: `src/app/[locale]/layout.tsx`

Do not treat these as source of truth anymore:

- Legacy static marketing URLs like `/about-us-1/`, `/ai-features/`, `/pricing/`
- Old orphan translation maps
- Historical docs that describe the pre-localized site structure

---

## Notes

- `src/data/articles.ts` is intentionally large and may trigger the Babel deoptimization note during build. It is currently a warning, not a failing condition.
- The payment flow is still a staged/manual path and should not be represented internally as a fully wired live gateway unless that integration actually ships.
- When refreshing docs, keep them aligned with the current route tree and current product offer status.
