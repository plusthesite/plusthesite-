import Link from "next/link";
import { completeTask } from "../activities/actions";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  call: "Call",
  whatsapp: "WhatsApp",
  email: "Email",
  meeting: "Meeting",
  note: "Note",
  task: "Task",
};

const REFERENCE_DATE = new Date("2026-07-30T00:00:00.000+07:00");

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

function fmt(value: string | null) {
  if (!value) return "No due date";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function TasksPage() {
  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase
        .from("activities")
        .select(
          "id, parent_type, parent_id, parent_label, type, subject, owner, due_at",
        )
        .eq("status", "open")
        .order("due_at", { ascending: true, nullsFirst: false })
    : { data: [] };

  const tasks = (data ?? []) as Task[];
  const overdue = tasks.filter(
    (task) =>
      task.due_at && new Date(task.due_at).getTime() < REFERENCE_DATE.getTime(),
  );
  const unassigned = tasks.filter((task) => !task.owner?.trim()).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Task queue
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Open follow-ups across leads and deals, sorted for fast
              operational cleanup.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Snapshot ini dihitung terhadap Kamis, 30 Juli 2026 untuk melihat
              mana tugas yang sudah overdue dan mana yang belum punya owner.
            </p>
          </div>

          <div className="grid min-w-[300px] gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Open
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {tasks.length}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700/70">
                Overdue
              </p>
              <p className="mt-3 text-3xl font-black text-rose-700">
                {overdue.length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
                No owner
              </p>
              <p className="mt-3 text-3xl font-black text-amber-700">
                {unassigned}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="overflow-hidden rounded-[1.4rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
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
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No open tasks. Schedule follow-ups from a lead or
                      opportunity.
                    </td>
                  </tr>
                )}
                {tasks.map((task) => {
                  const isOverdue =
                    !!task.due_at &&
                    new Date(task.due_at).getTime() < REFERENCE_DATE.getTime();
                  const href =
                    task.parent_type === "opportunity"
                      ? `/admin/opportunities/${task.parent_id}`
                      : `/admin/leads/${task.parent_id}`;

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-slate-800">
                            {task.subject || "Follow up"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {TYPE_LABEL[task.type] ?? "Task"}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={href}
                          className="font-medium text-sky-600 transition-colors hover:text-sky-800"
                        >
                          {task.parent_label || "View item"}
                        </Link>
                      </td>
                      <td
                        className={`px-5 py-4 whitespace-nowrap ${
                          isOverdue
                            ? "font-semibold text-rose-600"
                            : "text-slate-500"
                        }`}
                      >
                        {fmt(task.due_at)}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {task.owner ?? "-"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <form action={completeTask}>
                          <input type="hidden" name="id" value={task.id} />
                          <input
                            type="hidden"
                            name="parent_type"
                            value={task.parent_type}
                          />
                          <input
                            type="hidden"
                            name="parent_id"
                            value={task.parent_id}
                          />
                          <button className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-800">
                            Mark done
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
