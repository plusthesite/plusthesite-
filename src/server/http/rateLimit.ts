import { rateLimit } from "@/lib/rateLimit";
import { ServiceError } from "@/server/http/errors";

/**
 * Enforce a fixed-window rate limit for `key`, throwing a 429 ServiceError
 * with the given payload when the caller is over the limit. Thin wrapper over
 * the in-memory {@link rateLimit} counter so routes stay one-liners.
 */
export function enforceRateLimit(
    key: string,
    max: number,
    windowMs: number,
    payload: unknown = { error: "too_many_requests" }
): void {
    if (rateLimit(key, max, windowMs)) {
        throw new ServiceError(429, payload);
    }
}
