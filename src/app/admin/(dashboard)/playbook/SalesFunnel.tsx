import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { formatIDR } from "@/lib/services";

const FUNNEL = [
    { key: "new", label: "New", color: "from-slate-400 to-slate-500" },
    { key: "contacted", label: "Contacted", color: "from-blue-400 to-blue-500" },
    { key: "qualified", label: "Qualified", color: "from-indigo-400 to-indigo-500" },
    { key: "proposal", label: "Proposal", color: "from-violet-400 to-violet-500" },
    { key: "negotiation", label: "Negotiation", color: "from-amber-400 to-amber-500" },
];

export async function SalesFunnel() {
    const supabase = getSupabaseAdmin();
    let leadsCount = 0;
    let opps: { stage: string; value: number | null }[] = [];
    if (supabase) {
        const [{ count }, oppRes] = await Promise.all([
            supabase.from("leads").select("*", { count: "exact", head: true }),
            supabase.from("opportunities").select("stage, value"),
        ]);
        leadsCount = count ?? 0;
        opps = (oppRes.data ?? []) as typeof opps;
    }

    const by = (stage: string) => opps.filter((o) => o.stage === stage);
    const val = (rows: typeof opps) => rows.reduce((s, o) => s + (Number(o.value) || 0), 0);
    const won = by("won");
    const open = opps.filter((o) => o.stage !== "won" && o.stage !== "lost");
    const maxCount = Math.max(1, ...FUNNEL.map((f) => by(f.key).length));

    const node = (label: string, count: number, value: number | null, href: string, accent: string, sub?: string) => (
        <Link href={href} className="group flex-1 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${accent}`}>{count.toLocaleString()}</p>
            {value !== null && <p className="text-xs font-medium text-slate-500">{formatIDR(value, true)}</p>}
            {sub && <p className="mt-0.5 text-[10px] text-slate-400">{sub}</p>}
        </Link>
    );

    const Arrow = () => <div className="hidden shrink-0 self-center text-slate-300 sm:block">→</div>;

    return (
        <div>
            {/* Top-level journey */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                {node("Leads", leadsCount, null, "/admin/leads", "text-slate-900", "prospek masuk")}
                <Arrow />
                {node("Open Pipeline", open.length, val(open), "/admin/opportunities/board", "text-indigo-600", "deal aktif")}
                <Arrow />
                {node("Closed Won", won.length, val(won), "/admin/opportunities/board", "text-emerald-600", "→ service aktif 🎉")}
            </div>

            {/* Stage funnel */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Alur pipeline (live)</h3>
                    <Link href="/admin/opportunities/board" className="text-xs font-semibold text-blue-600 hover:underline">Buka Kanban →</Link>
                </div>
                <div className="mt-4 space-y-2">
                    {FUNNEL.map((f) => {
                        const rows = by(f.key);
                        const w = Math.max(8, Math.round((rows.length / maxCount) * 100));
                        return (
                            <Link key={f.key} href="/admin/opportunities/board" className="group flex items-center gap-3">
                                <span className="w-24 shrink-0 text-xs font-semibold capitalize text-slate-600">{f.label}</span>
                                <div className="h-8 flex-1 overflow-hidden rounded-lg bg-slate-100">
                                    <div className={`flex h-full items-center justify-end rounded-lg bg-gradient-to-r ${f.color} px-2 text-[11px] font-bold text-white transition-all group-hover:brightness-110`} style={{ width: `${w}%` }}>
                                        {rows.length}
                                    </div>
                                </div>
                                <span className="w-20 shrink-0 text-right text-xs font-medium text-slate-500">{formatIDR(val(rows), true)}</span>
                            </Link>
                        );
                    })}
                    {/* Won = active service */}
                    <div className="flex items-center gap-3 border-t border-slate-100 pt-2">
                        <span className="w-24 shrink-0 text-xs font-bold text-emerald-700">✅ Won / Aktif</span>
                        <div className="h-8 flex-1 overflow-hidden rounded-lg bg-emerald-50">
                            <div className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-2 text-[11px] font-bold text-white" style={{ width: `${Math.max(8, Math.round((won.length / maxCount) * 100))}%` }}>
                                {won.length}
                            </div>
                        </div>
                        <span className="w-20 shrink-0 text-right text-xs font-bold text-emerald-700">{formatIDR(val(won), true)}</span>
                    </div>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">Klik baris mana pun untuk buka Kanban dan geser deal antar tahap. Angka & nilai update otomatis.</p>
            </div>
        </div>
    );
}
