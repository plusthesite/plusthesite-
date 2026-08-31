import { tryAdminClient } from "@/server/repositories/client";

/** Exact row count for a table; 0 when Supabase is not configured. */
export async function tableCount(table: string): Promise<number> {
    const supabase = tryAdminClient();
    if (!supabase) return 0;
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
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
 * when Supabase is not configured. */
export async function fetchDashboardData(since14: string): Promise<DashboardRaw | null> {
    const supabase = tryAdminClient();
    if (!supabase) return null;

    const [viewsRes, oppsRes, recentSubsRes, recentContactsRes, hotRes, tasksRes, leadsTrendRes, leadsValueRes, repsRes] =
        await Promise.all([
            supabase.from("article_views").select("views"),
            supabase.from("opportunities").select("value, probability, stage, owner"),
            supabase.from("subscribers").select("email, locale, created_at").order("created_at", { ascending: false }).limit(5),
            supabase.from("contacts").select("name, email, created_at").order("created_at", { ascending: false }).limit(5),
            supabase.from("opportunities").select("name, company, value, stage, service").not("stage", "in", "(won,lost)").order("value", { ascending: false }).limit(5),
            supabase.from("activities").select("due_at").eq("status", "open"),
            supabase.from("leads").select("created_at").gte("created_at", since14),
            supabase.from("leads").select("value, status, owner"),
            supabase.from("sales_reps").select("name").eq("is_active", true),
        ]);

    return {
        views: (viewsRes.data ?? []) as DashboardRaw["views"],
        opps: (oppsRes.data ?? []) as DashboardRaw["opps"],
        recentSubs: (recentSubsRes.data ?? []) as DashboardRaw["recentSubs"],
        recentContacts: (recentContactsRes.data ?? []) as DashboardRaw["recentContacts"],
        hot: (hotRes.data ?? []) as DashboardRaw["hot"],
        tasks: (tasksRes.data ?? []) as DashboardRaw["tasks"],
        leadsTrend: (leadsTrendRes.data ?? []) as DashboardRaw["leadsTrend"],
        leadsValue: (leadsValueRes.data ?? []) as DashboardRaw["leadsValue"],
        reps: (repsRes.data ?? []) as DashboardRaw["reps"],
    };
}
