import Link from "next/link";
import { formatIDR } from "@/lib/services";
import { getSupabaseAdmin } from "@/lib/supabase";

const FUNNEL = [
  { key: "new", label: "New", color: "from-slate-400 to-slate-500" },
  { key: "contacted", label: "Contacted", color: "from-sky-400 to-sky-500" },
  {
    key: "qualified",
    label: "Qualified",
    color: "from-indigo-400 to-indigo-500",
  },
  {
    key: "proposal",
    label: "Proposal",
    color: "from-violet-400 to-violet-500",
  },
  {
    key: "negotiation",
    label: "Negotiation",
    color: "from-amber-400 to-amber-500",
  },
];

function FunnelArrow() {
  return (
    <div className="hidden shrink-0 self-center text-slate-300 sm:block">
      {"->"}
    </div>
  );
}

export async function SalesFunnel() {
  const supabase = getSupabaseAdmin();
  let leadsCount = 0;
  let opportunities: { stage: string; value: number | null }[] = [];

  if (supabase) {
    const [{ count }, opportunitiesRes] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("opportunities").select("stage, value"),
    ]);
    leadsCount = count ?? 0;
    opportunities = (opportunitiesRes.data ?? []) as typeof opportunities;
  }

  const byStage = (stage: string) =>
    opportunities.filter((opportunity) => opportunity.stage === stage);
  const totalValue = (rows: typeof opportunities) =>
    rows.reduce(
      (sum, opportunity) => sum + (Number(opportunity.value) || 0),
      0,
    );

  const won = byStage("won");
  const open = opportunities.filter(
    (opportunity) =>
      opportunity.stage !== "won" && opportunity.stage !== "lost",
  );
  const maxCount = Math.max(
    1,
    ...FUNNEL.map((item) => byStage(item.key).length),
  );

  const node = (
    label: string,
    count: number,
    value: number | null,
    href: string,
    accent: string,
    sub?: string,
  ) => (
    <Link
      href={href}
      className="group flex-1 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-extrabold ${accent}`}>
        {count.toLocaleString()}
      </p>
      {value !== null && (
        <p className="text-xs font-medium text-slate-500">
          {formatIDR(value, true)}
        </p>
      )}
      {sub && <p className="mt-0.5 text-[10px] text-slate-400">{sub}</p>}
    </Link>
  );

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
        {node(
          "Leads",
          leadsCount,
          null,
          "/admin/leads",
          "text-slate-900",
          "prospek masuk",
        )}
        <FunnelArrow />
        {node(
          "Open Pipeline",
          open.length,
          totalValue(open),
          "/admin/opportunities/board",
          "text-indigo-600",
          "deal aktif",
        )}
        <FunnelArrow />
        {node(
          "Closed Won",
          won.length,
          totalValue(won),
          "/admin/opportunities/board",
          "text-emerald-600",
          "service aktif",
        )}
      </div>

      <div className="mt-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Pipeline flow
          </h3>
          <Link
            href="/admin/opportunities/board"
            className="text-xs font-semibold text-sky-600 hover:text-sky-800"
          >
            Buka Kanban {"->"}
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {FUNNEL.map((item) => {
            const rows = byStage(item.key);
            const width = Math.max(
              8,
              Math.round((rows.length / maxCount) * 100),
            );

            return (
              <Link
                key={item.key}
                href="/admin/opportunities/board"
                className="group flex items-center gap-3"
              >
                <span className="w-24 shrink-0 text-xs font-semibold capitalize text-slate-600">
                  {item.label}
                </span>
                <div className="h-8 flex-1 overflow-hidden rounded-xl bg-slate-100">
                  <div
                    className={`flex h-full items-center justify-end rounded-xl bg-gradient-to-r ${item.color} px-2 text-[11px] font-bold text-white transition-all group-hover:brightness-110`}
                    style={{ width: `${width}%` }}
                  >
                    {rows.length}
                  </div>
                </div>
                <span className="w-20 shrink-0 text-right text-xs font-medium text-slate-500">
                  {formatIDR(totalValue(rows), true)}
                </span>
              </Link>
            );
          })}

          <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
            <span className="w-24 shrink-0 text-xs font-bold text-emerald-700">
              Won / Aktif
            </span>
            <div className="h-8 flex-1 overflow-hidden rounded-xl bg-emerald-50">
              <div
                className="flex h-full items-center justify-end rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-2 text-[11px] font-bold text-white"
                style={{
                  width: `${Math.max(8, Math.round((won.length / maxCount) * 100))}%`,
                }}
              >
                {won.length}
              </div>
            </div>
            <span className="w-20 shrink-0 text-right text-xs font-bold text-emerald-700">
              {formatIDR(totalValue(won), true)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-slate-400">
          Klik baris mana pun untuk buka kanban dan geser deal antar tahap.
        </p>
      </div>
    </div>
  );
}
