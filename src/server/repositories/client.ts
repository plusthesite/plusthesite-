import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Repository layer: the ONLY place that talks to Supabase. Routes and services
 * never import the Supabase client directly - they go through a repository.
 */

/** Thrown when the service-role Supabase client is not configured (missing env
 * vars). Services translate this into the right response - a 503 for writes,
 * or graceful empty data for reads that should degrade silently. */
export class NotConfiguredError extends Error {
    constructor() {
        super("Supabase service-role client is not configured");
        this.name = "NotConfiguredError";
    }
}

/** Thrown when a Supabase query returns an error. Carries the DB message so
 * services can log it or surface a detail field. */
export class DbError extends Error {
    constructor(public readonly dbMessage: string) {
        super(dbMessage);
        this.name = "DbError";
    }
}

/** Service-role client, or throw {@link NotConfiguredError}. Use for writes. */
export function adminClient(): SupabaseClient {
    const client = getSupabaseAdmin();
    if (!client) throw new NotConfiguredError();
    return client;
}

/** Service-role client, or null. Use for reads that degrade gracefully. */
export function tryAdminClient(): SupabaseClient | null {
    return getSupabaseAdmin();
}
