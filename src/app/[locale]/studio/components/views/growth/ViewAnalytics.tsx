"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Megaphone, Image as ImageIcon, TrendingUp, Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Stats {
    campaigns: number;
    assets: number;
    strategies: number;
    avgScore: number;
    scores: { label: string; score: number }[];
}

export const ViewAnalytics = () => {
    const [stats, setStats] = useState<Stats>({ campaigns: 0, assets: 0, strategies: 0, avgScore: 0, scores: [] });
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(true);

    useEffect(() => {
        (async () => {
            if (!supabase) { setLoading(false); return; }
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { setAuthed(false); setLoading(false); return; }

            const [c, a, s] = await Promise.all([
                supabase.from("campaigns").select("*", { count: "exact", head: true }),
                supabase.from("generated_assets").select("*", { count: "exact", head: true }),
                supabase.from("strategies").select("title, result, created_at").order("created_at", { ascending: false }).limit(12),
            ]);
            const strat = (s.data ?? []) as { title: string | null; result: { score?: number } | null }[];
            const scoreVals = strat.map((x) => x.result?.score ?? 0).filter((n) => n > 0);
            const avg = scoreVals.length ? Math.round(scoreVals.reduce((p, n) => p + n, 0) / scoreVals.length) : 0;

            setStats({
                campaigns: c.count ?? 0,
                assets: a.count ?? 0,
                strategies: strat.length,
                avgScore: avg,
                scores: strat.slice(0, 12).reverse().map((x, i) => ({ label: x.title?.slice(0, 14) || `#${i + 1}`, score: x.result?.score ?? 0 })),
            });
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
        { l: "Campaign Dibuat", v: stats.campaigns, icon: <Megaphone size={18} className="text-primary" />, c: "text-primary" },
        { l: "Aset AI", v: stats.assets, icon: <ImageIcon size={18} className="text-secondary" />, c: "text-secondary" },
        { l: "Skor Viral Rata-rata", v: stats.avgScore ? `${stats.avgScore}/100` : "—", icon: <TrendingUp size={18} className="text-tertiary" />, c: "text-tertiary" },
    ];
    const maxScore = Math.max(100, ...stats.scores.map((s) => s.score));
    const empty = stats.campaigns === 0 && stats.assets === 0 && stats.strategies === 0;

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <div className="bg-card-bg border border-border p-6 rounded-2xl shadow-xl transition-colors">
                <h3 className="font-bold text-foreground flex items-center gap-2"><BarChart3 size={18} className="text-primary" /> Skor Viral — Analisis Terakhir</h3>
                {stats.scores.length === 0 ? (
                    <p className="mt-6 py-8 text-center text-sm text-muted">Belum ada analisis. Coba <span className="font-semibold text-foreground">Strategy → Check Score</span> untuk mulai mengisi grafik ini.</p>
                ) : (
                    <div className="mt-6 flex h-64 items-end gap-2">
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

            {empty && (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                    Mulai dengan membuat <span className="font-semibold text-foreground">Campaign</span>, generate <span className="font-semibold text-foreground">Aset AI</span>, atau cek skor di <span className="font-semibold text-foreground">Strategy</span> — data Anda akan muncul di sini secara real-time.
                </div>
            )}
        </div>
    );
};
