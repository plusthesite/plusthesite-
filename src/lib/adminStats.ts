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
    recentSubs: { email: string; locale: string; created_at: string }[];
    recentContacts: { name: string; email: string; created_at: string }[];
    hotOpportunities: { name: string; company: string | null; value: number; stage: string; service: string | null }[];
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
        recentSubs: [], recentContacts: [], hotOpportunities: [],
        updatedAt: new Date().toISOString(),
    };
    if (!supabase) return empty;

    const [subscribers, leads, contacts, conversations, opportunities] = await Promise.all([
        count("subscribers"), count("leads"), count("contacts"), count("chat_messages"), count("opportunities"),
    ]);

    const [viewsRes, oppsRes, recentSubsRes, recentContactsRes, hotRes] = await Promise.all([
        supabase.from("article_views").select("views"),
        supabase.from("opportunities").select("value, probability, stage"),
        supabase.from("subscribers").select("email, locale, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("contacts").select("name, email, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("opportunities").select("name, company, value, stage, service").not("stage", "in", "(won,lost)").order("value", { ascending: false }).limit(5),
    ]);

    const views = (viewsRes.data ?? []).reduce((s, r: { views: number }) => s + (Number(r.views) || 0), 0);
    const opps = (oppsRes.data ?? []) as { value: number; probability: number; stage: string }[];
    const open = opps.filter((o) => o.stage !== "won" && o.stage !== "lost");
    const openPipeline = open.reduce((s, o) => s + (Number(o.value) || 0), 0);
    const weightedPipeline = open.reduce((s, o) => s + (Number(o.value) || 0) * ((Number(o.probability) || 0) / 100), 0);
    const wonValue = opps.filter((o) => o.stage === "won").reduce((s, o) => s + (Number(o.value) || 0), 0);

    return {
        configured: true,
        subscribers, leads, contacts, conversations, opportunities,
        views, openPipeline, weightedPipeline, wonValue,
        recentSubs: (recentSubsRes.data ?? []) as DashboardStats["recentSubs"],
        recentContacts: (recentContactsRes.data ?? []) as DashboardStats["recentContacts"],
        hotOpportunities: (hotRes.data ?? []) as DashboardStats["hotOpportunities"],
        updatedAt: new Date().toISOString(),
    };
}
