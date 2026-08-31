import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service-role key.
 * Used by route handlers, server components and server actions to read/write
 * every table. Never import this into a Client Component.
 *
 * Returns `null` when env vars are absent so the app builds and runs (the
 * DB-backed features degrade gracefully) before Supabase is set up.
 *
 * The client is memoized per process: it holds a connection pool and a fetch
 * agent, so building a fresh one on every render/request leaks sockets on a
 * long-lived server (a VPS process) and wastes work on serverless.
 */
let adminClient: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
    if (adminClient !== undefined) return adminClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    adminClient =
        url && serviceKey
            ? createClient(url, serviceKey, {
                  auth: { persistSession: false, autoRefreshToken: false },
              })
            : null;
    return adminClient;
}

export const isSupabaseConfigured = () =>
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
