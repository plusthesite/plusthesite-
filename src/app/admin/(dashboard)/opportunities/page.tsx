import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SERVICES, serviceName, getService, formatIDR } from "@/lib/services";
import {
    updateOpportunityStage,
    deleteOpportunity,
    bulkUpdateOpportunities,
} from "./actions";
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

function opener(opp: Opp) {
    const first = opp.contact_name?.trim().split(/\s+/)[0];
    const svc = serviceName(opp.service).toLowerCase();
    return `Halo ${first || "Kak"}, saya dari plus. (plusthe.site) menindaklanjuti kebutuhan ${svc}${opp.company ? ` untuk ${opp.company}` : ""}. Jika berkenan, kita bisa lanjut ngobrol singkat hari ini.`;
}

function waLink(opp: Opp) {
    if (!opp.phone) return null;
    const digits = opp.phone.replace(/[^\d]/g, "");
    return digits
        ? `https://wa.me/${digits}?text=${encodeURIComponent(opener(opp))}`
        : null;
}

function mailtoLink(opp: Opp) {
    if (!opp.email) return null;
    return `mailto:${opp.email}?subject=${encodeURIComponent("Tindak lanjut dari plus.")}&body=${encodeURIComponent(opener(opp))}`;
}

function fmtDate(date: string | null) {
    return date
        ? new Date(date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
          })
        : "-";
}

