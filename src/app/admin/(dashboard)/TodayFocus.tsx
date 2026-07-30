import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { serviceName, formatIDR } from "@/lib/services";
import { scoreLead, scoreTier } from "@/lib/leadScore";
import { completeTask } from "./activities/actions";

interface Lead {
    id: string; name: string | null; company: string | null; phone: string | null; email: string | null;
    website: string | null; service: string | null; status: string | null; value: number | null;
    source: string | null; created_at: string;
}
interface Task {
    id: string; parent_type: string; parent_id: string; parent_label: string | null;
    subject: string | null; type: string; due_at: string | null;
}

function wa(phone: string | null) {
    if (!phone) return null;
    const d = phone.replace(/[^\d]/g, "");
    return d ? `https://wa.me/${d}` : null;
}
const TYPE_ICON: Record<string, string> = { call: "📞", whatsapp: "💬", email: "✉️", meeting: "🤝", note: "📝", task: "✅" };

export async function TodayFocus() {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);
    const [leadRes, taskRes] = await Promise.all([
        supabase.from("leads").select("id, name, company, phone, email, website, service, status, value, source, created_at").neq("status", "converted").order("value", { ascending: false }).limit(400),
        supabase.from("activities").select("id, parent_type, parent_id, parent_label, subject, type, due_at").eq("status", "open").lte("due_at", endOfToday.toISOString()).order("due_at", { ascending: true }).limit(6),
    ]);

    const topLeads = ((leadRes.data ?? []) as Lead[])
        .map((l) => ({ l, ...scoreLead(l) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    const tasks = (taskRes.data ?? []) as Task[];
    const now = new Date().getTime();

    return (
        <section className="mt-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
                    <div>
                        <h2 className="text-base font-bold">🎯 Today&apos;s Focus</h2>
                        <p className="text-xs text-blue-100">Kerjakan ini dulu hari ini — lead terpanas & follow-up jatuh tempo.</p>
                    </div>
                    <Link href="/admin/priority" className="hidden shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25 sm:block">Semua prioritas →</Link>
                </div>

                <div className="grid gap-0 lg:grid-cols-2 lg:divide-x lg:divide-slate-100">
                    {/* Hot leads */}
                    <div className="p-5">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">🔥 Lead prioritas <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] text-rose-600">{topLeads.length}</span></h3>
                        <div className="mt-3 space-y-2">
                            {topLeads.length === 0 && <p className="py-4 text-center text-sm text-slate-400">Belum ada lead.</p>}
                            {topLeads.map(({ l, score }) => {
                                const tier = scoreTier(score);
                                const w = wa(l.phone);
                                return (
                                    <div key={l.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 transition-colors hover:bg-slate-50">
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${tier.color}`}>{score}</div>
                                        <div className="min-w-0 flex-1">
                                            <Link href={`/admin/leads/${l.id}`} className="block truncate text-sm font-semibold text-slate-800 hover:text-blue-600">{l.company || l.name || l.email || "Lead"}</Link>
                                            <p className="truncate text-xs text-slate-400">{serviceName(l.service)} · {formatIDR(l.value ?? 0, true)}</p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2 text-xs font-semibold">
                                            {w && <a href={w} target="_blank" rel="noopener noreferrer" className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 hover:bg-emerald-100">WA</a>}
                                            {l.phone && <a href={`tel:${l.phone}`} className="hidden rounded-md bg-slate-100 px-2 py-1 text-slate-600 hover:bg-slate-200 sm:block">Call</a>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Due tasks */}
                    <div className="border-t border-slate-100 p-5 lg:border-t-0">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">⏰ Follow-up jatuh tempo <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-600">{tasks.length}</span></h3>
                        <div className="mt-3 space-y-2">
                            {tasks.length === 0 && <p className="py-4 text-center text-sm text-slate-400">🎉 Tidak ada yang jatuh tempo. Mantap!</p>}
                            {tasks.map((t) => {
                                const overdue = t.due_at && new Date(t.due_at).getTime() < now;
                                const href = t.parent_type === "opportunity" ? `/admin/opportunities/${t.parent_id}` : `/admin/leads/${t.parent_id}`;
                                return (
                                    <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 transition-colors hover:bg-slate-50">
                                        <span className="text-base">{TYPE_ICON[t.type] ?? "✅"}</span>
                                        <div className="min-w-0 flex-1">
                                            <Link href={href} className="block truncate text-sm font-semibold text-slate-800 hover:text-blue-600">{t.subject || "Follow up"}</Link>
                                            <p className="truncate text-xs text-slate-400">{t.parent_label ?? ""}{t.due_at ? ` · ${overdue ? "⚠️ telat" : "hari ini"}` : ""}</p>
                                        </div>
                                        <form action={completeTask}>
                                            <input type="hidden" name="id" value={t.id} />
                                            <input type="hidden" name="parent_type" value={t.parent_type} />
                                            <input type="hidden" name="parent_id" value={t.parent_id} />
                                            <button className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Done</button>
                                        </form>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
