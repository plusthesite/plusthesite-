import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SERVICES, serviceName, getService, formatIDR } from "@/lib/services";
import { updateOpportunityStage, deleteOpportunity, bulkUpdateOpportunities } from "./actions";
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

/** A warm follow-up opener so reaching out on a live deal is one click. */
function opener(o: Opp) {
    const first = o.contact_name?.trim().split(/\s+/)[0];
    const svc = serviceName(o.service).toLowerCase();
    return `Halo ${first || "Kak"}, saya dari plus. (plusthe.site) menindaklanjuti soal ${svc}${o.company ? ` untuk ${o.company}` : ""}. Boleh kita lanjut ngobrol singkat?`;
}

function waLink(o: Opp) {
    if (!o.phone) return null;
    const digits = o.phone.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(opener(o))}` : null;
}

function mailtoLink(o: Opp) {
    if (!o.email) return null;
    return `mailto:${o.email}?subject=${encodeURIComponent("Tindak lanjut — plus.")}&body=${encodeURIComponent(opener(o))}`;
}

function fmtDate(d: string | null) {
    return d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";
}

function daysUntil(d: string | null) {
    if (!d) return null;
    const diff = Math.round((new Date(d).getTime() - Date.now()) / 86_400_000);
    if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: "text-rose-600" };
    if (diff <= 7) return { label: `${diff}d left`, color: "text-amber-600" };
    return { label: `${diff}d`, color: "text-slate-400" };
}

export default async function OpportunitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ service?: string; owner?: string }>;
}) {
    const { service: filter, owner: ownerFilter } = await searchParams;
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
    const lostCount = all.filter((o) => o.stage === "lost").length;

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

    // Owner counts for the "focus on my deals" filter.
    const ownerCounts = new Map<string, number>();
    for (const o of all) {
        const ow = o.owner?.trim() || "__unassigned__";
        ownerCounts.set(ow, (ownerCounts.get(ow) ?? 0) + 1);
    }

    let visible = filter ? all.filter((o) => o.service === filter) : all;
    if (ownerFilter) visible = visible.filter((o) => ownerFilter === "__unassigned__" ? !o.owner : o.owner === ownerFilter);

    // Overdue follow-up nudge — open deals whose next action date has passed.
    const now = new Date().getTime();
    const overdue = visible.filter((o) => o.stage !== "won" && o.stage !== "lost" && o.next_action_at && new Date(o.next_action_at).getTime() < now).length;

    // Owner filter chips preserve the active service filter.
    const ownerBase = new URLSearchParams();
    if (filter) ownerBase.set("service", filter);
    const ownerHref = (ow: string) => { const p = new URLSearchParams(ownerBase); if (ow) p.set("owner", ow); const q = p.toString(); return `/admin/opportunities${q ? `?${q}` : ""}`; };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
                    <p className="mt-1 text-sm text-slate-500">Sales pipeline segmented by service — reach out directly to close deals.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/opportunities/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ New</Link>
                    <Link href="/admin/opportunities/board" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" /></svg>
                        Board view
                    </Link>
                </div>
            </div>

            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Supabase isn&apos;t configured. Run <code className="font-mono">supabase/crm.sql</code> then <code className="font-mono">supabase/seed_crm.sql</code>.
                </div>
            )}

            {/* Revenue summary */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Open Pipeline</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatIDR(totalPipeline, true)}</p>
                    <p className="mt-1 text-xs text-slate-400">{open.length} active deals</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Weighted Forecast</p>
                    <p className="mt-2 text-2xl font-extrabold text-blue-600">{formatIDR(weighted, true)}</p>
                    <p className="mt-1 text-xs text-slate-400">probability-adjusted</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Won Revenue</p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600">{formatIDR(wonValue, true)}</p>
                    <p className="mt-1 text-xs text-slate-400">{all.filter((o) => o.stage === "won").length} closed-won</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Win Rate</p>
                    <p className="mt-2 text-2xl font-extrabold text-violet-600">
                        {all.filter((o) => o.stage === "won" || o.stage === "lost").length > 0
                            ? `${Math.round((all.filter((o) => o.stage === "won").length / all.filter((o) => o.stage === "won" || o.stage === "lost").length) * 100)}%`
                            : "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{lostCount} lost</p>
                </div>
            </div>

            {/* Per-service filter chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link
                    href="/admin/opportunities"
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${!filter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    All ({all.length})
                </Link>
                {byService.map(({ svc, count, openValue }) => (
                    <Link
                        key={svc.slug}
                        href={`/admin/opportunities?service=${svc.slug}`}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${filter === svc.slug ? "bg-slate-900 text-white" : `${svc.chip} hover:opacity-80`}`}
                    >
                        {svc.en} · {count} · {formatIDR(openValue, true)}
                    </Link>
                ))}
            </div>

            {/* Owner filter + overdue nudge */}
            {(ownerCounts.size > 1 || overdue > 0) && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    {ownerCounts.size > 1 ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400">Owner:</span>
                            <Link href={ownerHref("")} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${!ownerFilter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>All</Link>
                            {[...ownerCounts.entries()].sort((a, b) => b[1] - a[1]).map(([ow, count]) => (
                                <Link key={ow} href={ownerHref(ow)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${ownerFilter === ow ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                                    {ow === "__unassigned__" ? "Unassigned" : ow} · {count}
                                </Link>
                            ))}
                        </div>
                    ) : <span />}
                    {overdue > 0 && <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700" title="Open deals whose next-action date has passed">⏰ {overdue} overdue follow-up{overdue > 1 ? "s" : ""}</span>}
                </div>
            )}

            {/* Bulk actions */}
            <form id="bulk-opps" action={bulkUpdateOpportunities} className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-semibold text-slate-500">Bulk:</span>
                <select name="bulk_action" defaultValue="" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
                    <option value="">Choose action…</option>
                    <optgroup label="Set stage">
                        <option value="stage:new">→ New</option>
                        <option value="stage:contacted">→ Contacted</option>
                        <option value="stage:qualified">→ Qualified</option>
                        <option value="stage:proposal">→ Proposal</option>
                        <option value="stage:negotiation">→ Negotiation</option>
                        <option value="stage:won">→ Won</option>
                        <option value="stage:lost">→ Lost</option>
                    </optgroup>
                    <option value="owner">Assign owner</option>
                    <option value="delete">Delete</option>
                </select>
                <input name="bulk_owner" placeholder="Owner (for assign)" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs" />
                <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">Apply to selected</button>
                <span className="text-xs text-slate-400">Tick rows, choose an action, then Apply.</span>
            </form>

            {/* Pipeline table */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-4 py-3 w-8" />
                                <th className="px-4 py-3 font-semibold">Deal / Contact</th>
                                <th className="px-4 py-3 font-semibold">Service</th>
                                <th className="px-4 py-3 font-semibold">Value</th>
                                <th className="px-4 py-3 font-semibold">Stage</th>
                                <th className="px-4 py-3 font-semibold">Owner</th>
                                <th className="px-4 py-3 font-semibold">Next action</th>
                                <th className="px-4 py-3 font-semibold">Close date</th>
                                <th className="px-4 py-3 font-semibold">Reach out</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visible.length === 0 && (
                                <tr><td colSpan={10} className="px-4 py-12 text-center">
                                    <div className="mx-auto max-w-xs">
                                        <svg className="mx-auto h-10 w-10 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 17V9m4 8V5m4 12v-6" /></svg>
                                        <p className="mt-2 text-sm font-medium text-slate-400">No opportunities yet</p>
                                        <p className="mt-1 text-xs text-slate-300">Convert leads or create deals to build your pipeline.</p>
                                    </div>
                                </td></tr>
                            )}
                            {visible.map((o) => {
                                const wa = waLink(o);
                                const mail = mailtoLink(o);
                                const svc = getService(o.service);
                                const close = daysUntil(o.expected_close);
                                return (
                                    <tr key={o.id} className="align-top transition-colors hover:bg-slate-50/80">
                                        <td className="px-4 py-3"><input type="checkbox" name="ids" value={o.id} form="bulk-opps" className="h-4 w-4 rounded border-slate-300" /></td>
                                        <td className="px-4 py-3">
                                            <Link href={`/admin/opportunities/${o.id}`} className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">{o.name}</Link>
                                            <p className="text-xs text-slate-500">{o.contact_name}{o.company ? ` · ${o.company}` : ""}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${svc?.chip ?? "bg-slate-100 text-slate-600"}`}>{serviceName(o.service)}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-800">{formatIDR(o.value ?? 0, true)}</td>
                                        <td className="px-4 py-3"><StageSelect id={o.id} stage={o.stage} action={updateOpportunityStage} /></td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{o.owner ?? "—"}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-slate-700">{o.next_action ?? "—"}</p>
                                            <p className="text-xs text-slate-400">{fmtDate(o.next_action_at)}</p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <p className="text-xs text-slate-700">{fmtDate(o.expected_close)}</p>
                                            {close && <p className={`text-[10px] font-semibold ${close.color}`}>{close.label}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs font-semibold">
                                                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 hover:bg-emerald-100 transition-colors" title="WhatsApp with a ready follow-up">WA</a>}
                                                {o.phone && <a href={`tel:${o.phone}`} className="text-slate-500 hover:text-slate-700 transition-colors">Call</a>}
                                                {mail && <a href={mail} className="text-blue-600 hover:text-blue-800 transition-colors" title="Email with a ready follow-up">Email</a>}
                                                {!wa && !o.phone && !mail && <span className="text-slate-300">no contact</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <form action={deleteOpportunity}>
                                                <input type="hidden" name="id" value={o.id} />
                                                <button className="text-xs font-semibold text-rose-400 hover:text-rose-600 transition-colors">Delete</button>
                                            </form>
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
