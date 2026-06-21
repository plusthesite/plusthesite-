import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SERVICES, serviceName, getService, formatIDR } from "@/lib/services";
import { scoreLead, scoreTier } from "@/lib/leadScore";
import { deleteRow } from "../actions";
import { convertLeadToOpportunity } from "../opportunities/actions";
import { bulkUpdateLeads, quickUpdateLead } from "./actions";

export const dynamic = "force-dynamic";

interface Lead {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    service: string | null;
    status: string | null;
    value: number | null;
    owner: string | null;
    next_action: string | null;
    message: string | null;
    source: string | null;
    locale: string | null;
    created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
    new: "bg-slate-100 text-slate-600",
    contacted: "bg-blue-50 text-blue-700",
    qualified: "bg-indigo-50 text-indigo-700",
    unqualified: "bg-rose-50 text-rose-700",
    converted: "bg-emerald-50 text-emerald-700",
};

const SOURCE_ICON: Record<string, string> = {
    website: "🌐",
    instagram: "📷",
    linkedin: "💼",
    referral: "🤝",
    blog: "📝",
    "contact-form": "📋",
    chatbot: "🤖",
    event: "🎪",
};

/** A warm, low-pressure bilingual opener so reach-out is one click. */
function opener(l: Lead) {
    const first = l.name?.trim().split(/\s+/)[0];
    const svc = serviceName(l.service).toLowerCase();
    if (l.locale === "en") {
        return `Hi ${first || "there"}, this is plus. (plusthe.site). We help businesses with ${svc} — saw ${l.company || "your business"} and thought we could help. Open to a quick chat?`;
    }
    return `Halo ${first || "Kak"}, saya dari plus. (plusthe.site). Kami bantu bisnis untuk ${svc}. Kebetulan lihat ${l.company || "usaha Anda"} — boleh ngobrol singkat?`;
}

