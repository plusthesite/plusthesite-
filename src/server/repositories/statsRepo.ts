import { tryAdminClient } from "@/server/repositories/client";
import { selectAll } from "@/server/repositories/paged";

/** Exact row count for a table; 0 when Supabase is not configured.
 * Optional filter narrows the count (e.g. leads with source=contact-form).
 *
 * Uses HEAD + count=exact, so it is NOT affected by PGRST_DB_MAX_ROWS - which is
 * exactly why an exact count and a row count taken from `.select()` disagreed. */
export async function tableCount(table: string, filter?: string): Promise<number> {
    const supabase = tryAdminClient();
    if (!supabase) return 0;
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) {
        const [col, rest] = filter.split("=eq.");
        if (rest !== undefined) q = q.eq(col, rest);
    }
    const { count } = await q;
    return count ?? 0;
}

/** Raw rows backing the admin dashboard. Pure I/O - all aggregation lives in
 * the stats service so it can be unit-tested without a database. */
export interface DashboardRaw {
    views: { views: number }[];
    opps: { value: number; probability: number; stage: string; owner: string | null }[];
    recentSubs: { email: string; locale: string; created_at: string }[];
    recentContacts: { name: string; email: string; created_at: string }[];
    hot: { name: string; company: string | null; value: number; stage: string; service: string | null }[];
    tasks: { due_at: string | null }[];
    leadsTrend: { created_at: string }[];
    leadsValue: { value: number | null; status: string | null; owner: string | null }[];
    reps: { name: string }[];
}

/** Fetch every dataset the dashboard needs in one parallel batch. Returns null
 * when Supabase is not configured.
 *
 * The three unbounded reads (article_views, opportunities, leads) go through
 * selectAll: PostgREST clips a plain select at PGRST_DB_MAX_ROWS, so views and
 * lead/opportunity sums were computed from the first 1000 rows while the tile
 * beside them showed the true exact count. */
export async function fetchDashboardData(since14: string): Promise<DashboardRaw | null> {
    const supabase = tryAdminClient();
    if (!supabase) return null;

    const [views, opps, recentSubs, recentContacts, hot, tasks, leadsTrend, leadsValue, reps] =
        await Promise.all([
            selectAll<{ views: number }>(supabase.from("article_views").select("views")),
            selectAll<{ value: number; probability: number; stage: string; owner: unknown }>(
                supabase.from("opportunities").select("value, probability, stage, owner:owner_id(name)"),
            ),
            supabase
                .from("subscribers")
                .select("email, locale, created_at")
                .order("created_at", { ascending: false })
                .limit(5),
            supabase
                .from("leads")
                .select("name, email, created_at")
                .eq("source", "contact-form")
                .order("created_at", { ascending: false })
                .limit(5),
            supabase
                .from("opportunities")
                .select("name, company, value, stage, service")
                .not("stage", "in", "(won,lost)")
                .order("value", { ascending: false })
                .limit(5),
            supabase.from("activities").select("due_at").eq("status", "open"),
            supabase.from("leads").select("created_at").gte("created_at", since14),
            selectAll<{ value: number | null; status: string | null; owner: unknown }>(
                supabase.from("leads").select("value, status, owner:owner_id(name)"),
            ),
            supabase.from("sales_reps").select("name").eq("is_active", true),
        ]);

    const flattenOwner = <T extends { owner: unknown }>(rows: T[]): (Omit<T, "owner"> & { owner: string | null })[] =>
        rows.map(({ owner, ...rest }) => ({
            ...rest,
            owner: ((owner as { name: string } | null)?.name ?? null),
        }));

    return {
        views,
        opps: flattenOwner(opps) as DashboardRaw["opps"],
        recentSubs: (recentSubs.data ?? []) as DashboardRaw["recentSubs"],
        recentContacts: (recentContacts.data ?? []) as DashboardRaw["recentContacts"],
        hot: (hot.data ?? []) as DashboardRaw["hot"],
        tasks: (tasks.data ?? []) as DashboardRaw["tasks"],
        leadsTrend: (leadsTrend.data ?? []) as DashboardRaw["leadsTrend"],
        leadsValue: flattenOwner(leadsValue) as DashboardRaw["leadsValue"],
        reps: (reps.data ?? []) as DashboardRaw["reps"],
    };
}
