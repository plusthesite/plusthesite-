import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import { fetchRows } from "@/server/repositories/exportRepo";

/** Allowlist of exportable tables and the columns included in each CSV.
 * ERD v2: "contacts" exports from leads (source='contact-form'). */
const TABLES: Record<string, { table: string; columns: string[]; filter?: { column: string; value: string } }> = {
    leads: { table: "leads", columns: ["name", "email", "phone", "company", "service", "status", "value", "owner:owner_id(name)", "source", "created_at"] },
    opportunities: { table: "opportunities", columns: ["name", "company", "contact_name", "email", "phone", "value", "stage", "probability", "service", "owner:owner_id(name)", "expected_close", "created_at"] },
    accounts: { table: "accounts", columns: ["name", "industry", "website", "phone", "email", "owner:owner_id(name)", "created_at"] },
    subscribers: { table: "subscribers", columns: ["email", "locale", "created_at"] },
    contacts: { table: "leads", columns: ["name", "email", "company", "message", "created_at"], filter: { column: "source", value: "contact-form" } },
};

function csvCell(v: unknown): string {
    if (v === null || v === undefined) return "";
    // ERD v2: joined FK columns arrive as objects, e.g. owner: { name }.
    if (typeof v === "object" && v !== null && "name" in v) {
        return csvCell((v as { name: unknown }).name);
    }
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build a CSV export for an allowlisted table. */
export async function exportTable(type: string): Promise<{ filename: string; csv: string }> {
    const spec = TABLES[type];
    if (!spec) throw new ServiceError(400, { error: "invalid type" });

    try {
        const rows = await fetchRows(spec.table, spec.columns, spec.filter);
        const header = spec.columns.join(",");
        const body = rows.map((r) => spec.columns.map((c) => csvCell(r[c])).join(",")).join("\n");
        const csv = `${header}\n${body}\n`;
        const date = new Date().toISOString().slice(0, 10);
        return { filename: `plus-${type}-${date}.csv`, csv };
    } catch (err) {
        if (err instanceof NotConfiguredError) throw new ServiceError(503, { error: "not configured" });
        if (err instanceof DbError) throw new ServiceError(500, { error: err.dbMessage });
        throw err;
    }
}
