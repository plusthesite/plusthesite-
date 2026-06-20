import { getSupabaseAdmin } from "@/lib/supabase";

export interface DashboardStats {
    configured: boolean;
    subscribers: number;
    leads: number;
    contacts: number;
    conversations: number;
    opportunities: number;
    views: number;
    openPipeline: number;
    weightedPipeline: number;
    wonValue: number;
    leadPipeline: number;
    conversionRate: number;
    winRate: number;
    openTasks: number;
    overdueTasks: number;
    newLeads14d: { label: string; count: number }[];
    stageBreakdown: { stage: string; count: number; value: number }[];
    recentSubs: { email: string; locale: string; created_at: string }[];
    recentContacts: { name: string; email: string; created_at: string }[];
    hotOpportunities: { name: string; company: string | null; value: number; stage: string; service: string | null }[];
    repLeaderboard: { name: string; leads: number; pipeline: number; deals: number }[];
    updatedAt: string;
}

async function count(table: string): Promise<number> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return 0;
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    return count ?? 0;
}

/** Live snapshot for the admin dashboard. Tolerates not-yet-created tables. */
export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = getSupabaseAdmin();
    const empty: DashboardStats = {
        configured: false,
        subscribers: 0, leads: 0, contacts: 0, conversations: 0, opportunities: 0,
        views: 0, openPipeline: 0, weightedPipeline: 0, wonValue: 0,
        leadPipeline: 0, conversionRate: 0, winRate: 0,
        openTasks: 0, overdueTasks: 0,
        newLeads14d: [], stageBreakdown: [],
        recentSubs: [], recentContacts: [], hotOpportunities: [],
        repLeaderboard: [],
        updatedAt: new Date().toISOString(),
    };
    if (!supabase) return empty;

    const [subscribers, leads, contacts, conversations, opportunities] = await Promise.all([
        count("subscribers"), count("leads"), count("contacts"), count("chat_messages"), count("opportunities"),
    ]);

    const since14 = new Date(Date.now() - 13 * 86_400_000).toISOString().slice(0, 10);
    const [viewsRes, oppsRes, recentSubsRes, recentContactsRes, hotRes, tasksRes, leadsTrendRes, leadsValueRes, repsRes] = await Promise.all([
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

    const nowTs = Date.now();

    // New leads per day over the last 14 days (oldest → newest).
    const leadBuckets = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
        const key = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
        leadBuckets.set(key, 0);
    }
    for (const r of (leadsTrendRes.data ?? []) as { created_at: string }[]) {
        const key = r.created_at.slice(0, 10);
        if (leadBuckets.has(key)) leadBuckets.set(key, (leadBuckets.get(key) ?? 0) + 1);
    }
    const newLeads14d = Array.from(leadBuckets.entries()).map(([key, count]) => ({
        label: `${Number(key.slice(8, 10))}/${Number(key.slice(5, 7))}`,
        count,
    }));
    const openTaskRows = (tasksRes.data ?? []) as { due_at: string | null }[];
    const openTasks = openTaskRows.length;
    const overdueTasks = openTaskRows.filter((t) => t.due_at && new Date(t.due_at).getTime() < nowTs).length;

    const views = (viewsRes.data ?? []).reduce((s, r: { views: number }) => s + (Number(r.views) || 0), 0);
    const opps = (oppsRes.data ?? []) as { value: number; probability: number; stage: string; owner: string | null }[];
    const open = opps.filter((o) => o.stage !== "won" && o.stage !== "lost");
    const openPipeline = open.reduce((s, o) => s + (Number(o.value) || 0), 0);
    const weightedPipeline = open.reduce((s, o) => s + (Number(o.value) || 0) * ((Number(o.probability) || 0) / 100), 0);
    const wonValue = opps.filter((o) => o.stage === "won").reduce((s, o) => s + (Number(o.value) || 0), 0);

    // Lead pipeline + conversion rate
    const allLeads = (leadsValueRes.data ?? []) as { value: number | null; status: string | null; owner: string | null }[];
    const leadPipeline = allLeads.reduce((s, l) => s + (Number(l.value) || 0), 0);
    const convertedLeads = allLeads.filter((l) => l.status === "converted").length;
    const conversionRate = allLeads.length > 0 ? Math.round((convertedLeads / allLeads.length) * 100) : 0;

    // Win rate (won / closed)
    const closedOpps = opps.filter((o) => o.stage === "won" || o.stage === "lost");
    const wonOpps = closedOpps.filter((o) => o.stage === "won");
    const winRate = closedOpps.length > 0 ? Math.round((wonOpps.length / closedOpps.length) * 100) : 0;

    // Rep leaderboard
    const repNames = ((repsRes.data ?? []) as { name: string }[]).map((r) => r.name);
    const repLeaderboard = repNames.map((name) => {
        const rLeads = allLeads.filter((l) => l.owner === name).length;
        const rOpps = opps.filter((o) => o.owner === name && o.stage !== "won" && o.stage !== "lost");
        const rPipeline = rOpps.reduce((s, o) => s + (Number(o.value) || 0), 0);
        return { name, leads: rLeads, pipeline: rPipeline, deals: rOpps.length };
    }).sort((a, b) => b.pipeline - a.pipeline);

    const STAGE_ORDER = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];
    const stageBreakdown = STAGE_ORDER.map((stage) => {
        const rows = opps.filter((o) => o.stage === stage);
        return { stage, count: rows.length, value: rows.reduce((s, o) => s + (Number(o.value) || 0), 0) };
    }).filter((s) => s.count > 0);

    return {
        configured: true,
        subscribers, leads, contacts, conversations, opportunities,
        views, openPipeline, weightedPipeline, wonValue,
        leadPipeline, conversionRate, winRate,
        openTasks, overdueTasks,
        newLeads14d, stageBreakdown,
        recentSubs: (recentSubsRes.data ?? []) as DashboardStats["recentSubs"],
        recentContacts: (recentContactsRes.data ?? []) as DashboardStats["recentContacts"],
        hotOpportunities: (hotRes.data ?? []) as DashboardStats["hotOpportunities"],
        repLeaderboard,
        updatedAt: new Date().toISOString(),
    };
}
