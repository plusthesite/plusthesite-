# Backend / Frontend Separation

This app is a Next.js monolith, but the **backend logic is now cleanly separated
from the frontend** by layering, not by splitting into two deployments. The goal:
testable, reusable server logic that can later be extracted into a standalone
API service with minimal churn — without paying the operational cost of a second
deploy today.

## Layers

```
src/
  app/[locale]/**      FRONTEND — pages, UI
  components/**         FRONTEND — React components
  app/api/**/route.ts  HTTP boundary — thin: parse, rate-limit, status codes
  server/
    http/              boundary helpers (errors, responses, auth, rate limit)
    validators/        input parsing + validation (zod)
    services/          business logic — HTTP-agnostic, throws ServiceError
    repositories/      the ONLY place that talks to Supabase
  lib/**               shared utilities + config (used by UI and server)
```

### The one rule that makes extraction easy

> **Route handlers and services never import the Supabase client directly.**
> All database access goes through a repository.

A route handler is now a few lines: enforce a rate limit, parse the body,
call a service, return the result. Everything else lives behind the layer
boundary. To turn `server/` into a standalone API later, you lift `services/` +
`repositories/` out and put any HTTP framework (Hono/Express/Nest) in front —
the business logic doesn't change.

## Request flow

```
Request → route.ts ──parse──▶ validators/  (400 on bad input)
                  └──call──▶ services/    (business logic)
                                 └──▶ repositories/ ──▶ Supabase
```

- **validators/** use `zod` and throw `ServiceError(400, payload)` with the
  exact legacy error payloads (contracts preserved for the frontend).
- **services/** are pure of HTTP. They translate repository errors
  (`NotConfiguredError`, `DbError`) into the right `ServiceError`.
- **repositories/** return data or throw `NotConfiguredError` / `DbError`.
- The `route()` wrapper in `server/http/respond.ts` maps any thrown
  `ServiceError` to its `NextResponse`, and anything else to a logged 500.

## Error types

| Type                 | Where thrown        | Meaning                                   |
| -------------------- | ------------------- | ----------------------------------------- |
| `ServiceError`       | validators/services | short-circuit with an exact HTTP response |
| `NotConfiguredError` | repositories        | Supabase env vars missing                 |
| `DbError`            | repositories        | a Supabase query returned an error        |

`ServiceError` lives in `server/http/errors.ts` (no framework imports) so
validators and services stay unit-testable without loading `next`.

## Endpoints (all behavior-preserving)

`/api/lead` · `/api/contact` · `/api/subscribe` · `/api/view` · `/api/chat` ·
`/api/ai` · `/api/health` · `/api/admin/{stats,digest,export,notifications}`

Response shapes, status codes, and error strings are unchanged — the frontend
callers (`ChatWidget`, `Newsletter`, `contact-us`, `NotificationBell`,
`LiveDashboard`, `ArticleViews`, `lib/ai.ts`) need no changes.

## Tests

`npm test` (vitest) covers the pure logic:

- `server/validators/validators.test.ts` — every validator's happy path + error
  contract (incl. the contact required-vs-format precedence).
- `server/services/statsService.test.ts` — `aggregateDashboard` math
  (pipeline, win/conversion rate, stage breakdown, rep leaderboard).

## Compatibility shims

`lib/adminStats.ts` and `lib/notifications.ts` now re-export from the server
layer so existing admin-page / server-action imports keep working. New code
should import from `@/server/services/*`. Remove the shims once importers are
migrated.

## Security fix: notifications endpoint locked down

`/api/admin/notifications` originally had **no auth guard**, and `middleware.ts`
explicitly skips `/api/*` (matcher excludes `api`) — so it was publicly
readable/writable. Fixed on two layers (defense in depth):

1. **Route:** GET + PATCH now call `requireAdmin()` (same as the other
   `/api/admin` routes).
2. **Database:** RLS on `public.notifications` is tightened so only the service
   role can access it. The old `FOR SELECT USING (true)` policy had no
   `TO authenticated` clause, so it applied to PUBLIC — anyone with the public
   anon key could read every notification directly via the REST API. See
   `supabase/notifications.sql`; the migration must be run on the live project.

## Behavior notes intentionally preserved (review these)

1. **Not-configured (503) now surfaces from the service** when a DB write is
   attempted, rather than as a pre-check before body parsing. Only matters in
   the dev state where Supabase env vars are unset; the success and validation
   contracts are identical.
3. **Malformed JSON** on `/api/ai` falls through to the generic 500 wrapper
   instead of echoing the JSON parse error message. Real clients send valid
   JSON; contact/chat keep their specific 500 strings.

## Future: extracting a standalone API

When a second consumer appears (mobile app, partner API) or logic gets heavy
(queues, cron, compute):

1. Move `server/services` + `server/repositories` + `server/validators` into a
   new package (`apps/api`) in a monorepo.
2. Put Hono/Express/Nest in front; map routes to the same services.
3. Replace `server/http/respond` with that framework's response layer.
4. Point the Next frontend's fetch calls at the new API base URL.

Nothing in the service/repository layer changes — that's the payoff of the
separation done here.
