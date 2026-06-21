import { adminClient, DbError } from "@/server/repositories/client";

export interface ContactRow {
    name: string;
    email: string;
    company: string | null;
    message: string;
}

/** Insert a contact submission, returning the created row. Throws on failure. */
export async function insertContact(row: ContactRow): Promise<Record<string, unknown>> {
    const { data, error } = await adminClient()
        .from("contacts")
        .insert({ name: row.name, email: row.email, company: row.company, message: row.message })
        .select()
        .single();
    if (error) throw new DbError(error.message);
    return data as Record<string, unknown>;
}

/** Upsert a company account by name and return its id. Best-effort: returns
 * null if the table is missing or the write fails (matches legacy behavior). */
export async function upsertAccountByName(name: string): Promise<string | null> {
    try {
        const { data } = await adminClient()
            .from("accounts")
            .upsert({ name }, { onConflict: "name" })
            .select("id")
            .maybeSingle();
        return (data?.id as string | undefined) ?? null;
    } catch {
        return null;
    }
}
