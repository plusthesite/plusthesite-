/**
 * Fixed-window rate limiter, in memory.
 *
 * Scoped to one process: on a VPS behind a single Node server that is the
 * whole app, but under PM2 cluster mode (or serverless) each worker keeps its
 * own counters, so the effective limit is `max x workers`. Size the limits
 * with that in mind, or move the counters to Redis if a hard global cap is
 * ever needed.
 */

/** Hard ceiling on tracked keys so a flood of unique IPs cannot grow the map
 * without bound between sweeps. */
const MAX_KEYS = 10_000;

const store = new Map<string, { count: number; resetTime: number }>();

function sweep(now: number): void {
    for (const [key, entry] of store) {
        if (now > entry.resetTime) store.delete(key);
    }
}

// Periodic sweep of expired windows. `unref` keeps this timer from holding the
// process open, so SIGTERM shuts the server down immediately instead of
// waiting out the interval - it matters for zero-downtime restarts on a VPS.
setInterval(() => sweep(Date.now()), 5 * 60 * 1000).unref?.();

/**
 * Returns true when the caller should be blocked (limit exceeded).
 * @param key      Unique key per caller (e.g. `"contact:" + ip`)
 * @param max      Max requests allowed in the window
 * @param windowMs Window length in milliseconds
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
        if (store.size >= MAX_KEYS) sweep(now);
        store.set(key, { count: 1, resetTime: now + windowMs });
        return false;
    }

    entry.count++;
    return entry.count > max;
}
