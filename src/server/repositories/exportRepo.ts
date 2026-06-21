import { adminClient, DbError } from "@/server/repositories/client";

/** Fetch all rows of a table (newest first) for CSV export. The caller is
 * responsible for validating `table`/`columns` against an allowlist. */
export async function fetchRows(
    table: string,
    columns: string[]
): Promise<Record<string, unknown>[]> {
    const { data, error } = await adminClient()
        .from(table)
        .select(columns.join(","))
        .order("created_at", { ascending: false });
    if (error) throw new DbError(error.message);
    return (data ?? []) as unknown as Record<string, unknown>[];
}
