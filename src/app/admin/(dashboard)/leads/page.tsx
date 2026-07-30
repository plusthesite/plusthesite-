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
    website: "WEB",
    instagram: "IG",
    linkedin: "LN",
    referral: "REF",
    blog: "BLOG",
    "contact-form": "FORM",
    chatbot: "BOT",
    event: "EVENT",
};

function opener(lead: Lead) {
    const first = lead.name?.trim().split(/\s+/)[0];
    const svc = serviceName(lead.service).toLowerCase();
    if (lead.locale === "en") {
        return `Hi ${first || "there"}, this is plus. (plusthe.site). We help businesses with ${svc} and thought ${lead.company || "your business"} could be a fit. Open to a quick chat?`;
    }
    return `Halo ${first || "Kak"}, saya dari plus. (plusthe.site). Kami bantu bisnis untuk ${svc}. Kami lihat ${lead.company || "usaha Anda"} dan sepertinya bisa cocok. Boleh ngobrol singkat?`;
}

function waLink(lead: Lead) {
    if (!lead.phone) return null;
    const digits = lead.phone.replace(/[^\d]/g, "");
    return digits
        ? `https://wa.me/${digits}?text=${encodeURIComponent(opener(lead))}`
        : null;
}

function mailtoLink(lead: Lead) {
    if (!lead.email) return null;
    const subject = lead.locale === "en" ? "Quick hello from plus." : "Halo dari plus.";
    return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(opener(lead))}`;
}

function fmt(date: string) {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return "hari ini";
    if (days === 1) return "kemarin";
    if (days < 7) return `${days} hr lalu`;
    if (days < 30) return `${Math.floor(days / 7)} mgg lalu`;
    return `${Math.floor(days / 30)} bln lalu`;
}

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: Promise<{
        service?: string;
        status?: string;
        sort?: string;
        page?: string;
        owner?: string;
    }>;
}) {
    const {
        service: filter,
        status: statusFilter,
        sort,
        page,
        owner: ownerFilter,
    } = await searchParams;
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
              .from("leads")
              .select(
                  "id, name, email, phone, company, service, status, value, owner, next_action, message, source, locale, created_at"
              )
              .order("created_at", { ascending: false })
        : { data: [] };
    const all = (data ?? []) as Lead[];

    const { data: repsData } = supabase
        ? await supabase
              .from("sales_reps")
              .select("name")
              .eq("is_active", true)
              .order("name")
        : { data: [] };
    const reps = (repsData ?? []) as { name: string }[];

    const serviceCounts = SERVICES.map((svc) => ({
        svc,
        count: all.filter((lead) => lead.service === svc.slug).length,
    })).filter((item) => item.count > 0);

    const statusCounts = new Map<string, number>();
    for (const lead of all) {
        const status = lead.status ?? "new";
        statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
    }

    const totalValue = all.reduce((sum, lead) => sum + (lead.value ?? 0), 0);
    const newCount = all.filter((lead) => (lead.status ?? "new") === "new").length;
    const convertedCount = all.filter((lead) => lead.status === "converted").length;
    const hotCount = all.filter((lead) => scoreLead(lead).score >= 70).length;

    const ownerCounts = new Map<string, number>();
    for (const lead of all) {
        const owner = lead.owner?.trim() || "__unassigned__";
        ownerCounts.set(owner, (ownerCounts.get(owner) ?? 0) + 1);
    }

    let rows = filter ? all.filter((lead) => lead.service === filter) : all;
    if (statusFilter) {
        rows = rows.filter((lead) => (lead.status ?? "new") === statusFilter);
    }
    if (ownerFilter) {
        rows = rows.filter((lead) =>
            ownerFilter === "__unassigned__" ? !lead.owner : lead.owner === ownerFilter
        );
    }

    if (sort === "hot") {
        rows = [...rows].sort((a, b) => scoreLead(b).score - scoreLead(a).score);
    } else if (sort === "value") {
        rows = [...rows].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    }

    const needsStep = rows.filter(
        (lead) =>
            !lead.next_action &&
            lead.status !== "converted" &&
            lead.status !== "unqualified"
    ).length;

    const sortBase = new URLSearchParams();
    if (filter) sortBase.set("service", filter);
    if (statusFilter) sortBase.set("status", statusFilter);
    if (ownerFilter) sortBase.set("owner", ownerFilter);

    const ownerBase = new URLSearchParams();
    if (filter) ownerBase.set("service", filter);
    if (statusFilter) ownerBase.set("status", statusFilter);

    const ownerHref = (owner: string) => {
        const params = new URLSearchParams(ownerBase);
        if (owner) params.set("owner", owner);
        const query = params.toString();
        return `/admin/leads${query ? `?${query}` : ""}`;
    };

    const sortHref = (sortKey: string) => {
        const params = new URLSearchParams(sortBase);
        if (sortKey) params.set("sort", sortKey);
        const query = params.toString();
        return `/admin/leads${query ? `?${query}` : ""}`;
    };

    const SORTS: { key: string; label: string }[] = [
        { key: "", label: "Terbaru" },
        { key: "hot", label: "Skor Tertinggi" },
        { key: "value", label: "Nilai Terbesar" },
    ];

    const PAGE_SIZE = 50;
    const totalRows = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const from = totalRows === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const to = Math.min(safePage * PAGE_SIZE, totalRows);

    const pageHref = (targetPage: number) => {
        const params = new URLSearchParams(sortBase);
        if (sort) params.set("sort", sort);
        if (targetPage > 1) params.set("page", String(targetPage));
        const query = params.toString();
        return `/admin/leads${query ? `?${query}` : ""}`;
    };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Prospek inbound per layanan, siap dikualifikasi dan
                        dikonversi jadi pipeline.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {newCount} baru
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {convertedCount} converted
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {all.length} total
                    </span>
                    <Link
                        href="/admin/leads/new"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Lead Baru
                    </Link>
                </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Total Leads
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">
                        {all.length}
                    </p>
                </div>
                <Link
                    href="/admin/leads?sort=hot"
                    className="rounded-xl border border-rose-200 bg-rose-50 p-5 shadow-sm transition-colors hover:bg-rose-100"
                >
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-400">
                        Lead Terpanas
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-rose-600">
                        {hotCount}
                    </p>
                </Link>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Estimasi Nilai Pipeline
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-blue-600">
                        {formatIDR(totalValue, true)}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Conversion Rate
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600">
                        {all.length > 0
                            ? `${Math.round((convertedCount / all.length) * 100)}%`
                            : "-"}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link
                    href="/admin/leads"
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        !filter && !statusFilter
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                    Semua ({all.length})
                </Link>
                {serviceCounts.map(({ svc, count }) => (
                    <Link
                        key={svc.slug}
                        href={`/admin/leads?service=${svc.slug}`}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            filter === svc.slug
                                ? "bg-slate-900 text-white"
                                : `${svc.chip} hover:opacity-80`
                        }`}
                    >
                        {svc.en} - {count}
                    </Link>
                ))}
                <span className="mx-1 text-slate-300">|</span>
                {Array.from(statusCounts.entries()).map(([status, count]) => (
                    <Link
                        key={status}
                        href={`/admin/leads?status=${status}`}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                            statusFilter === status
                                ? "bg-slate-900 text-white"
                                : `${STATUS_COLOR[status] ?? STATUS_COLOR.new} hover:opacity-80`
                        }`}
                    >
                        {status} - {count}
                    </Link>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                        Urutkan:
                    </span>
                    {SORTS.map((item) => (
                        <Link
                            key={item.key}
                            href={sortHref(item.key)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                (sort ?? "") === item.key
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                {needsStep > 0 && (
                    <span
                        className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                        title="Lead terbuka yang belum punya next step"
                    >
                        {needsStep} lead butuh next step
                    </span>
                )}
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
                id="bulk-leads"
                action={bulkUpdateLeads}
                className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
                <span className="text-xs font-semibold text-slate-500">Bulk:</span>
                <select
                    name="bulk_action"
                    defaultValue=""
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                >
                    <option value="">Pilih aksi...</option>
                    <optgroup label="Ubah status">
                        <option value="status:new">Ke New</option>
                        <option value="status:contacted">Ke Contacted</option>
                        <option value="status:qualified">Ke Qualified</option>
                        <option value="status:unqualified">Ke Unqualified</option>
                        <option value="status:converted">Ke Converted</option>
                    </optgroup>
                    <option value="owner">Assign owner</option>
                    <option value="delete">Hapus</option>
                </select>
                <input
                    name="bulk_owner"
                    placeholder="Nama owner untuk assign"
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                    list="rep-list"
                />
                <datalist id="rep-list">
                    {reps.map((rep) => (
                        <option key={rep.name} value={rep.name} />
                    ))}
                </datalist>
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
                                <th className="px-4 py-3 font-semibold">Kontak</th>
                                <th className="px-4 py-3 font-semibold">Layanan</th>
                                <th className="px-4 py-3 font-semibold">Estimasi nilai</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Owner</th>
                                <th className="px-4 py-3 font-semibold">Next step</th>
                                <th className="px-4 py-3 font-semibold">Outreach</th>
                                <th className="px-4 py-3 font-semibold">Tanggal</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 && (
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
                                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                />
                                            </svg>
                                            <p className="mt-2 text-sm font-medium text-slate-400">
                                                Belum ada lead di segmen ini
                                            </p>
                                            <p className="mt-1 text-xs text-slate-300">
                                                Lead akan muncul di sini saat prospek
                                                mengisi form atau ditambahkan manual.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {pageRows.map((lead) => {
                                const wa = waLink(lead);
                                const mail = mailtoLink(lead);
                                const status = lead.status ?? "new";
                                const svc = getService(lead.service);
                                const { score } = scoreLead(lead);
                                const tier = scoreTier(score);
                                return (
                                    <tr
                                        key={lead.id}
                                        className="align-top transition-colors hover:bg-slate-50/80"
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                name="ids"
                                                value={lead.id}
                                                form="bulk-leads"
                                                className="h-4 w-4 rounded border-slate-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/leads/${lead.id}`}
                                                    className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                                                >
                                                    {lead.name ?? "(tanpa nama)"}
                                                </Link>
                                                <span
                                                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tier.color}`}
                                                    title={`Lead score ${score}/100`}
                                                >
                                                    {tier.label} {score}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                {[lead.company, lead.email || lead.phone]
                                                    .filter(Boolean)
                                                    .join(" - ")}
                                            </p>
                                            {lead.message && (
                                                <p className="mt-1 max-w-xs text-xs text-slate-400 line-clamp-1">
                                                    {lead.message}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${svc?.chip ?? "bg-slate-100 text-slate-600"}`}
                                            >
                                                {serviceName(lead.service)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-700">
                                            {lead.value ? formatIDR(lead.value, true) : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <form
                                                action={quickUpdateLead}
                                                className="inline-flex items-center"
                                            >
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={lead.id}
                                                />
                                                <select
                                                    name="status"
                                                    defaultValue={status}
                                                    className={`cursor-pointer rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold capitalize outline-none ${STATUS_COLOR[status] ?? STATUS_COLOR.new}`}
                                                >
                                                    {[
                                                        "new",
                                                        "contacted",
                                                        "qualified",
                                                        "unqualified",
                                                        "converted",
                                                    ].map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="ml-1 text-[10px] font-semibold text-slate-400 hover:text-slate-700"
                                                    title="Simpan status"
                                                >
                                                    Simpan
                                                </button>
                                            </form>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="whitespace-nowrap text-xs text-slate-500">
                                                {lead.owner ?? "-"}
                                            </p>
                                            {lead.source && (
                                                <p className="text-[10px] text-slate-400">
                                                    {SOURCE_ICON[lead.source] ?? "TAG"}{" "}
                                                    {lead.source}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <form
                                                action={quickUpdateLead}
                                                className="flex items-center gap-1"
                                            >
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={lead.id}
                                                />
                                                <input
                                                    name="next_action"
                                                    defaultValue={lead.next_action ?? ""}
                                                    placeholder="Tambah langkah berikutnya..."
                                                    className={`w-36 rounded-lg border px-2 py-1 text-xs ${
                                                        lead.next_action
                                                            ? "border-amber-200 bg-amber-50 text-amber-800"
                                                            : "border-slate-200"
                                                    }`}
                                                />
                                                <button
                                                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-800"
                                                    title="Simpan next step"
                                                >
                                                    Simpan
                                                </button>
                                            </form>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs font-semibold">
                                                {wa && (
                                                    <a
                                                        href={wa}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                        title="WhatsApp dengan opener siap pakai"
                                                    >
                                                        WA
                                                    </a>
                                                )}
                                                {lead.phone && (
                                                    <a
                                                        href={`tel:${lead.phone}`}
                                                        className="text-slate-500 hover:text-slate-700 transition-colors"
                                                    >
                                                        Call
                                                    </a>
                                                )}
                                                {mail && (
                                                    <a
                                                        href={mail}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                        title="Email dengan opener siap pakai"
                                                    >
                                                        Email
                                                    </a>
                                                )}
                                                {!wa && !lead.phone && !mail && (
                                                    <span className="text-slate-300">
                                                        tidak ada kontak
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="whitespace-nowrap text-xs text-slate-500">
                                                {fmt(lead.created_at)}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {timeAgo(lead.created_at)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {status !== "converted" && (
                                                    <form action={convertLeadToOpportunity}>
                                                        <input
                                                            type="hidden"
                                                            name="id"
                                                            value={lead.id}
                                                        />
                                                        <button className="whitespace-nowrap text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                                                            Convert
                                                        </button>
                                                    </form>
                                                )}
                                                <form action={deleteRow}>
                                                    <input
                                                        type="hidden"
                                                        name="table"
                                                        value="leads"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="id"
                                                        value={lead.id}
                                                    />
                                                    <button className="text-xs font-semibold text-rose-400 hover:text-rose-600 transition-colors">
                                                        Hapus
                                                    </button>
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

            {totalRows > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                        Menampilkan{" "}
                        <span className="font-semibold text-slate-700">
                            {from}-{to}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-slate-700">
                            {totalRows}
                        </span>
                    </p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            {safePage > 1 ? (
                                <Link
                                    href={pageHref(safePage - 1)}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Sebelumnya
                                </Link>
                            ) : (
                                <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-300">
                                    Sebelumnya
                                </span>
                            )}
                            <span className="text-xs font-semibold text-slate-500">
                                Halaman {safePage} dari {totalPages}
                            </span>
                            {safePage < totalPages ? (
                                <Link
                                    href={pageHref(safePage + 1)}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Berikutnya
                                </Link>
                            ) : (
                                <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-300">
                                    Berikutnya
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
