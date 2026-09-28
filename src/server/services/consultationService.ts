import { insertLead } from "@/server/repositories/leadRepo";
import type { LeadRow } from "@/server/repositories/leadRepo";
import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import type { ConsultationInput } from "@/server/validators/consultation";
import { BUDGET_LABELS } from "@/server/validators/consultation";

/**
 * Persist a free-consultation lead capture.
 *
 * Field mapping (ERD v2 `leads` table — no dedicated `need`/`budget_range`
 * columns exist):
 *  - need        -> service  (free text; matches SERVICE slugs where possible)
 *  - budget_range -> message  (prepended as "Budget: Rp ...")
 *  - status       -> "new"    (discovery_requested requires a CHECK-constraint
 *                             migration; see src/lib/leadStages.ts)
 *
 * Mirrors leadService.createLead error surfacing: 503 when DB not configured,
 * 500 on a write error.
 */
export async function createConsultationLead(input: ConsultationInput): Promise<{ ok: true }> {
    const parts: string[] = [];
    if (input.budget_range) parts.push(`Budget: ${BUDGET_LABELS[input.budget_range]}`);
    if (input.message) parts.push(input.message);

    const row: LeadRow = {
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        service: input.need ?? null,
        message: parts.length ? parts.join("\n\n") : null,
        locale: input.locale,
        source: "landing-konsultasi",
        status: "new",
    };

    try {
        await insertLead(row);
    } catch (err) {
        if (err instanceof NotConfiguredError) throw new ServiceError(503, { error: "not_configured" });
        if (err instanceof DbError) {
            console.error("Consultation lead insert error:", err.dbMessage);
            throw new ServiceError(500, { error: "db_error" });
        }
        throw err;
    }

    return { ok: true };
}
