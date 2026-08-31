# Deploying plus. to a VPS

`next.config.ts` sets `output: "standalone"`, so a build emits
`.next/standalone/server.js` — a self-contained server with only the
`node_modules` it actually imports traced into it. That is what runs on the
box; the VPS never installs dev or build dependencies.

Nginx terminates TLS and proxies to a single loopback port. Two ways to run the
process — pick one.

---

## 1. Environment

Build time vs run time is the thing to get right. `NEXT_PUBLIC_*` values are
**inlined into the browser bundle during `next build`**; everything else is
read per request.

| Variable | When | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **build** | Also read server-side, but the bundle needs it baked in. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **build** | Public by design; RLS protects the data. |
| `NEXT_PUBLIC_STUDIO_URL` | **build** | Link out to `studio.plusthe.site`. |
| `NEXT_PUBLIC_HERO_SHADER` | **build** | `off` unless the `shaders` package is licensed. |
| `SUPABASE_SERVICE_ROLE_KEY` | **run** | Bypasses RLS. Server-only, always. |
| `RESEND_API_KEY` / `ADMIN_DIGEST_EMAIL` | run | Daily digest email. Optional. |
| `CRON_SECRET` | run | Lets a cron POST `/api/admin/digest` without a session. |
| `HACK_DB_*` | run | Read-only hackathon dataset. Optional. |
| `PORT` / `HOSTNAME` | run | Default `3000` / `0.0.0.0`. Bind to `127.0.0.1` behind nginx. |

Changing a `NEXT_PUBLIC_*` value requires a **rebuild**, not a restart.

> **Secret hazard:** `next build` copies any `.env*` file it finds into
> `.next/standalone/`. Never rsync a dev `.env` to the server, and never build
> an image without `.dockerignore` in place — both the `Dockerfile` and
> `.dockerignore` here already guard against it.

---

## 2A. Run with Docker (recommended)

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..." \
  --build-arg NEXT_PUBLIC_STUDIO_URL="https://studio.plusthe.site" \
  -t plus-site:latest .

docker run -d --name plus-site --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY="..." \
  -e RESEND_API_KEY="..." \
  -e ADMIN_DIGEST_EMAIL="you@plusthe.site" \
  -e CRON_SECRET="$(openssl rand -hex 32)" \
  plus-site:latest
```

The image runs as a non-root user and declares a `HEALTHCHECK` against
`/api/health`.

## 2B. Run with PM2

The standalone server expects `.next/static` and `public/` to sit next to it,
which `next build` does **not** do — copy them after every build:

```bash
npm ci
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npm run build

cp -r .next/static .next/standalone/.next/static
cp -r public       .next/standalone/public
rm -f .next/standalone/.env*          # see the secret hazard above

export SUPABASE_SERVICE_ROLE_KEY="..."
pm2 start ecosystem.config.cjs --env production
pm2 save && pm2 startup
```

Redeploy: repeat the block, then `pm2 reload plus-site`.

---

## 3. Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name plusthe.site www.plusthe.site;

    ssl_certificate     /etc/letsencrypt/live/plusthe.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/plusthe.site/privkey.pem;

    client_max_body_size 2m;

    gzip on;
    gzip_types application/javascript application/json text/css image/svg+xml;
    gzip_min_length 1024;

    # Hashed build assets are immutable; serve them straight from the app but
    # let the browser keep them forever.
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        # The API rate limiter reads the first entry of this header, so nginx
        # must be the only hop in front of the app.
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# The middleware rewrites this host onto /hackathon/*, so it only needs to
# reach the same upstream.
server {
    listen 443 ssl http2;
    server_name hackathon.plusthe.site;
    ssl_certificate     /etc/letsencrypt/live/plusthe.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/plusthe.site/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host            $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 80;
    server_name plusthe.site www.plusthe.site hackathon.plusthe.site;
    return 301 https://$host$request_uri;
}
```

Certificates:
`certbot --nginx -d plusthe.site -d www.plusthe.site -d hackathon.plusthe.site`

---

## 4. Daily digest cron

`/api/admin/digest` accepts either an admin session or the `x-cron-secret`
header. On the VPS:

```cron
0 8 * * * curl -fsS -X POST -H "x-cron-secret: $CRON_SECRET" \
  https://plusthe.site/api/admin/digest > /dev/null
```

---

## 5. Verify

```bash
curl -s https://plusthe.site/api/health
# {"status":"ok","message":"Supabase connected successfully!","latencyMs":42,"uptimeSec":90}

# Security headers should be present, and the framework header absent.
curl -sI https://plusthe.site | grep -iE 'x-content-type|x-frame|strict-transport|x-powered-by'

# The write endpoints are rate limited: this should reach 429.
for i in $(seq 1 8); do
  curl -s -o /dev/null -w "%{http_code} " -X POST \
    -H 'Content-Type: application/json' -d '{"email":"a@b.io"}' \
    https://plusthe.site/api/subscribe
done; echo
```

A 503 from `/api/health` means `SUPABASE_SERVICE_ROLE_KEY` or
`NEXT_PUBLIC_SUPABASE_URL` never reached the process.

---

## 6. Notes

- **Rate limiting is per process.** `src/lib/rateLimit.ts` keeps counters in
  memory, so `instances: 1` in PM2 (or one container) keeps the published
  limits honest. Scaling out multiplies them — move the counters to Redis
  before doing that.
- **Netlify config is still in the repo.** `netlify.toml` is kept so a fallback
  deploy stays possible; it has no effect on the VPS.
- **`shaders` is a licensed dependency.** It only loads when
  `NEXT_PUBLIC_HERO_SHADER=on`. Leave it off in production unless the licence
  is in place.
