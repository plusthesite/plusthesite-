import { adminClient, DbError } from "@/server/repositories/client";

/** A row ready to insert into the `leads` table. */
export interface LeadRow {
    name: string | null;
    email: string;
    phone: string | null;
    company: string | null;
    service: string | null;
    message: string | null;
    locale: "id" | "en";
    source: string;
    status: string;
    account_id?: string | null;
}

/** Update fields for a lead. */
export interface LeadUpdate {
    status?: string;
    notes?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
}

/** Insert a lead. Throws {@link DbError} on failure. */
export async function insertLead(row: LeadRow): Promise<void> {
    const { error } = await adminClient().from("leads").insert(row);
    if (error) throw new DbError(error.message);
}

/** Update a lead by ID. Throws {@link DbError} on failure. */
export async function updateLead(id: string, updates: LeadUpdate): Promise<void> {
    const { error } = await adminClient().from("leads").update(updates).eq("id", id);
    if (error) throw new DbError(error.message);
}

/** Get leads with optional filters. */
export async function getLeads(filters?: {
    stage?: string;
    minScore?: number;
    maxScore?: number;
    source?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
}): Promise<any[]> {
    let query = adminClient().from("leads").select("*").order("created_at", { ascending: false });

    if (filters?.stage) query = query.eq("status", filters.stage);
    if (filters?.source) query = query.eq("source", filters.source);
    if (filters?.dateFrom) query = query.gte("created_at", filters.dateFrom);
    if (filters?.dateTo) query = query.lte("created_at", filters.dateTo);
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1);

    const { data, error } = await query;
    if (error) throw new DbError(error.message);
    return data ?? [];
}
