import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SERVICES, serviceName, formatIDR } from "@/lib/services";
import { deleteRow } from "../actions";
import { convertLeadToOpportunity } from "../opportunities/actions";

export const dynamic = "force-dynamic";

interface Lead {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    company: string | null;
    service: string | null;
    status: string | null;
    value: number | null;
    owner: string | null;
    next_action: string | null;
    message: string | null;
    created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
    new: "bg-slate-100 text-slate-600",
    contacted: "bg-blue-50 text-blue-700",
    qualified: "bg-indigo-50 text-indigo-700",
    unqualified: "bg-rose-50 text-rose-700",
    converted: "bg-emerald-50 text-emerald-700",
};

function waLink(phone: string | null) {
    if (!phone) return null;
    const digits = phone.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}` : null;
}

function fmt(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ service?: string }>;
}) {
    const { service: filter } = await searchParams;
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
            .from("leads")
            .select("id, name, email, phone, company, service, status, value, owner, next_action, message, created_at")
            .order("created_at", { ascending: false })
        : { data: [] };
    const all = (data ?? []) as Lead[];

    const counts = SERVICES.map((svc) => ({ svc, count: all.filter((l) => l.service === svc.slug).length })).filter((s) => s.count > 0);
    const rows = filter ? all.filter((l) => l.service === filter) : all;

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
                    <p className="mt-1 text-sm text-slate-500">Inbound prospects by service line — qualify and convert to pipeline.</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{all.length} total</span>
            </div>

            {/* Per-service filter */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link href="/admin/leads" className={`rounded-full px-3 py-1.5 text-xs font-semibold ${!filter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    All ({all.length})
                </Link>
                {counts.map(({ svc, count }) => (
                    <Link key={svc.slug} href={`/admin/leads?service=${svc.slug}`} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === svc.slug ? "bg-slate-900 text-white" : `${svc.chip} hover:opacity-80`}`}>
                        {svc.en} · {count}
                    </Link>
                ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Contact</th>
                            <th className="px-4 py-3 font-semibold">Service</th>
                            <th className="px-4 py-3 font-semibold">Est. value</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Reach out</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.length === 0 && (
                            <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No leads in this segment yet.</td></tr>
                        )}
                        {rows.map((l) => {
                            const wa = waLink(l.phone);
                            const status = l.status ?? "new";
                            return (
                                <tr key={l.id} className="align-top hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-slate-800">{l.name ?? "—"}</p>
                                        <p className="text-xs text-slate-500">{l.company ? `${l.company} · ` : ""}{l.email}</p>
                                        {l.message && <p className="mt-1 max-w-xs text-xs text-slate-400 line-clamp-1">{l.message}</p>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{serviceName(l.service)}</span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-700">{l.value ? formatIDR(l.value, true) : "—"}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOR[status] ?? STATUS_COLOR.new}`}>{status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800">WA</a>}
                                            {l.phone && <a href={`tel:${l.phone}`} className="text-slate-500 hover:text-slate-700">Call</a>}
                                            <a href={`mailto:${l.email}`} className="text-blue-600 hover:text-blue-800">Email</a>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{fmt(l.created_at)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {status !== "converted" && (
                                                <form action={convertLeadToOpportunity}>
                                                    <input type="hidden" name="id" value={l.id} />
                                                    <button className="whitespace-nowrap text-xs font-semibold text-blue-600 hover:text-blue-800">Convert →</button>
                                                </form>
                                            )}
                                            <form action={deleteRow}>
                                                <input type="hidden" name="table" value="leads" />
                                                <input type="hidden" name="id" value={l.id} />
                                                <button className="text-xs font-semibold text-rose-400 hover:text-rose-600">Delete</button>
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
    );
}
