# plus. marketing site - production image for the VPS.
#
# Three stages so the runtime layer carries only what `next start` needs: no
# dev dependencies, no source, no build cache. Relies on `output: "standalone"`
# in next.config.ts, which traces the exact node_modules the server imports.

# --- deps: install once, cached on package-lock.json alone ------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder: compile the app ----------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the browser bundle at build time, so
# they must be present here - not just at runtime. Server-only secrets
# (SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, RESEND_API_KEY, CRON_SECRET) are
# read at request time and belong in the runtime environment instead.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_STUDIO_URL
ARG NEXT_PUBLIC_HERO_SHADER=off
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_STUDIO_URL=$NEXT_PUBLIC_STUDIO_URL \
    NEXT_PUBLIC_HERO_SHADER=$NEXT_PUBLIC_HERO_SHADER

RUN npm run build

# --- runner: the only layer that ships -------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# standalone/ is the traced server; static/ and public/ are served from disk.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Belt and braces: .dockerignore already excludes .env, but the standalone
# tracer copies any that slipped through.
RUN rm -f .env .env.local .env.production

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
