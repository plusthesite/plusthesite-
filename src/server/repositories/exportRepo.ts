import { adminClient, DbError } from "@/server/repositories/client";

/** Fetch all rows of a table (newest first) for CSV export. The caller is
 * responsible for validating `table`/`columns` against an allowlist. */
export async function fetchRows(
    table: string,
    columns: string[],
    filter?: { column: string; value: string }
): Promise<Record<string, unknown>[]> {
    let q = adminClient()
        .from(table)
        .select(columns.join(","))
        .order("created_at", { ascending: false });
    if (filter) q = q.eq(filter.column, filter.value);
    const { data, error } = await q;
    if (error) throw new DbError(error.message);
    return (data ?? []) as unknown as Record<string, unknown>[];
}
