import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { serviceName, formatIDR } from "@/lib/services";
import { scoreLead, scoreTier } from "@/lib/leadScore";
import { ActivityPanel } from "@/components/admin/ActivityPanel";
import { QuickMessage } from "@/components/admin/QuickMessage";
import { convertLeadToOpportunity } from "../../opportunities/actions";
import { quickUpdateLead } from "../actions";

export const dynamic = "force-dynamic";

function opener(name: string | null, service: string | null, company: string | null, locale: string | null) {
    const first = name?.trim().split(/\s+/)[0];
    const svc = serviceName(service).toLowerCase();
    if (locale === "en") return `Hi ${first || "there"}, this is plus. (plusthe.site). We help businesses with ${svc} — saw ${company || "your business"} and thought we could help. Open to a quick chat?`;
    return `Halo ${first || "Kak"}, saya dari plus. (plusthe.site). Kami bantu bisnis untuk ${svc}. Kebetulan lihat ${company || "usaha Anda"} — boleh ngobrol singkat?`;
}

function waLink(phone: string | null, text: string) {
    if (!phone) return null;
    const d = phone.replace(/[^\d]/g, "");
    return d ? `https://wa.me/${d}?text=${encodeURIComponent(text)}` : null;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    if (!supabase) notFound();

    const { data: l } = await supabase
        .from("leads")
        .select("id, name, email, phone, company, service, status, value, owner, message, source, locale, created_at, account_id, next_action")
        .eq("id", id)
        .maybeSingle();
    if (!l) notFound();

    const { data: account } = l.account_id
        ? await supabase.from("accounts").select("id, name, industry").eq("id", l.account_id).maybeSingle()
        : { data: null };

    const label = l.company || l.name || l.email || "Lead";
    const msg = opener(l.name, l.service, l.company, l.locale);
    const wa = waLink(l.phone, msg);
    const mail = l.email ? `mailto:${l.email}?subject=${encodeURIComponent(l.locale === "en" ? "Quick hello from plus." : "Halo dari plus.")}&body=${encodeURIComponent(msg)}` : null;
    const { score, reasons } = scoreLead(l);
    const tier = scoreTier(score);

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

                        {/* Lead score */}
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-white shadow-sm">
                                <span className="text-lg font-black leading-none text-slate-900">{score}</span>
                                <span className="text-[8px] font-bold uppercase text-slate-400">/100</span>
                            </div>
                            <div className="min-w-0">
                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${tier.color}`}>{tier.label} lead</span>
                                {reasons.length > 0 && <p className="mt-1 truncate text-[11px] text-slate-500" title={reasons.join(" · ")}>{reasons.join(" · ")}</p>}
                            </div>
                        </div>

                        <dl className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-slate-400">Status</dt><dd className="font-medium capitalize text-slate-700">{l.status ?? "new"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Est. value</dt><dd className="font-medium text-slate-700">{l.value ? formatIDR(l.value, true) : "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Owner</dt><dd className="font-medium text-slate-700">{l.owner ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Source</dt><dd className="font-medium text-slate-700">{l.source ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Email</dt><dd className="font-medium text-slate-700">{l.email ?? "—"}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-400">Phone</dt><dd className="font-medium text-slate-700">{l.phone ?? "—"}</dd></div>
                            <div className="flex justify-between gap-2"><dt className="text-slate-400">Account</dt><dd className="font-medium text-slate-700 truncate">
                                {account
                                    ? <Link href={`/admin/accounts/${account.id}`} className="text-blue-600 hover:underline">{account.name}{account.industry ? ` · ${account.industry}` : ""}</Link>
                                    : "—"}
                            </dd></div>
                        </dl>

                        {l.message && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{l.message}</p>}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" title="WhatsApp with a ready opener" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">WhatsApp</a>}
                            {l.phone && <a href={`tel:${l.phone}`} className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Call</a>}
                            {mail && <a href={mail} title="Email with a ready opener" className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">Email</a>}
                            {l.status !== "converted" && (
                                <form action={convertLeadToOpportunity}>
                                    <input type="hidden" name="id" value={l.id} />
                                    <button className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Convert → Opportunity</button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Next step / follow-up */}
                    <form action={quickUpdateLead} className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <input type="hidden" name="id" value={l.id} />
                        <label className="text-xs font-semibold text-slate-500">Next step (follow-up)</label>
                        <div className="mt-2 flex gap-2">
                            <input name="next_action" defaultValue={l.next_action ?? ""} placeholder="e.g. Call back Fri, send proposal…" className={`flex-1 rounded-lg border px-3 py-2 text-sm ${l.next_action ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200"}`} />
                            <button className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">Save</button>
                        </div>
                    </form>

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
