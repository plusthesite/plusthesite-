import { getSupabaseAdmin } from "@/lib/supabase";
import { logActivity, completeTask, deleteActivity } from "@/app/admin/(dashboard)/activities/actions";

const TYPE_META: Record<string, { icon: string; label: string }> = {
    call: { icon: "📞", label: "Call" },
    whatsapp: { icon: "💬", label: "WhatsApp" },
    email: { icon: "✉️", label: "Email" },
    meeting: { icon: "🤝", label: "Meeting" },
    note: { icon: "📝", label: "Note" },
    task: { icon: "✅", label: "Task" },
};

interface Activity {
    id: string;
    type: string;
    subject: string | null;
    body: string | null;
    owner: string | null;
    status: string;
    due_at: string | null;
    done_at: string | null;
    created_at: string;
}

function fmt(d: string | null) {
    return d ? new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";
}

export async function ActivityPanel({
    parentType,
    parentId,
    parentLabel,
}: {
    parentType: "lead" | "opportunity";
    parentId: string;
    parentLabel: string;
}) {
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
            .from("activities")
            .select("id, type, subject, body, owner, status, due_at, done_at, created_at")
            .eq("parent_type", parentType)
            .eq("parent_id", parentId)
            .order("created_at", { ascending: false })
        : { data: [] };
    const items = (data ?? []) as Activity[];
    const now = Date.now();

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Activity &amp; Tasks</h2>

            {/* Log / schedule form */}
            <form action={logActivity} className="mt-4 grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
                <input type="hidden" name="parent_type" value={parentType} />
                <input type="hidden" name="parent_id" value={parentId} />
                <input type="hidden" name="parent_label" value={parentLabel} />
                <select name="type" defaultValue="call" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {Object.entries(TYPE_META).map(([v, m]) => <option key={v} value={v}>{m.icon} {m.label}</option>)}
                </select>
                <input name="owner" placeholder="Owner (optional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
                <input name="subject" placeholder="Subject (e.g. Intro call)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-2" />
                <textarea name="body" rows={2} placeholder="Notes…" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-2" />
                <label className="flex items-center gap-2 text-xs text-slate-500">
                    Follow-up due
                    <input type="datetime-local" name="due_at" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm" />
                    <span className="text-slate-400">(set = schedule a task; empty = log now)</span>
                </label>
                <div className="flex justify-end sm:col-span-2">
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save</button>
                </div>
            </form>

            {/* Timeline */}
            <div className="mt-5 space-y-3">
                {items.length === 0 && <p className="py-3 text-sm text-slate-400">No activity yet. Log your first touchpoint above.</p>}
                {items.map((a) => {
                    const meta = TYPE_META[a.type] ?? TYPE_META.note;
                    const overdue = a.status === "open" && a.due_at && new Date(a.due_at).getTime() < now;
                    return (
                        <div key={a.id} className="flex gap-3 border-b border-slate-100 pb-3">
                            <div className="text-lg leading-none">{meta.icon}</div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-800">{a.subject || meta.label}</span>
                                    {a.status === "open" && (
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${overdue ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                                            {overdue ? "OVERDUE" : "TASK"} · {fmt(a.due_at)}
                                        </span>
                                    )}
                                </div>
                                {a.body && <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-600">{a.body}</p>}
                                <p className="mt-0.5 text-xs text-slate-400">{meta.label}{a.owner ? ` · ${a.owner}` : ""} · {fmt(a.status === "done" ? a.done_at ?? a.created_at : a.created_at)}</p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                                {a.status === "open" && (
                                    <form action={completeTask}>
                                        <input type="hidden" name="id" value={a.id} />
                                        <input type="hidden" name="parent_type" value={parentType} />
                                        <input type="hidden" name="parent_id" value={parentId} />
                                        <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-800">Done</button>
                                    </form>
                                )}
                                <form action={deleteActivity}>
                                    <input type="hidden" name="id" value={a.id} />
                                    <input type="hidden" name="parent_type" value={parentType} />
                                    <input type="hidden" name="parent_id" value={parentId} />
                                    <button className="text-xs font-semibold text-rose-400 hover:text-rose-600">Delete</button>
                                </form>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
