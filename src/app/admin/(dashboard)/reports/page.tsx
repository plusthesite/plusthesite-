import { formatIDR, SERVICES } from "@/lib/services";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Lead {
  service: string | null;
  status: string | null;
  source: string | null;
  value: number | null;
  created_at: string;
}

interface Opportunity {
  name: string | null;
  service: string | null;
  stage: string;
  value: number;
  owner: string | null;
  source: string | null;
  created_at: string;
  updated_at: string | null;
}

const SOURCE_LABEL: Record<string, string> = {
  "google-places": "Google Places",
  "contact-form": "Contact Form",
  manual: "Manual",
  lead: "Converted Lead",
  website: "Website",
  referral: "Referral",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  blog: "Blog",
  unknown: "Unknown",
};

const REFERENCE_DATE = new Date("2026-07-30T00:00:00.000+07:00");

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default async function ReportsPage() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Supabase not configured.
      </div>
    );
  }

  const [leadsRes, opportunitiesRes] = await Promise.all([
    supabase.from("leads").select("service, status, source, value, created_at"),
    supabase
      .from("opportunities")
      .select(
        "name, service, stage, value, owner, source, created_at, updated_at",
      ),
  ]);

  const leads = (leadsRes.data ?? []) as Lead[];
  const opportunities = (opportunitiesRes.data ?? []) as Opportunity[];

  const servicePerformance = SERVICES.map((service) => {
    const serviceLeads = leads.filter((lead) => lead.service === service.slug);
    const serviceOpps = opportunities.filter(
      (opp) => opp.service === service.slug,
    );
    const openOpps = serviceOpps.filter(
      (opp) => opp.stage !== "won" && opp.stage !== "lost",
    );
    const wonOpps = serviceOpps.filter((opp) => opp.stage === "won");
    const lostOpps = serviceOpps.filter((opp) => opp.stage === "lost");
    const pipeline = openOpps.reduce(
      (sum, opp) => sum + (Number(opp.value) || 0),
      0,
    );
    const wonRevenue = wonOpps.reduce(
      (sum, opp) => sum + (Number(opp.value) || 0),
      0,
    );
    const winRate =
      wonOpps.length + lostOpps.length > 0
        ? Math.round(
            (wonOpps.length / (wonOpps.length + lostOpps.length)) * 100,
          )
        : 0;
    const conversionRate =
      serviceLeads.length > 0
        ? Math.round(
            (serviceLeads.filter((lead) => lead.status === "converted").length /
              serviceLeads.length) *
              100,
          )
        : 0;

    return {
      id: service.slug,
      name: service.en,
      leads: serviceLeads.length,
      opportunities: serviceOpps.length,
      pipeline,
      wonRevenue,
      winRate,
      conversionRate,
    };
  }).sort((a, b) => b.pipeline - a.pipeline);

  const sourceMap = new Map<
    string,
    { total: number; converted: number; value: number }
  >();
  for (const lead of leads) {
    const source = lead.source || "unknown";
    const current = sourceMap.get(source) ?? {
      total: 0,
      converted: 0,
      value: 0,
    };
    current.total += 1;
    if (lead.status === "converted") current.converted += 1;
    current.value += Number(lead.value) || 0;
    sourceMap.set(source, current);
  }

  const sourcePerformance = Array.from(sourceMap.entries())
    .map(([source, data]) => ({
      source,
      ...data,
      conversionRate:
        data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const staleDeals = opportunities
    .filter((opp) => opp.stage !== "won" && opp.stage !== "lost")
    .map((opp) => {
      const lastTouch = opp.updated_at
        ? new Date(opp.updated_at)
        : new Date(opp.created_at);
      const daysStale = Math.floor(
        (REFERENCE_DATE.getTime() - lastTouch.getTime()) / 86_400_000,
      );
      return { ...opp, daysStale };
    })
    .filter((opp) => opp.daysStale >= 14)
    .sort((a, b) => b.daysStale - a.daysStale)
    .slice(0, 8);

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(REFERENCE_DATE);
    date.setMonth(REFERENCE_DATE.getMonth() - (5 - index));
    const key = monthKey(date);
    return {
      label: date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      leads: leads.filter((lead) => lead.created_at.startsWith(key)).length,
      opportunities: opportunities.filter((opp) =>
        opp.created_at.startsWith(key),
      ).length,
      won: opportunities.filter(
        (opp) => opp.stage === "won" && opp.created_at.startsWith(key),
      ).length,
    };
  });

  const maxPipeline = Math.max(
    ...servicePerformance.map((item) => item.pipeline),
    1,
  );
  const maxSourceLeads = Math.max(
    ...sourcePerformance.map((item) => item.total),
    1,
  );
  const maxMonthLeads = Math.max(...months.map((month) => month.leads), 1);
  const totalPipeline = servicePerformance.reduce(
    (sum, item) => sum + item.pipeline,
    0,
  );
  const totalWonRevenue = servicePerformance.reduce(
    (sum, item) => sum + item.wonRevenue,
    0,
  );
  const activeServices = servicePerformance.filter(
    (item) => item.leads > 0,
  ).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Revenue reports
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Sales reports that surface service performance, lead quality, and
              stale pipeline risk.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Satu layar untuk membaca performa per service, kualitas source,
              ritme akuisisi, dan deal yang terlalu lama tidak disentuh.
            </p>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Data coverage
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {leads.length.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                leads / {opportunities.length.toLocaleString()} deals
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/70">
                Won revenue
              </p>
              <p className="mt-3 text-3xl font-black text-emerald-700">
                {formatIDR(totalWonRevenue, true)}
              </p>
              <p className="mt-2 text-xs text-emerald-800/70">
                {activeServices} layanan aktif
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Open pipeline
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {formatIDR(totalPipeline, true)}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
              Best service
            </p>
            <p className="mt-3 text-xl font-black text-sky-700">
              {servicePerformance[0]?.name ?? "No data"}
            </p>
            <p className="mt-2 text-xs text-sky-800/70">
              pipeline tertinggi sekarang
            </p>
          </div>
          <div className="rounded-2xl border border-violet-200/80 bg-violet-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700/70">
              Top source
            </p>
            <p className="mt-3 text-xl font-black text-violet-700">
              {SOURCE_LABEL[sourcePerformance[0]?.source ?? "unknown"]}
            </p>
            <p className="mt-2 text-xs text-violet-800/70">
              volume lead tertinggi
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
              Stale risk
            </p>
            <p className="mt-3 text-3xl font-black text-amber-700">
              {staleDeals.length}
            </p>
            <p className="mt-2 text-xs text-amber-800/70">
              deal belum disentuh 14+ hari
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Performance by service
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Perbandingan lead volume, conversion, pipeline, dan won revenue.
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold text-right">Leads</th>
                  <th className="px-5 py-3 font-semibold text-right">Conv</th>
                  <th className="px-5 py-3 font-semibold text-right">Deals</th>
                  <th className="px-5 py-3 font-semibold text-right">Win</th>
                  <th className="px-5 py-3 font-semibold">Pipeline</th>
                  <th className="px-5 py-3 font-semibold text-right">Won</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {servicePerformance.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700">
                      {item.leads}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          item.conversionRate >= 15
                            ? "bg-emerald-50 text-emerald-700"
                            : item.conversionRate > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {item.conversionRate}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700">
                      {item.opportunities}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          item.winRate >= 50
                            ? "bg-emerald-50 text-emerald-700"
                            : item.winRate > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {item.winRate}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                            style={{
                              width: `${Math.max(
                                (item.pipeline / maxPipeline) * 100,
                                2,
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-sky-700">
                          {formatIDR(item.pipeline, true)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">
                      {formatIDR(item.wonRevenue, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Lead source analysis
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Volume, conversion, dan value by source.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {sourcePerformance.map((item) => (
              <div
                key={item.source}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-[160px_minmax(0,1fr)_88px]"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {SOURCE_LABEL[item.source] ?? item.source}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatIDR(item.value, true)} est. value
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{item.total} leads</span>
                    <span>{item.conversionRate}% converted</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                      style={{
                        width: `${Math.max(
                          (item.total / maxSourceLeads) * 100,
                          4,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end text-sm font-bold text-slate-700">
                  {item.total}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Monthly trend
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Snapshot 6 bulan terakhir untuk lead inflow.
            </p>
          </div>

          <div className="mt-5 flex h-48 items-end gap-3">
            {months.map((month) => (
              <div
                key={month.label}
                className="group flex flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] font-semibold text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                  {month.leads}
                </span>
                <div className="relative flex w-full items-end justify-center">
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-sky-500 to-cyan-400 transition-all group-hover:from-sky-600 group-hover:to-cyan-500"
                    style={{
                      height: `${Math.max(
                        10,
                        (month.leads / maxMonthLeads) * 100,
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-semibold text-slate-600">
                    {month.label}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {month.opportunities} opp / {month.won} won
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {staleDeals.length > 0 && (
        <section className="rounded-[1.75rem] border border-amber-200/80 bg-white/95 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
                Stale deals
              </h2>
              <p className="mt-1 text-sm text-amber-800/70">
                Open deal yang tidak bergerak selama 14 hari atau lebih.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-amber-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-amber-50 text-xs uppercase tracking-[0.18em] text-amber-700">
                <tr>
                  <th className="px-5 py-3 font-semibold">Deal</th>
                  <th className="px-5 py-3 font-semibold">Stage</th>
                  <th className="px-5 py-3 font-semibold text-right">Value</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 font-semibold text-right">Stale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {staleDeals.map((deal) => (
                  <tr
                    key={`${deal.name}-${deal.created_at}`}
                    className="hover:bg-amber-50/60"
                  >
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      {deal.name ?? deal.service ?? "Deal"}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-600">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">
                      {formatIDR(deal.value, true)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {deal.owner ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          deal.daysStale >= 30
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {deal.daysStale}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
