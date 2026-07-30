import { getSupabaseAdmin } from "@/lib/supabase";
import {
    completeTask,
    deleteActivity,
    logActivity,
} from "@/app/admin/(dashboard)/activities/actions";

const TYPE_META: Record<string, { icon: string; label: string }> = {
    call: { icon: "Phone", label: "Call" },
    whatsapp: { icon: "Chat", label: "WhatsApp" },
    email: { icon: "Mail", label: "Email" },
    meeting: { icon: "Meet", label: "Meeting" },
    note: { icon: "Note", label: "Note" },
    task: { icon: "Task", label: "Task" },
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

function fmt(value: string | null) {
    return value
        ? new Date(value).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
          })
        : "-";
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
              .select(
                  "id, type, subject, body, owner, status, due_at, done_at, created_at"
              )
              .eq("parent_type", parentType)
              .eq("parent_id", parentId)
              .order("created_at", { ascending: false })
        : { data: [] };

    const items = (data ?? []) as Activity[];

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Activity &amp; Tasks</h2>

            <form
                action={logActivity}
                className="mt-4 grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2"
            >
                <input type="hidden" name="parent_type" value={parentType} />
                <input type="hidden" name="parent_id" value={parentId} />
                <input type="hidden" name="parent_label" value={parentLabel} />
                <select
                    name="type"
                    defaultValue="call"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                    {Object.entries(TYPE_META).map(([value, meta]) => (
                        <option key={value} value={value}>
                            {meta.icon} {meta.label}
                        </option>
                    ))}
                </select>
                <input
                    name="owner"
                    placeholder="Owner (optional)"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                />
                <input
                    name="subject"
                    placeholder="Subject (e.g. Intro call)"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-2"
                />
                <textarea
                    name="body"
                    rows={2}
                    placeholder="Notes..."
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-2"
                />
                <label className="flex items-center gap-2 text-xs text-slate-500">
                    Follow-up due
                    <input
                        type="datetime-local"
                        name="due_at"
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
                    />
                    <span className="text-slate-400">
                        (set = schedule a task; empty = log now)
                    </span>
                </label>
                <div className="flex justify-end sm:col-span-2">
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </form>

            <div className="mt-5 space-y-3">
                {items.length === 0 ? (
                    <p className="py-3 text-sm text-slate-400">
                        No activity yet. Log your first touchpoint above.
                    </p>
                ) : null}

                {items.map((activity) => {
                    const meta = TYPE_META[activity.type] ?? TYPE_META.note;
                    const timestamp =
                        activity.status === "done"
                            ? activity.done_at ?? activity.created_at
                            : activity.created_at;

                    return (
                        <div
                            key={activity.id}
                            className="flex gap-3 border-b border-slate-100 pb-3"
                        >
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {meta.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-800">
                                        {activity.subject || meta.label}
                                    </span>
                                    {activity.status === "open" ? (
                                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                            TASK · {fmt(activity.due_at)}
                                        </span>
                                    ) : null}
                                </div>
                                {activity.body ? (
                                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-600">
                                        {activity.body}
                                    </p>
                                ) : null}
                                <p className="mt-0.5 text-xs text-slate-400">
                                    {meta.label}
                                    {activity.owner ? ` · ${activity.owner}` : ""}
                                    {` · ${fmt(timestamp)}`}
                                </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                                {activity.status === "open" ? (
                                    <form action={completeTask}>
                                        <input type="hidden" name="id" value={activity.id} />
                                        <input
                                            type="hidden"
                                            name="parent_type"
                                            value={parentType}
                                        />
                                        <input
                                            type="hidden"
                                            name="parent_id"
                                            value={parentId}
                                        />
                                        <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-800">
                                            Done
                                        </button>
                                    </form>
                                ) : null}
                                <form action={deleteActivity}>
                                    <input type="hidden" name="id" value={activity.id} />
                                    <input
                                        type="hidden"
                                        name="parent_type"
                                        value={parentType}
                                    />
                                    <input type="hidden" name="parent_id" value={parentId} />
                                    <button className="text-xs font-semibold text-rose-400 hover:text-rose-600">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
