import { tryAdminClient } from "@/server/repositories/client";

export type HealthPing =
    | { kind: "not_configured" }
    | { kind: "ok" }
    | { kind: "query_failed"; error: string }
    | { kind: "connection_failed"; error: string };

/** Probe the Supabase connection: try the `version` RPC, fall back to a trivial
 * table query, and classify the outcome. */
export async function pingDatabase(): Promise<HealthPing> {
    const supabase = tryAdminClient();
    if (!supabase) return { kind: "not_configured" };

    try {
        const { error } = await supabase.rpc("version");
        if (error) {
            const { error: fallbackError } = await supabase.from("subscribers").select("id").limit(1);
            if (fallbackError) return { kind: "query_failed", error: fallbackError.message };
        }
        return { kind: "ok" };
    } catch (err) {
        return { kind: "connection_failed", error: String(err) };
    }
}
