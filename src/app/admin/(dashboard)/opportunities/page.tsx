import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SERVICES, serviceName, formatIDR } from "@/lib/services";
import { updateOpportunityStage, deleteOpportunity } from "./actions";
import { StageSelect } from "./StageSelect";

export const dynamic = "force-dynamic";

interface Opp {
    id: string;
    name: string;
    company: string | null;
    contact_name: string | null;
    email: string | null;
    phone: string | null;
    value: number | null;
    stage: string;
    probability: number | null;
    source: string | null;
    service: string | null;
    owner: string | null;
    next_action: string | null;
    next_action_at: string | null;
    expected_close: string | null;
}

function waLink(phone: string | null) {
    if (!phone) return null;
    const digits = phone.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}` : null;
}

function fmtDate(d: string | null) {
    return d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";
}

export default async function OpportunitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ service?: string }>;
}) {
    const { service: filter } = await searchParams;
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
            .from("opportunities")
            .select("id, name, company, contact_name, email, phone, value, stage, probability, source, service, owner, next_action, next_action_at, expected_close")
            .order("value", { ascending: false })
        : { data: [] };
    const all = (data ?? []) as Opp[];

    const open = all.filter((o) => o.stage !== "won" && o.stage !== "lost");
    const totalPipeline = open.reduce((s, o) => s + (o.value ?? 0), 0);
    const weighted = open.reduce((s, o) => s + (o.value ?? 0) * ((o.probability ?? 0) / 100), 0);
    const wonValue = all.filter((o) => o.stage === "won").reduce((s, o) => s + (o.value ?? 0), 0);

    // Per-service breakdown (open pipeline value) — drives the sales focus.
    const byService = SERVICES.map((svc) => {
        const rows = all.filter((o) => o.service === svc.slug);
        const openRows = rows.filter((o) => o.stage !== "won" && o.stage !== "lost");
        return {
            svc,
            count: rows.length,
            openValue: openRows.reduce((s, o) => s + (o.value ?? 0), 0),
        };
    }).filter((s) => s.count > 0);

    const visible = filter ? all.filter((o) => o.service === filter) : all;

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
                    <p className="mt-1 text-sm text-slate-500">Sales pipeline, segmented by service line — reach out directly.</p>
                </div>
            </div>

            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Supabase isn&apos;t configured. Run <code className="font-mono">supabase/crm.sql</code> then <code className="font-mono">supabase/seed_crm.sql</code>.
                </div>
            )}

            {/* Revenue summary */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Open Pipeline</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatIDR(totalPipeline, true)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Weighted Forecast</p>
                    <p className="mt-2 text-2xl font-extrabold text-blue-600">{formatIDR(weighted, true)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Won (closed)</p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600">{formatIDR(wonValue, true)}</p>
                </div>
            </div>

            {/* Per-service filter chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link
                    href="/admin/opportunities"
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${!filter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    All ({all.length})
                </Link>
                {byService.map(({ svc, count, openValue }) => (
                    <Link
                        key={svc.slug}
                        href={`/admin/opportunities?service=${svc.slug}`}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === svc.slug ? "bg-slate-900 text-white" : `${svc.chip} hover:opacity-80`}`}
                    >
                        {svc.en} · {count} · {formatIDR(openValue, true)}
                    </Link>
                ))}
            </div>

            {/* Pipeline table */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Deal / Contact</th>
                            <th className="px-4 py-3 font-semibold">Service</th>
                            <th className="px-4 py-3 font-semibold">Value</th>
                            <th className="px-4 py-3 font-semibold">Stage</th>
                            <th className="px-4 py-3 font-semibold">Owner</th>
                            <th className="px-4 py-3 font-semibold">Next action</th>
                            <th className="px-4 py-3 font-semibold">Reach out</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {visible.length === 0 && (
                            <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No opportunities.</td></tr>
                        )}
                        {visible.map((o) => {
                            const wa = waLink(o.phone);
                            return (
                                <tr key={o.id} className="align-top hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/opportunities/${o.id}`} className="font-semibold text-slate-800 hover:text-blue-600">{o.name}</Link>
                                        <p className="text-xs text-slate-500">{o.contact_name}{o.company ? ` · ${o.company}` : ""}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{serviceName(o.service)}</span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-800">{formatIDR(o.value ?? 0, true)}</td>
                                    <td className="px-4 py-3"><StageSelect id={o.id} stage={o.stage} action={updateOpportunityStage} /></td>
                                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{o.owner ?? "—"}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs text-slate-700">{o.next_action ?? "—"}</p>
                                        <p className="text-xs text-slate-400">{fmtDate(o.next_action_at)}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800">WA</a>}
                                            {o.phone && <a href={`tel:${o.phone}`} className="text-slate-500 hover:text-slate-700">Call</a>}
                                            {o.email && <a href={`mailto:${o.email}`} className="text-blue-600 hover:text-blue-800">Email</a>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <form action={deleteOpportunity}>
                                            <input type="hidden" name="id" value={o.id} />
                                            <button className="text-xs font-semibold text-rose-400 hover:text-rose-600">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
