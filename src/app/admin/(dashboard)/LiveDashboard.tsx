"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DashboardStats } from "@/lib/adminStats";
import { formatIDR } from "@/lib/services";

function StatCard({
  label,
  value,
  accent,
  href,
  hint,
}: {
  label: string;
  value: string;
  accent: string;
  href?: string;
  hint?: string;
}) {
  const inner = (
    <div
      className="rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
      title={hint}
    >
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-extrabold sm:text-3xl ${accent}`}>
        {value}
      </p>
      {hint ? (
        <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

function fmtDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LiveDashboard({ initial }: { initial: DashboardStats }) {
  const [stats, setStats] = useState(initial);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const fetchedAt = useRef(0);

  useEffect(() => {
    let active = true;
    fetchedAt.current = Date.now();

    async function refresh() {
      try {
        const response = await fetch("/api/admin/stats", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as DashboardStats;
        if (active) {
          setStats(data);
          fetchedAt.current = Date.now();
          setSecondsAgo(0);
        }
      } catch {
        /* keep last good data */
      }
    }

    const poll = setInterval(refresh, 12_000);
    const tick = setInterval(() => {
      setSecondsAgo(Math.round((Date.now() - fetchedAt.current) / 1000));
    }, 1_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      clearInterval(poll);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Live control room
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Dashboard operasional yang terus bergerak.
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pantau traffic, audience, pipeline, dan follow-up dari satu view
              yang terus refresh otomatis.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live / updated {secondsAgo}s ago
          </span>
        </div>

        {stats.openTasks > 0 ? (
          <Link
            href="/admin/tasks"
            className={`mt-5 flex items-center justify-between rounded-2xl border px-5 py-3 text-sm font-semibold transition-colors ${
              stats.overdueTasks > 0
                ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            <span>
              {stats.openTasks} open follow-up
              {stats.openTasks === 1 ? "" : "s"}
              {stats.overdueTasks > 0 ? ` / ${stats.overdueTasks} overdue` : ""}
            </span>
            <span>View tasks -&gt;</span>
          </Link>
        ) : null}
      </section>

      <section>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Subscribers"
            value={stats.subscribers.toLocaleString()}
            accent="text-sky-600"
            href="/admin/subscribers"
          />
          <StatCard
            label="Leads"
            value={stats.leads.toLocaleString()}
            accent="text-emerald-600"
            href="/admin/leads"
          />
          <StatCard
            label="Contacts"
            value={stats.contacts.toLocaleString()}
            accent="text-violet-600"
            href="/admin/contacts"
          />
          <StatCard
            label="Article Views"
            value={stats.views.toLocaleString()}
            accent="text-amber-600"
            href="/admin/analytics"
          />
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Sales pipeline
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Lead Pipeline"
            value={formatIDR(stats.leadPipeline, true)}
            accent="text-teal-600"
            href="/admin/priority"
            hint="Potensi indikatif, belum dihitung sebagai revenue."
          />
          <StatCard
            label="Open Opportunities"
            value={stats.opportunities.toLocaleString()}
            accent="text-slate-900"
            href="/admin/opportunities"
          />
          <StatCard
            label="Open Pipeline"
            value={formatIDR(stats.openPipeline, true)}
            accent="text-indigo-600"
            href="/admin/opportunities"
            hint="Total nilai deal terbuka."
          />
          <StatCard
            label="Weighted Forecast"
            value={formatIDR(stats.weightedPipeline, true)}
            accent="text-sky-600"
            href="/admin/opportunities"
            hint="Nilai pipeline yang sudah ditimbang probabilitas."
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Won Revenue"
            value={formatIDR(stats.wonValue, true)}
            accent="text-emerald-600"
            href="/admin/opportunities"
            hint="Deal yang sudah close won."
          />
          <StatCard
            label="Conversion Rate"
            value={`${stats.conversionRate}%`}
            accent="text-fuchsia-600"
            href="/admin/leads"
          />
          <StatCard
            label="Win Rate"
            value={`${stats.winRate}%`}
            accent="text-emerald-600"
            href="/admin/opportunities"
          />
          <StatCard
            label="Accounts"
            value={stats.accounts.toLocaleString()}
            accent="text-slate-600"
            href="/admin/accounts"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                New leads
              </h2>
              <p className="mt-1 text-sm text-slate-500">14 hari terakhir</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {stats.newLeads14d.reduce((sum, item) => sum + item.count, 0)}{" "}
              total
            </span>
          </div>
          <div className="mt-5 flex h-32 items-end gap-1.5">
            {(() => {
              const max = Math.max(
                1,
                ...stats.newLeads14d.map((item) => item.count),
              );
              return stats.newLeads14d.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="group flex flex-1 flex-col items-center justify-end gap-1.5"
                  title={`${item.label}: ${item.count}`}
                >
                  <span className="text-[10px] font-semibold text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                    {item.count}
                  </span>
                  <div className="w-full overflow-hidden rounded-t-xl bg-slate-100">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-sky-500 via-cyan-500 to-indigo-500 transition-all duration-300 group-hover:brightness-110"
                      style={{
                        height: `${Math.max(8, Math.round((item.count / max) * 104))}%`,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-300">
                    {index % 2 === 0 ? item.label : ""}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Pipeline by stage
          </h2>
          <div className="mt-4 space-y-3">
            {stats.stageBreakdown.length === 0 ? (
              <p className="py-3 text-sm text-slate-400">No deals yet.</p>
            ) : null}
            {(() => {
              const maxValue = Math.max(
                1,
                ...stats.stageBreakdown.map((item) => item.value),
              );
              const colorMap: Record<string, string> = {
                new: "from-slate-400 to-slate-500",
                contacted: "from-sky-400 to-cyan-500",
                qualified: "from-indigo-400 to-indigo-500",
                proposal: "from-violet-400 to-violet-500",
                negotiation: "from-amber-400 to-orange-500",
                won: "from-emerald-500 to-emerald-600",
                lost: "from-rose-400 to-rose-500",
              };

              return stats.stageBreakdown.map((item) => (
                <div
                  key={item.stage}
                  className="flex items-center gap-3 text-xs"
                >
                  <span className="w-24 shrink-0 capitalize text-slate-500">
                    {item.stage}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colorMap[item.stage] ?? "from-slate-400 to-slate-500"}`}
                      style={{
                        width: `${Math.max(
                          4,
                          Math.round((item.value / maxValue) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right font-semibold text-slate-700">
                    {formatIDR(item.value, true)}
                  </span>
                  <span className="w-6 shrink-0 text-right text-slate-400">
                    {item.count}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Hot opportunities
          </h2>
          <div className="mt-3 divide-y divide-slate-100">
            {stats.hotOpportunities.length === 0 ? (
              <p className="py-3 text-sm text-slate-400">No open deals.</p>
            ) : null}
            {stats.hotOpportunities.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <span className="truncate text-slate-700">
                  {item.company ?? item.name}
                </span>
                <span className="ml-2 shrink-0 font-semibold text-slate-900">
                  {formatIDR(item.value, true)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Recent subscribers
          </h2>
          <div className="mt-3 divide-y divide-slate-100">
            {stats.recentSubs.length === 0 ? (
              <p className="py-3 text-sm text-slate-400">No subscribers yet.</p>
            ) : null}
            {stats.recentSubs.map((item, index) => (
              <div
                key={`${item.email}-${index}`}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className="truncate text-slate-700">{item.email}</span>
                <span className="ml-3 shrink-0 text-xs text-slate-400">
                  {fmtDate(item.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Recent contacts
          </h2>
          <div className="mt-3 divide-y divide-slate-100">
            {stats.recentContacts.length === 0 ? (
              <p className="py-3 text-sm text-slate-400">No contacts yet.</p>
            ) : null}
            {stats.recentContacts.map((item, index) => (
              <div
                key={`${item.email}-${index}`}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className="truncate text-slate-700">
                  {item.name}{" "}
                  <span className="text-slate-400">/ {item.email}</span>
                </span>
                <span className="ml-3 shrink-0 text-xs text-slate-400">
                  {fmtDate(item.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {stats.repLeaderboard.length > 0 ? (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Sales rep leaderboard
          </h2>
          <div className="mt-3 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Rep</th>
                  <th className="px-5 py-3 font-semibold text-right">Leads</th>
                  <th className="px-5 py-3 font-semibold text-right">
                    Open Deals
                  </th>
                  <th className="px-5 py-3 font-semibold text-right">
                    Pipeline
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.repLeaderboard.map((item, index) => (
                  <tr
                    key={item.name}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-xs font-bold text-white">
                          {item.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {item.name}
                        </span>
                        {index === 0 ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
                            Top
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">
                      {item.leads}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">
                      {item.deals}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-indigo-600">
                      {formatIDR(item.pipeline, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
