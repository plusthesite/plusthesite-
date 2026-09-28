import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import { insertLead, updateLead, getLeads, type LeadUpdate } from "@/server/repositories/leadRepo";
import type { LeadInput } from "@/server/validators/lead";
import { isValidTransition } from "@/lib/leadStages";

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

/** Update lead stage with validation. */
export async function updateLeadStage(leadId: string, newStage: string): Promise<{ ok: true }> {
    try {
        // Get current lead to validate transition
        const leads = await getLeads({ limit: 1 });
        const currentLead = leads.find(l => l.id === leadId);
        if (!currentLead) {
            throw new ServiceError(404, { error: "lead_not_found" });
        }

        const currentStage = currentLead.status as any;
        if (!isValidTransition(currentStage, newStage as any)) {
            throw new ServiceError(400, { error: "invalid_stage_transition", from: currentStage, to: newStage });
        }

        await updateLead(leadId, { status: newStage });
        return { ok: true };
    } catch (err) {
        if (err instanceof ServiceError) throw err;
        if (err instanceof DbError) {
            console.error("Lead stage update error:", err.dbMessage);
            throw new ServiceError(500, { error: "db_error" });
        }
        throw err;
    }
}

/** Add internal note to lead. */
export async function addLeadNote(leadId: string, note: string): Promise<{ ok: true }> {
    try {
        await updateLead(leadId, { notes: note });
        return { ok: true };
    } catch (err) {
        if (err instanceof DbError) {
            console.error("Lead note error:", err.dbMessage);
            throw new ServiceError(500, { error: "db_error" });
        }
        throw err;
    }
}

/** Get leads with filters for dashboard. */
export async function getLeadsDashboard(filters?: {
    stage?: string;
    minScore?: number;
    maxScore?: number;
    source?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
}): Promise<any[]> {
    try {
        return await getLeads(filters);
    } catch (err) {
        if (err instanceof DbError) {
            console.error("Get leads error:", err.dbMessage);
            throw new ServiceError(500, { error: "db_error" });
        }
        throw err;
    }
}

/** Export leads to CSV format. */
export async function exportLeadsCSV(filters?: Parameters<typeof getLeads>[0]): Promise<string> {
    const leads = await getLeads(filters);
    const headers = ["id", "name", "email", "phone", "company", "service", "status", "source", "created_at", "utm_source", "utm_medium", "utm_campaign"];
    const rows = leads.map(l => headers.map(h => `"${(l[h] ?? "").toString().replace(/"/g, '""')}"`).join(","));
    return [headers.join(","), ...rows].join("\n");
}
