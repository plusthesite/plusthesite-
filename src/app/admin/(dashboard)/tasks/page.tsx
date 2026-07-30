import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { completeTask } from "../activities/actions";

export const dynamic = "force-dynamic";

const TYPE_ICON: Record<string, string> = { call: "📞", whatsapp: "💬", email: "✉️", meeting: "🤝", note: "📝", task: "✅" };

interface Task {
    id: string;
    parent_type: string;
    parent_id: string;
    parent_label: string | null;
    type: string;
    subject: string | null;
    owner: string | null;
    due_at: string | null;
}

function fmt(d: string | null) {
    return d ? new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "No date";
}

export default async function TasksPage() {
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
            .from("activities")
            .select("id, parent_type, parent_id, parent_label, type, subject, owner, due_at")
            .eq("status", "open")
            .order("due_at", { ascending: true, nullsFirst: false })
        : { data: [] };
    const tasks = (data ?? []) as Task[];

    const now = new Date().getTime();
    const overdue = tasks.filter((t) => t.due_at && new Date(t.due_at).getTime() < now);

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tasks &amp; Follow-ups</h1>
                    <p className="mt-1 text-sm text-slate-500">Your open follow-ups across every lead and deal.</p>
                </div>
                <div className="flex gap-2">
                    {overdue.length > 0 && <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">{overdue.length} overdue</span>}
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{tasks.length} open</span>
                </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Task</th>
                            <th className="px-5 py-3 font-semibold">Related to</th>
                            <th className="px-5 py-3 font-semibold">Due</th>
                            <th className="px-5 py-3 font-semibold">Owner</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tasks.length === 0 && (
                            <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No open tasks. 🎉 Schedule follow-ups from a lead or opportunity.</td></tr>
                        )}
                        {tasks.map((t) => {
                            const isOverdue = t.due_at && new Date(t.due_at).getTime() < now;
                            const href = t.parent_type === "opportunity" ? `/admin/opportunities/${t.parent_id}` : `/admin/leads/${t.parent_id}`;
                            return (
                                <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3"><span className="mr-1.5">{TYPE_ICON[t.type] ?? "✅"}</span><span className="font-medium text-slate-800">{t.subject || "Follow up"}</span></td>
                                    <td className="px-5 py-3"><Link href={href} className="font-medium text-blue-600 hover:text-blue-800">{t.parent_label || "View"}</Link></td>
                                    <td className={`px-5 py-3 whitespace-nowrap ${isOverdue ? "font-semibold text-rose-600" : "text-slate-500"}`}>{fmt(t.due_at)}</td>
                                    <td className="px-5 py-3 text-slate-500">{t.owner ?? "—"}</td>
                                    <td className="px-5 py-3 text-right">
                                        <form action={completeTask}>
                                            <input type="hidden" name="id" value={t.id} />
                                            <input type="hidden" name="parent_type" value={t.parent_type} />
                                            <input type="hidden" name="parent_id" value={t.parent_id} />
                                            <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-800">Mark done</button>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
