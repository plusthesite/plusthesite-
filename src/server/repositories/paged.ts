/**
 * PostgREST caps every response at PGRST_DB_MAX_ROWS (1000 on this stack). A plain
 * `.select()` with no range therefore returns the FIRST 1000 rows and silently
 * drops the rest - so a page that counts or aggregates rows reports a number that
 * disagrees with the dashboard's exact-count tile, and every derived statistic is
 * wrong. `tableCount()` (HEAD + count=exact) is immune to the cap; this is the
 * row-reading counterpart.
 *
 * Use it for any read whose rows are counted, summed or aggregated. For a plain
 * paged listing, page with `.range()` in the query itself instead.
 */

/** PGRST_DB_MAX_ROWS, so we never ask for a slice the server would clip. */
export const PAGE_SIZE = 1000;

/** Backstop against an unbounded loop if a query stops matching. */
const MAX_ROWS = 50_000;

/**
 * Read every row matching `query`, in slices of PAGE_SIZE, so nothing is lost to
 * the server-side row cap. `query` is a normal supabase-js builder; the range is
 * appended here.
 *
 * Throws if any slice errors - a partial read that looks like a small table is the
 * exact failure this module exists to prevent.
 */
/**
 * The subset of the supabase-js builder this helper uses. Typed structurally so
 * it stays independent of the builder's generic parameter list, which has grown
 * across supabase-js releases.
 */
type RangedQuery = {
    range(from: number, to: number): PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>;
};

export async function selectAll<T>(query: RangedQuery): Promise<T[]> {
    const rows: T[] = [];
    for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
        const { data, error } = await query.range(from, from + PAGE_SIZE - 1);
        if (error) throw new Error(`selectAll: ${error.message}`);
        const page = (data ?? []) as T[];
        rows.push(...page);
        if (page.length < PAGE_SIZE) return rows;
    }
    throw new Error(`selectAll: exceeded ${MAX_ROWS} rows; narrow the query`);
}
