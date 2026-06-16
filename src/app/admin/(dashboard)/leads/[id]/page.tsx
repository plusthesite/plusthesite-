import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { serviceName, formatIDR } from "@/lib/services";
import { ActivityPanel } from "@/components/admin/ActivityPanel";
import { QuickMessage } from "@/components/admin/QuickMessage";
import { convertLeadToOpportunity } from "../../opportunities/actions";

export const dynamic = "force-dynamic";

function waLink(phone: string | null) {
    if (!phone) return null;
    const d = phone.replace(/[^\d]/g, "");
    return d ? `https://wa.me/${d}` : null;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    if (!supabase) notFound();

    const { data: l } = await supabase
        .from("leads")
        .select("id, name, email, phone, company, service, status, value, owner, message, source, locale, created_at")
        .eq("id", id)
        .maybeSingle();
    if (!l) notFound();

    const label = l.company || l.name || l.email || "Lead";
    const wa = waLink(l.phone);

    return (
        <div>
            <Link href="/admin/leads" className="text-xs font-semibold text-slate-400 hover:text-slate-600">← Back to Leads</Link>

            <div className="mt-3 grid gap-6 lg:grid-cols-5">
                {/* Record card */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">{l.name ?? "—"}</h1>
                                {l.company && <p className="text-sm text-slate-500">{l.company}</p>}
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{serviceName(l.service)}</span>
                        </div>

                        <dl className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-slate-400">Status</dt><dd className="font-medium capitalize text-slate-700">{l.status ?? "new"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Est. value</dt><dd className="font-medium text-slate-700">{l.value ? formatIDR(l.value, true) : "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Owner</dt><dd className="font-medium text-slate-700">{l.owner ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Source</dt><dd className="font-medium text-slate-700">{l.source ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Email</dt><dd className="font-medium text-slate-700">{l.email ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Phone</dt><dd className="font-medium text-slate-700">{l.phone ?? "—"}</dd></div>
                        </dl>

                        {l.message && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{l.message}</p>}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">WhatsApp</a>}
                            {l.phone && <a href={`tel:${l.phone}`} className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Call</a>}
                            {l.email && <a href={`mailto:${l.email}`} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">Email</a>}
                            {l.status !== "converted" && (
                                <form action={convertLeadToOpportunity}>
                                    <input type="hidden" name="id" value={l.id} />
                                    <button className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Convert → Opportunity</button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <QuickMessage name={l.name} phone={l.phone} email={l.email} company={l.company} service={l.service} locale={l.locale === "id" ? "id" : "en"} />
                    </div>
                </div>

                {/* Activity */}
                <div className="lg:col-span-3">
                    <ActivityPanel parentType="lead" parentId={l.id} parentLabel={label} />
                </div>
            </div>
        </div>
    );
}
