import { pingDatabase } from "@/server/repositories/healthRepo";

/** Map a DB ping to the health endpoint's status + body contract. */
export async function checkHealth(): Promise<{ status: number; body: unknown }> {
    const ping = await pingDatabase();

    switch (ping.kind) {
        case "not_configured":
            return { status: 503, body: { status: "error", message: "Supabase not configured (missing URL or key)" } };
        case "ok":
            return { status: 200, body: { status: "ok", message: "Supabase connected successfully!" } };
        case "query_failed":
            return { status: 500, body: { status: "error", message: "Supabase connected but query failed", error: ping.error } };
        case "connection_failed":
            return { status: 500, body: { status: "error", message: "Connection failed", error: ping.error } };
    }
}
