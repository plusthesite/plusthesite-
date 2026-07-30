import { getSupabaseAdmin } from "@/lib/supabase";
import { SERVICES, formatIDR } from "@/lib/services";

export const dynamic = "force-dynamic";

interface Lead {
    service: string | null;
    status: string | null;
    source: string | null;
    value: number | null;
    created_at: string;
}
interface Opp {
    name: string | null;
    service: string | null;
    stage: string;
    value: number;
    owner: string | null;
    source: string | null;
    created_at: string;
    updated_at: string | null;
}

export default async function ReportsPage() {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">Supabase not configured.</div>;
    }

    const [leadsRes, oppsRes] = await Promise.all([
        supabase.from("leads").select("service, status, source, value, created_at"),
        supabase.from("opportunities").select("name, service, stage, value, owner, source, created_at, updated_at"),
    ]);
    const leads = (leadsRes.data ?? []) as Lead[];
    const opps = (oppsRes.data ?? []) as Opp[];

    // ─── Service Performance ───
    const svcPerf = SERVICES.map((svc) => {
        const sLeads = leads.filter((l) => l.service === svc.slug);
        const sOpps = opps.filter((o) => o.service === svc.slug);
        const sOpen = sOpps.filter((o) => o.stage !== "won" && o.stage !== "lost");
        const sWon = sOpps.filter((o) => o.stage === "won");
        const sLost = sOpps.filter((o) => o.stage === "lost");
        const pipeline = sOpen.reduce((s, o) => s + (Number(o.value) || 0), 0);
        const won = sWon.reduce((s, o) => s + (Number(o.value) || 0), 0);
        const winRate = sWon.length + sLost.length > 0 ? Math.round((sWon.length / (sWon.length + sLost.length)) * 100) : 0;
        const convRate = sLeads.length > 0 ? Math.round((sLeads.filter((l) => l.status === "converted").length / sLeads.length) * 100) : 0;
        return { id: svc.slug, name: svc.en, leads: sLeads.length, opps: sOpps.length, pipeline, won, winRate, convRate };
    }).sort((a, b) => b.pipeline - a.pipeline);
    const maxPipeline = Math.max(...svcPerf.map((s) => s.pipeline), 1);

    // ─── Lead Source Analysis ───
    const sourceMap = new Map<string, { total: number; converted: number; value: number }>();
    for (const l of leads) {
        const src = l.source || "unknown";
        const cur = sourceMap.get(src) ?? { total: 0, converted: 0, value: 0 };
        cur.total++;
        if (l.status === "converted") cur.converted++;
        cur.value += Number(l.value) || 0;
        sourceMap.set(src, cur);
    }
    const sourcePerf = Array.from(sourceMap.entries())
        .map(([source, d]) => ({
            source,
            ...d,
            convRate: d.total > 0 ? Math.round((d.converted / d.total) * 100) : 0,
        }))
        .sort((a, b) => b.total - a.total);
    const maxSourceLeads = Math.max(...sourcePerf.map((s) => s.total), 1);

    // ─── Stale Deals (no update in 14+ days, not won/lost) ───
    const now = new Date().getTime();
    const staleDeals = opps
        .filter((o) => o.stage !== "won" && o.stage !== "lost")
        .map((o) => {
            const lastTouch = o.updated_at ? new Date(o.updated_at).getTime() : new Date(o.created_at).getTime();
            const daysStale = Math.floor((now - lastTouch) / 86_400_000);
            return { ...o, daysStale };
        })
        .filter((o) => o.daysStale >= 14)
        .sort((a, b) => b.daysStale - a.daysStale)
        .slice(0, 10);

    // ─── Monthly Trend (last 6 months) ───
    const months: { label: string; leads: number; opps: number; won: number }[] = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        const mLeads = leads.filter((l) => l.created_at?.startsWith(key)).length;
        const mOpps = opps.filter((o) => o.created_at?.startsWith(key)).length;
        const mWon = opps.filter((o) => o.stage === "won" && o.created_at?.startsWith(key)).length;
        months.push({ label, leads: mLeads, opps: mOpps, won: mWon });
    }
    const maxMonth = Math.max(...months.map((m) => m.leads), 1);

    const SOURCE_LABEL: Record<string, string> = {
        "google-places": "🗺️ Google Places",
        "contact-form": "📝 Contact Form",
        manual: "✍️ Manual",
        lead: "🔄 Converted",
        website: "🌐 Website",
        referral: "🤝 Referral",
        linkedin: "💼 LinkedIn",
        instagram: "📸 Instagram",
        blog: "📰 Blog",
        unknown: "❓ Unknown",
    };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales Reports</h1>
                    <p className="mt-1 text-sm text-slate-500">Service performance, lead sources, deal health, and monthly trends.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {leads.length.toLocaleString()} leads · {opps.length.toLocaleString()} deals
                </span>
            </div>

            {/* ─── Service Performance ─── */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">Performance by Service</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Service</th>
                                <th className="px-5 py-3 font-semibold text-right">Leads</th>
                                <th className="px-5 py-3 font-semibold text-right">Conv %</th>
                                <th className="px-5 py-3 font-semibold text-right">Deals</th>
                                <th className="px-5 py-3 font-semibold text-right">Win %</th>
                                <th className="px-5 py-3 font-semibold">Pipeline</th>
                                <th className="px-5 py-3 font-semibold text-right">Won</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {svcPerf.map((s) => (
                                <tr key={s.id} className="transition-colors hover:bg-slate-50">
                                    <td className="px-5 py-3 font-semibold text-slate-800">{s.name}</td>
                                    <td className="px-5 py-3 text-right text-slate-700">{s.leads}</td>
                                    <td className="px-5 py-3 text-right">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.convRate > 5 ? "bg-emerald-50 text-emerald-700" : s.convRate > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400"}`}>
                                            {s.convRate}%
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right text-slate-700">{s.opps}</td>
                                    <td className="px-5 py-3 text-right">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.winRate > 50 ? "bg-emerald-50 text-emerald-700" : s.winRate > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400"}`}>
                                            {s.winRate}%
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-24 rounded-full bg-slate-100 overflow-hidden">
                                                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" style={{ width: `${Math.max((s.pipeline / maxPipeline) * 100, 2)}%` }} />
                                            </div>
                                            <span className="text-xs font-semibold text-indigo-600">{formatIDR(s.pipeline, true)}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">{formatIDR(s.won, true)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {/* ─── Lead Source ─── */}
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Lead Source Analysis</h2>
                    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="space-y-3">
                            {sourcePerf.map((s) => (
                                <div key={s.source} className="flex items-center gap-3">
                                    <span className="w-36 shrink-0 truncate text-xs font-medium text-slate-700">
                                        {SOURCE_LABEL[s.source] ?? s.source}
                                    </span>
                                    <div className="flex-1">
                                        <div className="h-5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500" style={{ width: `${Math.max((s.total / maxSourceLeads) * 100, 3)}%` }} />
                                        </div>
                                    </div>
                                    <div className="w-20 shrink-0 text-right">
                                        <span className="text-xs font-bold text-slate-800">{s.total}</span>
                                        {s.convRate > 0 && <span className="ml-1 text-[10px] text-emerald-600">({s.convRate}%)</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── Monthly Trend ─── */}
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Monthly Trend (6 mo)</h2>
                    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex h-40 items-end gap-2">
                            {months.map((m, i) => (
                                <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-1">
                                    <span className="text-[9px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{m.leads}</span>
                                    <div className="w-full rounded-t bg-blue-500/80 transition-all group-hover:bg-blue-600" style={{ height: `${Math.max(4, (m.leads / maxMonth) * 100)}%` }} />
                                    <span className="text-[10px] text-slate-400">{m.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-400">
                            <span>■ New leads/month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Stale Deals ─── */}
            {staleDeals.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">⚠️ Stale Deals (no update in 14+ days)</h2>
                    <div className="mt-3 overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-amber-50 text-xs uppercase tracking-wide text-amber-600">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Deal</th>
                                    <th className="px-5 py-3 font-semibold">Stage</th>
                                    <th className="px-5 py-3 font-semibold text-right">Value</th>
                                    <th className="px-5 py-3 font-semibold">Owner</th>
                                    <th className="px-5 py-3 font-semibold text-right">Days Stale</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                                {staleDeals.map((d, i) => (
                                    <tr key={i} className="transition-colors hover:bg-amber-50/50">
                                        <td className="px-5 py-3 font-semibold text-slate-800">{d.name ?? d.service ?? "Deal"}</td>
                                        <td className="px-5 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-600">{d.stage}</span></td>
                                        <td className="px-5 py-3 text-right font-semibold text-slate-700">{formatIDR(d.value, true)}</td>
                                        <td className="px-5 py-3 text-slate-600">{d.owner ?? "—"}</td>
                                        <td className="px-5 py-3 text-right">
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${d.daysStale > 30 ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                                                {d.daysStale}d
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