function daysUntil(date: string | null) {
    if (!date) return null;
    const diff = Math.round((new Date(date).getTime() - Date.now()) / 86_400_000);
    if (diff < 0) {
        return {
            label: `${Math.abs(diff)} hari lewat`,
            color: "text-rose-600",
        };
    }
    if (diff <= 7) {
        return {
            label: `${diff} hari lagi`,
            color: "text-amber-600",
        };
    }
    return { label: `${diff} hari`, color: "text-slate-400" };
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
              .select(
                  "id, name, company, contact_name, email, phone, value, stage, probability, source, service, owner, next_action, next_action_at, expected_close"
              )
              .order("value", { ascending: false })
        : { data: [] };
    const all = (data ?? []) as Opp[];

    const open = all.filter((opp) => opp.stage !== "won" && opp.stage !== "lost");
    const totalPipeline = open.reduce((sum, opp) => sum + (opp.value ?? 0), 0);
    const weighted = open.reduce(
        (sum, opp) => sum + (opp.value ?? 0) * ((opp.probability ?? 0) / 100),
        0
    );
    const wonValue = all
        .filter((opp) => opp.stage === "won")
        .reduce((sum, opp) => sum + (opp.value ?? 0), 0);
    const lostCount = all.filter((opp) => opp.stage === "lost").length;

    const byService = SERVICES.map((svc) => {
        const rows = all.filter((opp) => opp.service === svc.slug);
        const openRows = rows.filter((opp) => opp.stage !== "won" && opp.stage !== "lost");
        return {
            svc,
            count: rows.length,
            openValue: openRows.reduce((sum, opp) => sum + (opp.value ?? 0), 0),
        };
    }).filter((item) => item.count > 0);

    const ownerCounts = new Map<string, number>();
    for (const opp of all) {
        const owner = opp.owner?.trim() || "__unassigned__";
        ownerCounts.set(owner, (ownerCounts.get(owner) ?? 0) + 1);
    }

    let visible = filter ? all.filter((opp) => opp.service === filter) : all;
    if (ownerFilter) {
        visible = visible.filter((opp) =>
            ownerFilter === "__unassigned__" ? !opp.owner : opp.owner === ownerFilter
        );
    }

    const ownerBase = new URLSearchParams();
    if (filter) ownerBase.set("service", filter);
    const ownerHref = (owner: string) => {
        const params = new URLSearchParams(ownerBase);
        if (owner) params.set("owner", owner);
        const query = params.toString();
        return `/admin/opportunities${query ? `?${query}` : ""}`;
    };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Pipeline penjualan per layanan, siap ditindaklanjuti sampai
                        closing.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/opportunities/new"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Opportunity Baru
                    </Link>
                    <Link
                        href="/admin/opportunities/board"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
                            />
                        </svg>
                        Tampilan Board
                    </Link>
                </div>
            </div>

            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Supabase belum terhubung. Jalankan{" "}
                    <code className="font-mono">supabase/crm.sql</code> lalu{" "}
                    <code className="font-mono">supabase/seed_crm.sql</code>.
                </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Open Pipeline
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">
                        {formatIDR(totalPipeline, true)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {open.length} deal aktif
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Weighted Forecast
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-blue-600">
                        {formatIDR(weighted, true)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        sudah disesuaikan probabilitas
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Won Revenue
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600">
                        {formatIDR(wonValue, true)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {all.filter((opp) => opp.stage === "won").length} closed-won
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Win Rate
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-violet-600">
                        {all.filter((opp) => opp.stage === "won" || opp.stage === "lost")
                            .length > 0
                            ? `${Math.round(
                                  (all.filter((opp) => opp.stage === "won").length /
                                      all.filter(
                                          (opp) =>
                                              opp.stage === "won" || opp.stage === "lost"
                                      ).length) *
                                      100
                              )}%`
                            : "-"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{lostCount} lost</p>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link
                    href="/admin/opportunities"
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        !filter
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                    Semua ({all.length})
                </Link>
                {byService.map(({ svc, count, openValue }) => (
                    <Link
                        key={svc.slug}
                        href={`/admin/opportunities?service=${svc.slug}`}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            filter === svc.slug
                                ? "bg-slate-900 text-white"
                                : `${svc.chip} hover:opacity-80`
                        }`}
                    >
                        {svc.en} - {count} - {formatIDR(openValue, true)}
                    </Link>
                ))}
            </div>

            {ownerCounts.size > 1 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                        Owner:
                    </span>
                    <Link
                        href={ownerHref("")}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            !ownerFilter
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        Semua
                    </Link>
                    {[...ownerCounts.entries()]
                        .sort((a, b) => b[1] - a[1])
                        .map(([owner, count]) => (
                            <Link
                                key={owner}
                                href={ownerHref(owner)}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    ownerFilter === owner
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {owner === "__unassigned__" ? "Belum ada owner" : owner} -{" "}
                                {count}
                            </Link>
                        ))}
                </div>
            )}

            <form
                id="bulk-opps"
                action={bulkUpdateOpportunities}
                className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
                <span className="text-xs font-semibold text-slate-500">Bulk:</span>
                <select
                    name="bulk_action"
                    defaultValue=""
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                >
                    <option value="">Pilih aksi...</option>
                    <optgroup label="Ubah stage">
                        <option value="stage:new">Ke New</option>
                        <option value="stage:contacted">Ke Contacted</option>
                        <option value="stage:qualified">Ke Qualified</option>
                        <option value="stage:proposal">Ke Proposal</option>
                        <option value="stage:negotiation">Ke Negotiation</option>
                        <option value="stage:won">Ke Won</option>
                        <option value="stage:lost">Ke Lost</option>
                    </optgroup>
                    <option value="owner">Assign owner</option>
                    <option value="delete">Hapus</option>
                </select>
                <input
                    name="bulk_owner"
                    placeholder="Nama owner untuk assign"
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                />
                <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
                    Terapkan ke pilihan
                </button>
                <span className="text-xs text-slate-400">
                    Centang baris, pilih aksi, lalu terapkan.
                </span>
            </form>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-4 py-3 w-8" />
                                <th className="px-4 py-3 font-semibold">Deal / Kontak</th>
                                <th className="px-4 py-3 font-semibold">Layanan</th>
                                <th className="px-4 py-3 font-semibold">Nilai</th>
                                <th className="px-4 py-3 font-semibold">Stage</th>
                                <th className="px-4 py-3 font-semibold">Owner</th>
                                <th className="px-4 py-3 font-semibold">Next action</th>
                                <th className="px-4 py-3 font-semibold">Target close</th>
                                <th className="px-4 py-3 font-semibold">Outreach</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visible.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="px-4 py-12 text-center">
                                        <div className="mx-auto max-w-xs">
                                            <svg
                                                className="mx-auto h-10 w-10 text-slate-200"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 3v18h18M9 17V9m4 8V5m4 12v-6"
                                                />
                                            </svg>
                                            <p className="mt-2 text-sm font-medium text-slate-400">
                                                Belum ada opportunity
                                            </p>
                                            <p className="mt-1 text-xs text-slate-300">
                                                Konversi lead atau buat deal baru untuk
                                                membangun pipeline.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {visible.map((opp) => {
                                const wa = waLink(opp);
                                const mail = mailtoLink(opp);
                                const svc = getService(opp.service);
                                const close = daysUntil(opp.expected_close);
                                return (
                                    <tr
                                        key={opp.id}
                                        className="align-top transition-colors hover:bg-slate-50/80"
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                name="ids"
                                                value={opp.id}
                                                form="bulk-opps"
                                                className="h-4 w-4 rounded border-slate-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/opportunities/${opp.id}`}
                                                className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                                            >
                                                {opp.name}
                                            </Link>
                                            <p className="text-xs text-slate-500">
                                                {opp.contact_name}
                                                {opp.company ? ` - ${opp.company}` : ""}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${svc?.chip ?? "bg-slate-100 text-slate-600"}`}
                                            >
                                                {serviceName(opp.service)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-800">
                                            {formatIDR(opp.value ?? 0, true)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StageSelect
                                                id={opp.id}
                                                stage={opp.stage}
                                                action={updateOpportunityStage}
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                                            {opp.owner ?? "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-slate-700">
                                                {opp.next_action ?? "-"}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {fmtDate(opp.next_action_at)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <p className="text-xs text-slate-700">
                                                {fmtDate(opp.expected_close)}
                                            </p>
                                            {close && (
                                                <p
                                                    className={`text-[10px] font-semibold ${close.color}`}
                                                >
                                                    {close.label}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs font-semibold">
                                                {wa && (
                                                    <a
                                                        href={wa}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                        title="WhatsApp dengan follow-up siap pakai"
                                                    >
                                                        WA
                                                    </a>
                                                )}
                                                {opp.phone && (
                                                    <a
                                                        href={`tel:${opp.phone}`}
                                                        className="text-slate-500 hover:text-slate-700 transition-colors"
                                                    >
                                                        Call
                                                    </a>
                                                )}
                                                {mail && (
                                                    <a
                                                        href={mail}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                        title="Email dengan follow-up siap pakai"
                                                    >
                                                        Email
                                                    </a>
                                                )}
                                                {!wa && !opp.phone && !mail && (
                                                    <span className="text-slate-300">
                                                        tidak ada kontak
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <form action={deleteOpportunity}>
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={opp.id}
                                                />
                                                <button className="text-xs font-semibold text-rose-400 hover:text-rose-600 transition-colors">
                                                    Hapus
                                                </button>
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
