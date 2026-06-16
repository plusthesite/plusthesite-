"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatIDR } from "@/lib/services";
import type { DashboardStats } from "@/lib/adminStats";

function StatCard({ label, value, accent, href }: { label: string; value: string; accent: string; href?: string }) {
    const inner = (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className={`mt-2 text-3xl font-extrabold ${accent}`}>{value}</p>
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
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Subscribers" value={stats.subscribers.toLocaleString()} accent="text-blue-600" href="/admin/subscribers" />
                <StatCard label="Leads" value={stats.leads.toLocaleString()} accent="text-emerald-600" href="/admin/leads" />
                <StatCard label="Contacts" value={stats.contacts.toLocaleString()} accent="text-violet-600" href="/admin/contacts" />
                <StatCard label="Article Views" value={stats.views.toLocaleString()} accent="text-amber-600" href="/admin/analytics" />
            </div>

            {/* Revenue pipeline */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">Sales Pipeline</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Open Opportunities" value={stats.opportunities.toLocaleString()} accent="text-slate-900" href="/admin/opportunities" />
                <StatCard label="Open Pipeline" value={formatIDR(stats.openPipeline, true)} accent="text-indigo-600" href="/admin/opportunities" />
                <StatCard label="Weighted Forecast" value={formatIDR(stats.weightedPipeline, true)} accent="text-blue-600" href="/admin/opportunities" />
                <StatCard label="Won Revenue" value={formatIDR(stats.wonValue, true)} accent="text-emerald-600" href="/admin/opportunities" />
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
        </div>
    );
}
