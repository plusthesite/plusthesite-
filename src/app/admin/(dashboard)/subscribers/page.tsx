import { getSupabaseAdmin } from "@/lib/supabase";
import { deleteRow } from "../actions";

export const dynamic = "force-dynamic";

function fmt(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function SubscribersPage() {
  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase
        .from("subscribers")
        .select("id, email, locale, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  const rows = (data ?? []) as {
    id: string;
    email: string;
    locale: string;
    created_at: string;
  }[];

  const enCount = rows.filter((row) => row.locale === "en").length;
  const idCount = rows.filter((row) => row.locale === "id").length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Audience list
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Newsletter signups from the public site, grouped cleanly for quick
              review.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Daftar ini dipakai buat melihat pertumbuhan subscriber dan
              membersihkan signup yang memang perlu dihapus.
            </p>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Total
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {rows.length}
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
                EN
              </p>
              <p className="mt-3 text-3xl font-black text-sky-700">{enCount}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/70">
                ID
              </p>
              <p className="mt-3 text-3xl font-black text-emerald-700">
                {idCount}
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
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Locale</th>
                  <th className="px-5 py-3 font-semibold">Subscribed</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No subscribers yet.
                    </td>
                  </tr>
                )}
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {row.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-500">
                        {row.locale}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {fmt(row.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <form action={deleteRow}>
                        <input type="hidden" name="table" value="subscribers" />
                        <input type="hidden" name="id" value={row.id} />
                        <button className="text-xs font-semibold text-rose-500 transition-colors hover:text-rose-700">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
