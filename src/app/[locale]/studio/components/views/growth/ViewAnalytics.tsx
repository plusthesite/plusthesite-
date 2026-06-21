"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Megaphone, Image as ImageIcon, TrendingUp, Loader2, Lock, Users2, Activity, Wand2, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Stats {
    campaigns: number;
    assets: number;
    strategies: number;
    kols: number;
    avgScore: number;
    scores: { label: string; score: number }[];
}

interface ActivityItem {
    kind: "campaign" | "asset" | "strategy" | "kol";
    label: string;
    at: string;
}

const RELATIVE = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "baru saja";
    if (m < 60) return `${m} mnt lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    const d = Math.floor(h / 24);
    return `${d} hr lalu`;
};

const KIND_META: Record<ActivityItem["kind"], { icon: React.ReactNode; tag: string; cls: string }> = {
    campaign: { icon: <Megaphone size={14} />, tag: "Campaign", cls: "text-primary bg-primary/10" },
    asset: { icon: <Wand2 size={14} />, tag: "Aset AI", cls: "text-secondary bg-secondary/10" },
    strategy: { icon: <Target size={14} />, tag: "Strategy", cls: "text-tertiary bg-tertiary/10" },
    kol: { icon: <Users2 size={14} />, tag: "KOL", cls: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10" },
};

export const ViewAnalytics = () => {
    const [stats, setStats] = useState<Stats>({ campaigns: 0, assets: 0, strategies: 0, kols: 0, avgScore: 0, scores: [] });
    const [feed, setFeed] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(true);

    useEffect(() => {
        (async () => {
            if (!supabase) { setLoading(false); return; }
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { setAuthed(false); setLoading(false); return; }

            const [c, a, s, k] = await Promise.all([
                supabase.from("campaigns").select("name, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(8),
                supabase.from("generated_assets").select("prompt, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(8),
                supabase.from("strategies").select("title, result, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(12),
                supabase.from("studio_kol_shortlist").select("kol_name, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(8),
            ]);

            const strat = (s.data ?? []) as { title: string | null; result: { score?: number } | null; created_at: string }[];
            const scoreVals = strat.map((x) => x.result?.score ?? 0).filter((n) => n > 0);
            const avg = scoreVals.length ? Math.round(scoreVals.reduce((p, n) => p + n, 0) / scoreVals.length) : 0;

            setStats({
                campaigns: c.count ?? 0,
                assets: a.count ?? 0,
                strategies: s.count ?? 0,
                kols: k.count ?? 0,
                avgScore: avg,
                scores: strat.slice(0, 12).reverse().map((x, i) => ({ label: x.title?.slice(0, 14) || `#${i + 1}`, score: x.result?.score ?? 0 })),
            });

            const merged: ActivityItem[] = [
                ...(c.data ?? []).map((x: { name: string | null; created_at: string }) => ({ kind: "campaign" as const, label: x.name || "Campaign baru", at: x.created_at })),
                ...(a.data ?? []).map((x: { prompt: string | null; created_at: string }) => ({ kind: "asset" as const, label: x.prompt?.slice(0, 48) || "Aset baru", at: x.created_at })),
                ...strat.map((x) => ({ kind: "strategy" as const, label: x.title || "Analisis", at: x.created_at })),
                ...(k.data ?? []).map((x: { kol_name: string | null; created_at: string }) => ({ kind: "kol" as const, label: x.kol_name || "KOL", at: x.created_at })),
            ].sort((p, q) => new Date(q.at).getTime() - new Date(p.at).getTime()).slice(0, 10);
            setFeed(merged);

            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <div className="flex h-64 items-center justify-center text-muted"><Loader2 className="animate-spin" size={28} /></div>;
    }
    if (!authed) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-muted">
                <Lock size={32} /><p className="text-sm">Masuk untuk melihat analitik aktivitas Anda.</p>
            </div>
        );
    }

    const cards = [
        { l: "Campaign", v: stats.campaigns, icon: <Megaphone size={18} className="text-primary" />, c: "text-primary" },
        { l: "Aset AI", v: stats.assets, icon: <ImageIcon size={18} className="text-secondary" />, c: "text-secondary" },
        { l: "Skor Viral Rata-rata", v: stats.avgScore ? `${stats.avgScore}/100` : "—", icon: <TrendingUp size={18} className="text-tertiary" />, c: "text-tertiary" },
        { l: "KOL Shortlist", v: stats.kols, icon: <Users2 size={18} className="text-yellow-500" />, c: "text-yellow-600 dark:text-yellow-400" },
    ];
    const maxScore = Math.max(100, ...stats.scores.map((s) => s.score));
    const empty = stats.campaigns === 0 && stats.assets === 0 && stats.strategies === 0 && stats.kols === 0;

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((s, i) => (
                    <div key={i} className="bg-card-bg border border-border p-5 rounded-2xl backdrop-blur-sm hover:bg-surface-hover transition-colors shadow-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted uppercase font-bold">{s.l}</p>
                            {s.icon}
                        </div>
                        <h3 className={`mt-2 text-3xl font-black ${s.c}`}>{s.v}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-card-bg border border-border p-6 rounded-2xl shadow-xl transition-colors">
                    <h3 className="font-bold text-foreground flex items-center gap-2"><BarChart3 size={18} className="text-primary" /> Skor Viral — Analisis Terakhir</h3>
                    {stats.scores.length === 0 ? (
                        <p className="mt-6 py-8 text-center text-sm text-muted">Belum ada analisis. Coba <span className="font-semibold text-foreground">Strategy → Check Score</span> untuk mulai mengisi grafik ini.</p>
                    ) : (
                        <div className="mt-6 flex h-56 items-end gap-2">
                            {stats.scores.map((s, i) => (
                                <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-2" title={`${s.label}: ${s.score}`}>
                                    <span className="text-[10px] font-bold text-muted opacity-0 group-hover:opacity-100">{s.score}</span>
                                    <div className="w-full rounded-t-sm bg-gradient-to-t from-primary/50 to-primary-light transition-all group-hover:from-primary group-hover:to-primary-light" style={{ height: `${Math.max(4, (s.score / maxScore) * 100)}%` }} />
                                    <span className="w-full truncate text-center text-[9px] text-muted">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-card-bg border border-border p-6 rounded-2xl shadow-xl transition-colors">
                    <h3 className="font-bold text-foreground flex items-center gap-2"><Activity size={18} className="text-primary" /> Aktivitas Terbaru</h3>
                    {feed.length === 0 ? (
                        <p className="mt-6 py-8 text-center text-sm text-muted">Belum ada aktivitas.</p>
                    ) : (
                        <div className="mt-5 space-y-3">
                            {feed.map((it, i) => {
                                const m = KIND_META[it.kind];
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.cls}`}>{m.icon}</span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm text-foreground">{it.label}</p>
                                            <p className="text-[10px] text-muted">{m.tag} · {RELATIVE(it.at)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {empty && (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                    Mulai dengan membuat <span className="font-semibold text-foreground">Campaign</span>, generate <span className="font-semibold text-foreground">Aset AI</span>, cek skor di <span className="font-semibold text-foreground">Strategy</span>, atau simpan <span className="font-semibold text-foreground">KOL</span> — data Anda akan muncul di sini secara real-time.
                </div>
            )}
        </div>
    );
};
