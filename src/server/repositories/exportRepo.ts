import { adminClient, DbError } from "@/server/repositories/client";
import { PAGE_SIZE } from "@/server/repositories/paged";

/** Fetch all rows of a table (newest first) for CSV export. The caller is
 * responsible for validating `table`/`columns` against an allowlist.
 *
 * Read in slices: an unbounded select is clipped by PostgREST at
 * PGRST_DB_MAX_ROWS (1000), so a single request silently exported only the first
 * 1000 of 2162 leads. */
export async function fetchRows(
    table: string,
    columns: string[],
    filter?: { column: string; value: string }
): Promise<Record<string, unknown>[]> {
    const client = adminClient();
    const build = () => {
        let q = client
            .from(table)
            .select(columns.join(","))
            .order("created_at", { ascending: false });
        if (filter) q = q.eq(filter.column, filter.value);
        return q;
    };

    const rows: Record<string, unknown>[] = [];
    for (let from = 0; ; from += PAGE_SIZE) {
        const { data, error } = await build().range(from, from + PAGE_SIZE - 1);
        if (error) throw new DbError(error.message);
        const page = (data ?? []) as unknown as Record<string, unknown>[];
        rows.push(...page);
        if (page.length < PAGE_SIZE) return rows;
    }
}
