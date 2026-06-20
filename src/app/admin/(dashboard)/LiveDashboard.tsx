"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatIDR } from "@/lib/services";
import type { DashboardStats } from "@/lib/adminStats";

function StatCard({ label, value, accent, href }: { label: string; value: string; accent: string; href?: string }) {
    const inner = (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">{label}</p>
            <p className={`mt-1.5 text-2xl font-extrabold sm:mt-2 sm:text-3xl ${accent}`}>{value}</p>
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function LiveDashboard({ initial }: { initial: DashboardStats }) {
    const [stats, setStats] = useState(initial);
    const [secondsAgo, setSecondsAgo] = useState(0);
    const fetchedAt = useRef(Date.now());

    useEffect(() => {
        let active = true;

        async function refresh() {
            try {
                const res = await fetch("/api/admin/stats", { cache: "no-store" });
                if (!res.ok) return;
                const data = (await res.json()) as DashboardStats;
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
        const tick = setInterval(() => setSecondsAgo(Math.round((Date.now() - fetchedAt.current) / 1000)), 1_000);
        // Refresh immediately when the tab regains focus.
        const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
        document.addEventListener("visibilitychange", onVisible);

        return () => {
            active = false;
            clearInterval(poll);
            clearInterval(tick);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, []);

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">Live overview of your site activity and sales pipeline.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Live · updated {secondsAgo}s ago
                </span>
            </div>

            {/* Follow-ups banner */}
            {stats.openTasks > 0 && (
                <Link
                    href="/admin/tasks"
                    className={`mt-5 flex items-center justify-between rounded-xl border px-5 py-3 text-sm font-semibold transition-colors ${stats.overdueTasks > 0 ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"}`}
                >
                    <span>📋 {stats.openTasks} open follow-up{stats.openTasks === 1 ? "" : "s"}{stats.overdueTasks > 0 ? ` · ${stats.overdueTasks} overdue` : ""}</span>
                    <span>View tasks →</span>
                </Link>
            )}

            {/* Engagement */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard label="Subscribers" value={stats.subscribers.toLocaleString()} accent="text-blue-600" href="/admin/subscribers" />
                <StatCard label="Leads" value={stats.leads.toLocaleString()} accent="text-emerald-600" href="/admin/leads" />
                <StatCard label="Contacts" value={stats.contacts.toLocaleString()} accent="text-violet-600" href="/admin/contacts" />
                <StatCard label="Article Views" value={stats.views.toLocaleString()} accent="text-amber-600" href="/admin/analytics" />
            </div>

            {/* Revenue pipeline */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">Sales Pipeline</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard label="Lead Pipeline" value={formatIDR(stats.leadPipeline, true)} accent="text-teal-600" href="/admin/priority" />
                <StatCard label="Open Opportunities" value={stats.opportunities.toLocaleString()} accent="text-slate-900" href="/admin/opportunities" />
                <StatCard label="Open Pipeline" value={formatIDR(stats.openPipeline, true)} accent="text-indigo-600" href="/admin/opportunities" />
                <StatCard label="Weighted Forecast" value={formatIDR(stats.weightedPipeline, true)} accent="text-blue-600" href="/admin/opportunities" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard label="Won Revenue" value={formatIDR(stats.wonValue, true)} accent="text-emerald-600" href="/admin/opportunities" />
                <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`} accent="text-purple-600" href="/admin/leads" />
                <StatCard label="Win Rate" value={`${stats.winRate}%`} accent="text-emerald-600" href="/admin/opportunities" />
                <StatCard label="Accounts" value={stats.accounts.toLocaleString()} accent="text-slate-600" href="/admin/accounts" />
            </div>

            {/* Trends */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {/* New leads — last 14 days */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">New Leads · last 14 days</h2>
                        <span className="text-xs text-slate-400">{stats.newLeads14d.reduce((s, d) => s + d.count, 0)} total</span>
                    </div>
                    <div className="mt-4 flex h-28 items-end gap-1">
                        {(() => {
                            const max = Math.max(1, ...stats.newLeads14d.map((d) => d.count));
                            return stats.newLeads14d.map((d, i) => (
                                <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-1" title={`${d.label}: ${d.count}`}>
                                    <span className="text-[9px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100">{d.count}</span>
                                    <div className="w-full rounded-t bg-blue-500/80 transition-all group-hover:bg-blue-600" style={{ height: `${Math.max(3, Math.round((d.count / max) * 100))}%` }} />
                                    <span className="text-[8px] text-slate-300">{i % 2 === 0 ? d.label : ""}</span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Pipeline by stage */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">Pipeline by Stage</h2>
                    <div className="mt-4 space-y-2.5">
                        {stats.stageBreakdown.length === 0 && <p className="py-3 text-sm text-slate-400">No deals yet.</p>}
                        {(() => {
                            const maxV = Math.max(1, ...stats.stageBreakdown.map((s) => s.value));
                            const color: Record<string, string> = { new: "bg-slate-400", contacted: "bg-blue-400", qualified: "bg-indigo-400", proposal: "bg-violet-400", negotiation: "bg-amber-400", won: "bg-emerald-500", lost: "bg-rose-400" };
                            return stats.stageBreakdown.map((s) => (
                                <div key={s.stage} className="flex items-center gap-3 text-xs">
                                    <span className="w-20 shrink-0 capitalize text-slate-500">{s.stage}</span>
                                    <div className="h-4 flex-1 overflow-hidden rounded bg-slate-100">
                                        <div className={`h-full ${color[s.stage] ?? "bg-slate-400"}`} style={{ width: `${Math.max(4, Math.round((s.value / maxV) * 100))}%` }} />
                                    </div>
                                    <span className="w-24 shrink-0 text-right font-semibold text-slate-700">{formatIDR(s.value, true)}</span>
                                    <span className="w-6 shrink-0 text-right text-slate-400">{s.count}</span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">🔥 Hot Opportunities</h2>
                    <div className="mt-3 divide-y divide-slate-100">
                        {stats.hotOpportunities.length === 0 && <p className="py-3 text-sm text-slate-400">No open deals.</p>}
                        {stats.hotOpportunities.map((o, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                                <span className="truncate text-slate-700">{o.company ?? o.name}</span>
                                <span className="ml-2 shrink-0 font-semibold text-slate-900">{formatIDR(o.value, true)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">Recent Subscribers</h2>
                    <div className="mt-3 divide-y divide-slate-100">
                        {stats.recentSubs.length === 0 && <p className="py-3 text-sm text-slate-400">No subscribers yet.</p>}
                        {stats.recentSubs.map((s, i) => (
                            <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                                <span className="truncate text-slate-700">{s.email}</span>
                                <span className="ml-3 shrink-0 text-xs text-slate-400">{fmtDate(s.created_at)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">Recent Contacts</h2>
                    <div className="mt-3 divide-y divide-slate-100">
                        {stats.recentContacts.length === 0 && <p className="py-3 text-sm text-slate-400">No contacts yet.</p>}
                        {stats.recentContacts.map((c, i) => (
                            <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                                <span className="truncate text-slate-700">{c.name} <span className="text-slate-400">· {c.email}</span></span>
                                <span className="ml-3 shrink-0 text-xs text-slate-400">{fmtDate(c.created_at)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rep leaderboard */}
            {stats.repLeaderboard.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Sales Rep Leaderboard</h2>
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Rep</th>
                                    <th className="px-5 py-3 font-semibold text-right">Leads</th>
                                    <th className="px-5 py-3 font-semibold text-right">Open Deals</th>
                                    <th className="px-5 py-3 font-semibold text-right">Pipeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats.repLeaderboard.map((r, i) => (
                                    <tr key={r.name} className="transition-colors hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">
                                                    {r.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-slate-800">{r.name}</span>
                                                {i === 0 && <span className="text-xs">👑</span>}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right font-semibold text-slate-700">{r.leads}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-slate-700">{r.deals}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-indigo-600">{formatIDR(r.pipeline, true)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
