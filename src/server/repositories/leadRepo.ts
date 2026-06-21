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

/** Insert a lead. Throws {@link DbError} on failure. */
export async function insertLead(row: LeadRow): Promise<void> {
    const { error } = await adminClient().from("leads").insert(row);
    if (error) throw new DbError(error.message);
}
