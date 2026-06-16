import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { formatIDR } from "@/lib/services";

export const dynamic = "force-dynamic";

interface Account { id: string; name: string; industry: string | null; owner: string | null; }

export default async function AccountsPage() {
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

    const rows = accounts.map((a) => {
        const accOpps = opps.filter((o) => o.account_id === a.id);
        const open = accOpps.filter((o) => o.stage !== "won" && o.stage !== "lost");
        return {
            ...a,
            leadCount: leads.filter((l) => l.account_id === a.id).length,
            oppCount: accOpps.length,
            openValue: open.reduce((s, o) => s + (o.value ?? 0), 0),
            wonValue: accOpps.filter((o) => o.stage === "won").reduce((s, o) => s + (o.value ?? 0), 0),
        };
    }).sort((a, b) => b.openValue - a.openValue);

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
                    <p className="mt-1 text-sm text-slate-500">Companies — with their leads, deals, and pipeline value rolled up.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{accounts.length} companies</span>
            </div>

            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Run <code className="font-mono">supabase/accounts.sql</code> to enable Accounts.
                </div>
            )}

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                        {rows.length === 0 && (
                            <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No accounts yet.</td></tr>
                        )}
                        {rows.map((a) => (
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
    );
}