function waLink(l: Lead) {
    if (!l.phone) return null;
    const digits = l.phone.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(opener(l))}` : null;
}

function mailtoLink(l: Lead) {
    if (!l.email) return null;
    const subject = l.locale === "en" ? "Quick hello from plus." : "Halo dari plus.";
    return `mailto:${l.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(opener(l))}`;
}

function fmt(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgo(d: string) {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
}

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ service?: string; status?: string; sort?: string; page?: string; owner?: string }>;
}) {
    const { service: filter, status: statusFilter, sort, page, owner: ownerFilter } = await searchParams;
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
            .from("leads")
            .select("id, name, email, phone, company, service, status, value, owner, next_action, message, source, locale, created_at")
            .order("created_at", { ascending: false })
        : { data: [] };
    const all = (data ?? []) as Lead[];

    // Fetch active sales reps for the assign dropdown
    const { data: repsData } = supabase
        ? await supabase.from("sales_reps").select("name").eq("is_active", true).order("name")
        : { data: [] };
    const reps = (repsData ?? []) as { name: string }[];

    // Per-service counts
    const serviceCounts = SERVICES.map((svc) => ({
        svc,
        count: all.filter((l) => l.service === svc.slug).length,
    })).filter((s) => s.count > 0);

    // Per-status counts
    const statusCounts = new Map<string, number>();
    for (const l of all) {
        const s = l.status ?? "new";
        statusCounts.set(s, (statusCounts.get(s) ?? 0) + 1);
    }

    // Total pipeline value
    const totalValue = all.reduce((s, l) => s + (l.value ?? 0), 0);
    const newCount = all.filter((l) => (l.status ?? "new") === "new").length;
    const convertedCount = all.filter((l) => l.status === "converted").length;

    // Owner counts (for the "focus on my leads" filter).
    const ownerCounts = new Map<string, number>();
    for (const l of all) {
        const o = l.owner?.trim() || "__unassigned__";
        ownerCounts.set(o, (ownerCounts.get(o) ?? 0) + 1);
    }

    let rows = filter ? all.filter((l) => l.service === filter) : all;
    if (statusFilter) rows = rows.filter((l) => (l.status ?? "new") === statusFilter);
    if (ownerFilter) rows = rows.filter((l) => ownerFilter === "__unassigned__" ? !l.owner : l.owner === ownerFilter);

    // Sort: hottest score, biggest value, or newest (default).
    if (sort === "hot") rows = [...rows].sort((a, b) => scoreLead(b).score - scoreLead(a).score);
    else if (sort === "value") rows = [...rows].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    // Follow-up discipline: open leads with no next step set.
    const needsStep = rows.filter((l) => !l.next_action && l.status !== "converted" && l.status !== "unqualified").length;

    // Preserve active filters when switching sort.
    const sortBase = new URLSearchParams();
    if (filter) sortBase.set("service", filter);
    if (statusFilter) sortBase.set("status", statusFilter);
    if (ownerFilter) sortBase.set("owner", ownerFilter);
    // Owner filter chips preserve the current service/status filters.
    const ownerBase = new URLSearchParams();
    if (filter) ownerBase.set("service", filter);
    if (statusFilter) ownerBase.set("status", statusFilter);
    const ownerHref = (o: string) => { const p = new URLSearchParams(ownerBase); if (o) p.set("owner", o); const q = p.toString(); return `/admin/leads${q ? `?${q}` : ""}`; };
    const sortHref = (s: string) => { const p = new URLSearchParams(sortBase); if (s) p.set("sort", s); const q = p.toString(); return `/admin/leads${q ? `?${q}` : ""}`; };
    const SORTS: { key: string; label: string }[] = [{ key: "", label: "Newest" }, { key: "hot", label: "🔥 Hottest" }, { key: "value", label: "Highest value" }];

    // Pagination — render a page at a time instead of all ~1.5k rows.
    const PAGE_SIZE = 50;
    const totalRows = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const from = totalRows === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const to = Math.min(safePage * PAGE_SIZE, totalRows);
    const pageHref = (p: number) => { const q = new URLSearchParams(sortBase); if (sort) q.set("sort", sort); if (p > 1) q.set("page", String(p)); const s = q.toString(); return `/admin/leads${s ? `?${s}` : ""}`; };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
                    <p className="mt-1 text-sm text-slate-500">Inbound prospects by service — qualify and convert to pipeline.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{newCount} new</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{convertedCount} converted</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{all.length} total</span>
                    <Link href="/admin/leads/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ New Lead</Link>
                </div>
            </div>

            {/* Summary cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Leads</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{all.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Est. Pipeline Value</p>
                    <p className="mt-2 text-2xl font-extrabold text-blue-600">{formatIDR(totalValue, true)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Conversion Rate</p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600">
                        {all.length > 0 ? `${Math.round((convertedCount / all.length) * 100)}%` : "—"}
                    </p>
                </div>
            </div>

            {/* Per-service filter */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link href="/admin/leads" className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${!filter && !statusFilter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    All ({all.length})
                </Link>
                {serviceCounts.map(({ svc, count }) => (
                    <Link key={svc.slug} href={`/admin/leads?service=${svc.slug}`} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${filter === svc.slug ? "bg-slate-900 text-white" : `${svc.chip} hover:opacity-80`}`}>
                        {svc.en} · {count}
                    </Link>
                ))}
                <span className="mx-1 text-slate-300">|</span>
                {Array.from(statusCounts.entries()).map(([status, count]) => (
                    <Link key={status} href={`/admin/leads?status=${status}`} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${statusFilter === status ? "bg-slate-900 text-white" : `${STATUS_COLOR[status] ?? STATUS_COLOR.new} hover:opacity-80`}`}>
                        {status} · {count}
                    </Link>
                ))}
            </div>

            {/* Sort + follow-up nudge */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Sort:</span>
                    {SORTS.map((s) => (
                        <Link key={s.key} href={sortHref(s.key)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${(sort ?? "") === s.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{s.label}</Link>
                    ))}
                </div>
                {needsStep > 0 && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700" title="Open leads with no next step set">⏰ {needsStep} need a next step</span>
                )}
            </div>

            {/* Owner filter — focus on a rep's leads */}
            {ownerCounts.size > 1 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Owner:</span>
                    <Link href={ownerHref("")} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${!ownerFilter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>All</Link>
                    {[...ownerCounts.entries()].sort((a, b) => b[1] - a[1]).map(([o, count]) => (
                        <Link key={o} href={ownerHref(o)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${ownerFilter === o ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                            {o === "__unassigned__" ? "Unassigned" : o} · {count}
                        </Link>
                    ))}
                </div>
            )}

            {/* Bulk actions */}
            <form id="bulk-leads" action={bulkUpdateLeads} className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-semibold text-slate-500">Bulk:</span>
                <select name="bulk_action" defaultValue="" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
                    <option value="">Choose action…</option>
                    <optgroup label="Set status">
                        <option value="status:new">→ New</option>
                        <option value="status:contacted">→ Contacted</option>
                        <option value="status:qualified">→ Qualified</option>
                        <option value="status:unqualified">→ Unqualified</option>
                        <option value="status:converted">→ Converted</option>
                    </optgroup>
                    <option value="owner">Assign owner</option>
                    <option value="delete">Delete</option>
                </select>
                <input name="bulk_owner" placeholder="Owner (for assign)" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs" list="rep-list" />
                <datalist id="rep-list">
                    {reps.map((r) => (
                        <option key={r.name} value={r.name} />
                    ))}
                </datalist>
                <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">Apply to selected</button>
                <span className="text-xs text-slate-400">Tick rows, choose an action, then Apply.</span>
            </form>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-4 py-3 w-8" />
                                <th className="px-4 py-3 font-semibold">Contact</th>
                                <th className="px-4 py-3 font-semibold">Service</th>
                                <th className="px-4 py-3 font-semibold">Est. value</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Owner</th>
                                <th className="px-4 py-3 font-semibold">Next step</th>
                                <th className="px-4 py-3 font-semibold">Reach out</th>
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 && (
                                <tr><td colSpan={10} className="px-4 py-12 text-center">
                                    <div className="mx-auto max-w-xs">
                                        <svg className="mx-auto h-10 w-10 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        <p className="mt-2 text-sm font-medium text-slate-400">No leads in this segment</p>
                                        <p className="mt-1 text-xs text-slate-300">Leads appear here when prospects submit forms or are added manually.</p>
                                    </div>
                                </td></tr>
                            )}
                            {pageRows.map((l) => {
                                const wa = waLink(l);
                                const mail = mailtoLink(l);
                                const status = l.status ?? "new";
                                const svc = getService(l.service);
                                const { score } = scoreLead(l);
                                const tier = scoreTier(score);
                                return (
                                    <tr key={l.id} className="align-top transition-colors hover:bg-slate-50/80">
                                        <td className="px-4 py-3"><input type="checkbox" name="ids" value={l.id} form="bulk-leads" className="h-4 w-4 rounded border-slate-300" /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/leads/${l.id}`} className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">{l.name ?? "(no name)"}</Link>
                                                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tier.color}`} title={`Lead score ${score}/100`}>{tier.label} {score}</span>
                                            </div>
                                            <p className="text-xs text-slate-500">{[l.company, l.email || l.phone].filter(Boolean).join(" · ")}</p>
                                            {l.message && <p className="mt-1 max-w-xs text-xs text-slate-400 line-clamp-1">{l.message}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${svc?.chip ?? "bg-slate-100 text-slate-600"}`}>{serviceName(l.service)}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-700">{l.value ? formatIDR(l.value, true) : "—"}</td>
                                        <td className="px-4 py-3">
                                            <form action={quickUpdateLead} className="inline-flex items-center">
                                                <input type="hidden" name="id" value={l.id} />
                                                <select name="status" defaultValue={status} className={`cursor-pointer rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold capitalize outline-none ${STATUS_COLOR[status] ?? STATUS_COLOR.new}`}>
                                                    {["new", "contacted", "qualified", "unqualified", "converted"].map((s) => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <button className="ml-1 text-[10px] font-semibold text-slate-400 hover:text-slate-700" title="Save status">Set</button>
                                            </form>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="whitespace-nowrap text-xs text-slate-500">{l.owner ?? "—"}</p>
                                            {l.source && <p className="text-[10px] text-slate-400">{SOURCE_ICON[l.source] ?? "📌"} {l.source}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <form action={quickUpdateLead} className="flex items-center gap-1">
                                                <input type="hidden" name="id" value={l.id} />
                                                <input name="next_action" defaultValue={l.next_action ?? ""} placeholder="Add next step…" className={`w-36 rounded-lg border px-2 py-1 text-xs ${l.next_action ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200"}`} />
                                                <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-800" title="Save next step">Save</button>
                                            </form>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs font-semibold">
                                                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 hover:bg-emerald-100 transition-colors" title="WhatsApp with a ready opener">WA</a>}
                                                {l.phone && <a href={`tel:${l.phone}`} className="text-slate-500 hover:text-slate-700 transition-colors">Call</a>}
                                                {mail && <a href={mail} className="text-blue-600 hover:text-blue-800 transition-colors" title="Email with a ready opener">Email</a>}
                                                {!wa && !l.phone && !mail && <span className="text-slate-300">no contact</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="whitespace-nowrap text-xs text-slate-500">{fmt(l.created_at)}</p>
                                            <p className="text-[10px] text-slate-400">{timeAgo(l.created_at)}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {status !== "converted" && (
                                                    <form action={convertLeadToOpportunity}>
                                                        <input type="hidden" name="id" value={l.id} />
                                                        <button className="whitespace-nowrap text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">Convert →</button>
                                                    </form>
                                                )}
                                                <form action={deleteRow}>
                                                    <input type="hidden" name="table" value="leads" />
                                                    <input type="hidden" name="id" value={l.id} />
                                                    <button className="text-xs font-semibold text-rose-400 hover:text-rose-600 transition-colors">Delete</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pager */}
            {totalRows > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{from}–{to}</span> of <span className="font-semibold text-slate-700">{totalRows}</span></p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            {safePage > 1
                                ? <Link href={pageHref(safePage - 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">← Prev</Link>
                                : <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-300">← Prev</span>}
                            <span className="text-xs font-semibold text-slate-500">Page {safePage} of {totalPages}</span>
                            {safePage < totalPages
                                ? <Link href={pageHref(safePage + 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Next →</Link>
                                : <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-300">Next →</span>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
