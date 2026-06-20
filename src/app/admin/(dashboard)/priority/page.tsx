import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SERVICES, serviceName, formatIDR } from "@/lib/services";
import { scoreLead, scoreTier } from "@/lib/leadScore";

export const dynamic = "force-dynamic";

interface Lead {
    id: string; name: string | null; company: string | null; phone: string | null; email: string | null;
    website: string | null; service: string | null; status: string | null; value: number | null;
    source: string | null; owner: string | null; created_at: string;
}

function waLink(phone: string | null) {
    if (!phone) return null;
    const d = phone.replace(/[^\d]/g, "");
    return d ? `https://wa.me/${d}` : null;
}

export default async function PriorityPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
    const { service: filter } = await searchParams;
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
            .from("leads")
            .select("id, name, company, phone, email, website, service, status, value, source, owner, created_at")
            .neq("status", "converted")
            .order("value", { ascending: false })
            .limit(1000)
        : { data: [] };

    const scored = ((data ?? []) as Lead[])
        .map((l) => ({ lead: l, ...scoreLead(l) }))
        .sort((a, b) => b.score - a.score);

    const counts = SERVICES.map((s) => ({ s, n: scored.filter((x) => x.lead.service === s.slug).length })).filter((x) => x.n > 0);
    const visible = filter ? scored.filter((x) => x.lead.service === filter) : scored;
    const hot = scored.filter((x) => x.score >= 70).length;
    const warm = scored.filter((x) => x.score >= 45 && x.score < 70).length;
    const top = visible.slice(0, 100);

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Priority Leads</h1>
                    <p className="mt-1 text-sm text-slate-500">Auto-scored by value, reachability, stage & recency — work the hottest first.</p>
                </div>
                <div className="flex gap-2">
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">{hot} hot</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">{warm} warm</span>
                </div>
            </div>

            {/* Service filter */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link href="/admin/priority" className={`rounded-full px-3 py-1.5 text-xs font-semibold ${!filter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>All ({scored.length})</Link>
                {counts.map(({ s, n }) => (
                    <Link key={s.slug} href={`/admin/priority?service=${s.slug}`} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === s.slug ? "bg-slate-900 text-white" : `${s.chip} hover:opacity-80`}`}>
                        {s.en} · {n}
                    </Link>
                ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-semibold">#</th>
                            <th className="px-4 py-3 font-semibold">Lead</th>
                            <th className="px-4 py-3 font-semibold">Service</th>
                            <th className="px-4 py-3 font-semibold">Value</th>
                            <th className="px-4 py-3 font-semibold">Score</th>
                            <th className="px-4 py-3 font-semibold">Why</th>
                            <th className="px-4 py-3 font-semibold">Reach out</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {top.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No leads.</td></tr>}
                        {top.map(({ lead: l, score, reasons }, i) => {
                            const tier = scoreTier(score);
                            const wa = waLink(l.phone);
                            return (
                                <tr key={l.id} className="align-top hover:bg-slate-50">
                                    <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/leads/${l.id}`} className="font-semibold text-slate-800 hover:text-blue-600">{l.company || l.name || l.email || "Lead"}</Link>
                                        <p className="text-xs text-slate-400">{l.name && l.company ? l.name : ""}</p>
                                    </td>
                                    <td className="px-4 py-3"><span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{serviceName(l.service)}</span></td>
                                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-700">{formatIDR(l.value ?? 0, true)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">{score}</span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tier.color}`}>{tier.label}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs text-slate-400">{reasons.slice(0, 3).join(" · ")}</span></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800">WA</a>}
                                            {l.phone && <a href={`tel:${l.phone}`} className="text-slate-500 hover:text-slate-700">Call</a>}
                                            {l.email && <a href={`mailto:${l.email}`} className="text-blue-600 hover:text-blue-800">Email</a>}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}
