import { tryAdminClient } from "@/server/repositories/client";

export type HealthPing =
    | { kind: "not_configured" }
    | { kind: "ok"; latencyMs: number }
    | { kind: "query_failed"; error: string }
    | { kind: "connection_failed"; error: string };

/**
 * Probe the Supabase connection with the cheapest query that proves the
 * round trip works: a HEAD-only exact count on `subscribers`, which returns no
 * rows. Uptime monitors hit this on an interval, so it must stay to one call.
 */
export async function pingDatabase(): Promise<HealthPing> {
    const supabase = tryAdminClient();
    if (!supabase) return { kind: "not_configured" };

    const startedAt = Date.now();
    try {
        const { error } = await supabase
            .from("subscribers")
            .select("id", { count: "exact", head: true });
        if (error) return { kind: "query_failed", error: error.message };
        return { kind: "ok", latencyMs: Date.now() - startedAt };
    } catch (err) {
        return { kind: "connection_failed", error: String(err) };
    }
}
