import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { formatIDR } from "@/lib/services";

export const dynamic = "force-dynamic";

interface Account { id: string; name: string; industry: string | null; owner: string | null; }

const PAGE_SIZE = 50;

export default async function AccountsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string }>;
}) {
    const { page, q } = await searchParams;
    const supabase = getSupabaseAdmin();

    const [accRes, oppRes, leadRes] = supabase
        ? await Promise.all([
            supabase.from("accounts").select("id, name, industry, owner").order("name"),
            supabase.from("opportunities").select("account_id, value, stage"),
            supabase.from("leads").select("account_id"),
        ])
        : [{ data: [] }, { data: [] }, { data: [] }];

    const accounts = (accRes.data ?? []) as Account[];
    const opps = (oppRes.data ?? []) as { account_id: string | null; value: number | null; stage: string }[];
    const leads = (leadRes.data ?? []) as { account_id: string | null }[];

    // Build lookup maps ONCE — O(accounts + leads + opps) instead of O(accounts × …).
    const leadCount = new Map<string, number>();
    for (const l of leads) if (l.account_id) leadCount.set(l.account_id, (leadCount.get(l.account_id) ?? 0) + 1);

    const oppAgg = new Map<string, { count: number; openValue: number; wonValue: number }>();
    for (const o of opps) {
        if (!o.account_id) continue;
        const a = oppAgg.get(o.account_id) ?? { count: 0, openValue: 0, wonValue: 0 };
        a.count += 1;
        const v = o.value ?? 0;
        if (o.stage === "won") a.wonValue += v;
        else if (o.stage !== "lost") a.openValue += v;
        oppAgg.set(o.account_id, a);
    }

    let rows = accounts.map((a) => {
        const agg = oppAgg.get(a.id);
        return {
            ...a,
            leadCount: leadCount.get(a.id) ?? 0,
            oppCount: agg?.count ?? 0,
            openValue: agg?.openValue ?? 0,
            wonValue: agg?.wonValue ?? 0,
        };
    }).sort((a, b) => b.openValue - a.openValue);

    // Search by company name / industry.
    const query = (q ?? "").trim().toLowerCase();
    if (query) rows = rows.filter((a) => a.name.toLowerCase().includes(query) || (a.industry ?? "").toLowerCase().includes(query));

    // Pagination.
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const from = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const to = Math.min(safePage * PAGE_SIZE, total);
    const pageHref = (p: number) => { const sp = new URLSearchParams(); if (query) sp.set("q", query); if (p > 1) sp.set("page", String(p)); const s = sp.toString(); return `/admin/accounts${s ? `?${s}` : ""}`; };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
                    <p className="mt-1 text-sm text-slate-500">Companies — with their leads, deals, and pipeline value rolled up.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{accounts.length.toLocaleString()} companies</span>
            </div>

            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Run <code className="font-mono">supabase/accounts.sql</code> to enable Accounts.
                </div>
            )}

            {/* Search */}
            <form method="get" className="mt-6 flex items-center gap-2">
                <input name="q" defaultValue={query} placeholder="Cari perusahaan / industri…" className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
                <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Cari</button>
                {query && <Link href="/admin/accounts" className="text-xs font-semibold text-slate-400 hover:text-slate-600">Reset</Link>}
            </form>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Company</th>
                                <th className="px-5 py-3 font-semibold">Owner</th>
                                <th className="px-5 py-3 font-semibold text-center">Leads</th>
                                <th className="px-5 py-3 font-semibold text-center">Deals</th>
                                <th className="px-5 py-3 font-semibold text-right">Open pipeline</th>
                                <th className="px-5 py-3 font-semibold text-right">Won</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pageRows.length === 0 && (
                                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">{query ? "No matching companies." : "No accounts yet."}</td></tr>
                            )}
                            {pageRows.map((a) => (
                                <tr key={a.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3">
                                        <Link href={`/admin/accounts/${a.id}`} className="font-semibold text-slate-800 hover:text-blue-600">{a.name}</Link>
                                        {a.industry && <span className="ml-2 text-xs text-slate-400">{a.industry}</span>}
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">{a.owner ?? "—"}</td>
                                    <td className="px-5 py-3 text-center text-slate-600">{a.leadCount}</td>
                                    <td className="px-5 py-3 text-center text-slate-600">{a.oppCount}</td>
                                    <td className="px-5 py-3 text-right font-semibold text-slate-800">{formatIDR(a.openValue, true)}</td>
                                    <td className="px-5 py-3 text-right text-emerald-600">{a.wonValue ? formatIDR(a.wonValue, true) : "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pager */}
            {total > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{from}–{to}</span> of <span className="font-semibold text-slate-700">{total.toLocaleString()}</span></p>
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
