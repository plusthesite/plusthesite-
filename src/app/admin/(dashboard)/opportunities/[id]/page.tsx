import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { serviceName, formatIDR } from "@/lib/services";
import { ActivityPanel } from "@/components/admin/ActivityPanel";
import { StageSelect } from "../StageSelect";
import { updateOpportunityStage } from "../actions";

export const dynamic = "force-dynamic";

function waLink(phone: string | null) {
    if (!phone) return null;
    const d = phone.replace(/[^\d]/g, "");
    return d ? `https://wa.me/${d}` : null;
}

function fmt(d: string | null) {
    return d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    if (!supabase) notFound();

    const { data: o } = await supabase
        .from("opportunities")
        .select("id, name, company, contact_name, email, phone, value, stage, probability, source, service, owner, next_action, next_action_at, expected_close, notes")
        .eq("id", id)
        .maybeSingle();
    if (!o) notFound();

    const label = o.company || o.name;
    const wa = waLink(o.phone);

    return (
        <div>
            <Link href="/admin/opportunities" className="text-xs font-semibold text-slate-400 hover:text-slate-600">← Back to Opportunities</Link>

            <div className="mt-3 grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">{o.name}</h1>
                                <p className="text-sm text-slate-500">{o.contact_name}{o.company ? ` · ${o.company}` : ""}</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{serviceName(o.service)}</span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-2xl font-extrabold text-slate-900">{formatIDR(o.value ?? 0, true)}</span>
                            <StageSelect id={o.id} stage={o.stage} action={updateOpportunityStage} />
                        </div>

                        <dl className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-slate-400">Probability</dt><dd className="font-medium text-slate-700">{o.probability ?? 0}%</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Owner</dt><dd className="font-medium text-slate-700">{o.owner ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Source</dt><dd className="font-medium text-slate-700">{o.source ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Next action</dt><dd className="font-medium text-slate-700">{o.next_action ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Expected close</dt><dd className="font-medium text-slate-700">{fmt(o.expected_close)}</dd></div>
                        </dl>

                        {o.notes && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{o.notes}</p>}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">WhatsApp</a>}
                            {o.phone && <a href={`tel:${o.phone}`} className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Call</a>}
                            {o.email && <a href={`mailto:${o.email}`} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">Email</a>}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <ActivityPanel parentType="opportunity" parentId={o.id} parentLabel={label} />
                </div>
            </div>
        </div>
    );
}
