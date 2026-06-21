import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import { insertLead } from "@/server/repositories/leadRepo";
import type { LeadInput } from "@/server/validators/lead";

/** Persist a public lead capture. Mirrors the original contract: 503 when the
 * DB is not configured, 500 on a write error. */
export async function createLead(input: LeadInput): Promise<{ ok: true }> {
    try {
        await insertLead({ ...input, status: "new" });
        return { ok: true };
    } catch (err) {
        if (err instanceof NotConfiguredError) {
            throw new ServiceError(503, { error: "not_configured" });
        }
        if (err instanceof DbError) {
            console.error("Lead insert error:", err.dbMessage);
            throw new ServiceError(500, { error: "db_error" });
        }
        throw err;
    }
}
