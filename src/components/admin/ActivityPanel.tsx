import { getSupabaseAdmin } from "@/lib/supabase";
import {
  completeTask,
  deleteActivity,
  logActivity,
} from "@/app/admin/(dashboard)/activities/actions";

const TYPE_META: Record<string, { icon: string; label: string; tone: string }> =
  {
    call: { icon: "Call", label: "Call", tone: "bg-sky-50 text-sky-700" },
    whatsapp: {
      icon: "WA",
      label: "WhatsApp",
      tone: "bg-emerald-50 text-emerald-700",
    },
    email: {
      icon: "Mail",
      label: "Email",
      tone: "bg-violet-50 text-violet-700",
    },
    meeting: {
      icon: "Meet",
      label: "Meeting",
      tone: "bg-amber-50 text-amber-700",
    },
    note: { icon: "Note", label: "Note", tone: "bg-slate-100 text-slate-600" },
    task: { icon: "Task", label: "Task", tone: "bg-rose-50 text-rose-700" },
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
    ? new Date(value).toLocaleString("id-ID", {
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
          "id, type, subject, body, owner, status, due_at, done_at, created_at",
        )
        .eq("parent_type", parentType)
        .eq("parent_id", parentId)
        .order("created_at", { ascending: false })
    : { data: [] };

  const items = (data ?? []) as Activity[];

  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Activity log
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Log touchpoints and schedule follow-up tasks without leaving this
            record.
          </p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
          {items.length} entries
        </span>
      </div>

      <form
        action={logActivity}
        className="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2"
      >
        <input type="hidden" name="parent_type" value={parentType} />
        <input type="hidden" name="parent_id" value={parentId} />
        <input type="hidden" name="parent_label" value={parentLabel} />
        <select
          name="type"
          defaultValue="call"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          {Object.entries(TYPE_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.icon} / {meta.label}
            </option>
          ))}
        </select>
        <input
          name="owner"
          placeholder="Owner (optional)"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <input
          name="subject"
          placeholder="Subject, example: intro call"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-2"
        />
        <textarea
          name="body"
          rows={3}
          placeholder="Notes..."
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-2"
        />
        <label className="flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:col-span-2">
          Follow-up due
          <input
            type="datetime-local"
            name="due_at"
            className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm"
          />
          <span className="text-slate-400">
            Isi kalau ini harus jadi task terbuka. Kosongkan kalau cuma catatan
            biasa.
          </span>
        </label>
        <div className="flex justify-end sm:col-span-2">
          <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Save activity
          </button>
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {items.length === 0 && (
          <p className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-5 text-sm text-slate-400">
            No activity yet. Log the first touchpoint above.
          </p>
        )}

        {items.map((activity) => {
          const meta = TYPE_META[activity.type] ?? TYPE_META.note;
          const timestamp =
            activity.status === "done"
              ? (activity.done_at ?? activity.created_at)
              : activity.created_at;

          return (
            <div
              key={activity.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${meta.tone}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {activity.subject || meta.label}
                    </span>
                    {activity.status === "open" && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        TASK / {fmt(activity.due_at)}
                      </span>
                    )}
                  </div>
                  {activity.body && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {activity.body}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {activity.owner ? `${activity.owner} / ` : ""}
                    {fmt(timestamp)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {activity.status === "open" && (
                    <form action={completeTask}>
                      <input type="hidden" name="id" value={activity.id} />
                      <input
                        type="hidden"
                        name="parent_type"
                        value={parentType}
                      />
                      <input type="hidden" name="parent_id" value={parentId} />
                      <button className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-800">
                        Done
                      </button>
                    </form>
                  )}
                  <form action={deleteActivity}>
                    <input type="hidden" name="id" value={activity.id} />
                    <input
                      type="hidden"
                      name="parent_type"
                      value={parentType}
                    />
                    <input type="hidden" name="parent_id" value={parentId} />
                    <button className="text-xs font-semibold text-rose-400 transition-colors hover:text-rose-600">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
