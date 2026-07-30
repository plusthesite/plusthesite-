import { getSupabaseAdmin } from "@/lib/supabase";
import { deleteRow } from "../actions";

export const dynamic = "force-dynamic";

function fmt(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ContactsPage() {
  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase
        .from("contacts")
        .select("id, name, email, company, message, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  const rows = (data ?? []) as {
    id: string;
    name: string;
    email: string;
    company: string | null;
    message: string;
    created_at: string;
  }[];

  const withCompany = rows.filter((row) => row.company).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Contact inbox
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Messages from the contact form, ready for triage and follow-up.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Ini inbox ringan untuk semua outreach organik dari halaman contact
              plus.
            </p>
          </div>

          <div className="grid min-w-[260px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Total messages
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {rows.length}
              </p>
            </div>
            <div className="rounded-2xl border border-violet-200/80 bg-violet-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700/70">
                With company
              </p>
              <p className="mt-3 text-3xl font-black text-violet-700">
                {withCompany}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {rows.length === 0 && (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-slate-400 shadow-sm">
            No contact messages yet.
          </div>
        )}

        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {row.name}
                  {row.company && (
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      / {row.company}
                    </span>
                  )}
                </p>
                <a
                  href={`mailto:${row.email}`}
                  className="mt-1 inline-block text-sm text-sky-600 transition-colors hover:text-sky-800"
                >
                  {row.email}
                </a>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {fmt(row.created_at)}
                </span>
                <form action={deleteRow}>
                  <input type="hidden" name="table" value="contacts" />
                  <input type="hidden" name="id" value={row.id} />
                  <button className="text-xs font-semibold text-rose-500 transition-colors hover:text-rose-700">
                    Delete
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {row.message}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
