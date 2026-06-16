import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { serviceName, formatIDR } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    if (!supabase) notFound();

    const { data: acc } = await supabase.from("accounts").select("id, name, industry, website, phone, email, owner, notes").eq("id", id).maybeSingle();
    if (!acc) notFound();

    const [leadRes, oppRes] = await Promise.all([
        supabase.from("leads").select("id, name, email, phone, service, status").eq("account_id", id),
        supabase.from("opportunities").select("id, name, value, stage, service, owner").eq("account_id", id).order("value", { ascending: false }),
    ]);
    const leads = (leadRes.data ?? []) as { id: string; name: string | null; email: string | null; phone: string | null; service: string | null; status: string | null }[];
    const opps = (oppRes.data ?? []) as { id: string; name: string; value: number | null; stage: string; service: string | null; owner: string | null }[];
    const openValue = opps.filter((o) => o.stage !== "won" && o.stage !== "lost").reduce((s, o) => s + (o.value ?? 0), 0);

    return (
        <div>
            <Link href="/admin/accounts" className="text-xs font-semibold text-slate-400 hover:text-slate-600">← Back to Accounts</Link>

            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{acc.name}</h1>
                    <p className="mt-1 text-sm text-slate-500">{[acc.industry, acc.owner && `Owner: ${acc.owner}`].filter(Boolean).join(" · ") || "Company account"}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Open pipeline</p>
                    <p className="text-2xl font-extrabold text-indigo-600">{formatIDR(openValue, true)}</p>
                </div>
            </div>

            {(acc.website || acc.phone || acc.email) && (
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                    {acc.website && <a href={acc.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{acc.website}</a>}
                    {acc.phone && <span>{acc.phone}</span>}
                    {acc.email && <a href={`mailto:${acc.email}`} className="text-blue-600 hover:underline">{acc.email}</a>}
                </div>
            )}

            {/* Opportunities */}
            <h2 className="mt-8 text-sm font-bold text-slate-900">Opportunities ({opps.length})</h2>
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-slate-100">
                        {opps.length === 0 && <tr><td className="px-5 py-6 text-center text-slate-400">No deals.</td></tr>}
                        {opps.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3"><Link href={`/admin/opportunities/${o.id}`} className="font-medium text-slate-800 hover:text-blue-600">{o.name}</Link></td>
                                <td className="px-5 py-3 text-slate-500">{serviceName(o.service)}</td>
                                <td className="px-5 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-600">{o.stage}</span></td>
                                <td className="px-5 py-3 text-right font-semibold text-slate-800">{formatIDR(o.value ?? 0, true)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Leads */}
            <h2 className="mt-6 text-sm font-bold text-slate-900">Leads ({leads.length})</h2>
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-slate-100">
                        {leads.length === 0 && <tr><td className="px-5 py-6 text-center text-slate-400">No leads.</td></tr>}
                        {leads.map((l) => (
                            <tr key={l.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3"><Link href={`/admin/leads/${l.id}`} className="font-medium text-slate-800 hover:text-blue-600">{l.name ?? l.email ?? "Lead"}</Link></td>
                                <td className="px-5 py-3 text-slate-500">{serviceName(l.service)}</td>
                                <td className="px-5 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-600">{l.status ?? "new"}</span></td>
                                <td className="px-5 py-3 text-right text-xs text-slate-400">{l.phone || l.email || ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
