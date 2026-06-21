import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import { fetchRows } from "@/server/repositories/exportRepo";

/** Allowlist of exportable tables and the columns included in each CSV. */
const TABLES: Record<string, { columns: string[] }> = {
    leads: { columns: ["name", "email", "phone", "company", "service", "status", "value", "owner", "source", "created_at"] },
    opportunities: { columns: ["name", "company", "contact_name", "email", "phone", "value", "stage", "probability", "service", "owner", "expected_close", "created_at"] },
    accounts: { columns: ["name", "industry", "website", "phone", "email", "owner", "created_at"] },
    subscribers: { columns: ["email", "locale", "created_at"] },
    contacts: { columns: ["name", "email", "company", "message", "created_at"] },
};

function csvCell(v: unknown): string {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build a CSV export for an allowlisted table. */
export async function exportTable(type: string): Promise<{ filename: string; csv: string }> {
    const spec = TABLES[type];
    if (!spec) throw new ServiceError(400, { error: "invalid type" });

    try {
        const rows = await fetchRows(type, spec.columns);
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
