import { requireRole } from "@/lib/role";
import { formatIDR } from "@/lib/services";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createRep, deleteRep, updateRep } from "./actions";

export const dynamic = "force-dynamic";

interface Rep {
  id: string;
  name: string;
  email: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default async function TeamPage() {
  await requireRole(["admin", "manager"]);
  const supabase = getSupabaseAdmin();

  const { data: reps } = supabase
    ? await supabase
        .from("sales_reps")
        .select("id, name, email, role, is_active, created_at")
        .order("is_active", { ascending: false })
        .order("name")
    : { data: [] };
  const allReps = (reps ?? []) as Rep[];

  const { data: leadsRaw } = supabase
    ? await supabase.from("leads").select("owner")
    : { data: [] };
  const leadsByOwner = new Map<string, number>();
  for (const row of (leadsRaw ?? []) as { owner: string | null }[]) {
    if (row.owner) {
      leadsByOwner.set(row.owner, (leadsByOwner.get(row.owner) ?? 0) + 1);
    }
  }

  const { data: opportunitiesRaw } = supabase
    ? await supabase.from("opportunities").select("owner, value, stage")
    : { data: [] };
  const opportunitiesByOwner = new Map<
    string,
    { count: number; value: number }
  >();
  for (const row of (opportunitiesRaw ?? []) as {
    owner: string | null;
    value: number;
    stage: string;
  }[]) {
    if (row.owner && row.stage !== "lost") {
      const current = opportunitiesByOwner.get(row.owner) ?? {
        count: 0,
        value: 0,
      };
      current.count += 1;
      current.value += Number(row.value) || 0;
      opportunitiesByOwner.set(row.owner, current);
    }
  }

  const roleBadge: Record<string, string> = {
    sales: "bg-sky-50 text-sky-700",
    manager: "bg-violet-50 text-violet-700",
    admin: "bg-amber-50 text-amber-700",
  };

  const activeCount = allReps.filter((rep) => rep.is_active).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Sales roster
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Manage the sales team, their active status, and the pipeline
              currently sitting on each person.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Halaman ini jadi kontrol utama untuk pembagian owner, kapasitas
              rep, dan siapa yang sedang memegang lead atau deal aktif.
            </p>
          </div>

          <div className="grid min-w-[300px] gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Active reps
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {activeCount}
              </p>
            </div>
            <div className="rounded-2xl border border-violet-200/80 bg-violet-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700/70">
                Total reps
              </p>
              <p className="mt-3 text-3xl font-black text-violet-700">
                {allReps.length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
                Roles tracked
              </p>
              <p className="mt-3 text-xl font-black text-amber-700">
                Sales / Manager / Admin
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
          Add new rep
        </h2>
        <form
          action={createRep}
          className="mt-5 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-[1fr_1fr_160px_auto]"
        >
          <input
            name="name"
            required
            placeholder="Nama lengkap sales"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
          <input
            name="email"
            type="email"
            placeholder="nama@plusthe.site"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
          <select
            name="role"
            defaultValue="sales"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
          >
            <option value="sales">Sales</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            + Tambah Rep
          </button>
        </form>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="overflow-hidden rounded-[1.4rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Leads</th>
                  <th className="px-5 py-3 font-semibold">Open Pipeline</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allReps.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No sales reps yet.
                    </td>
                  </tr>
                )}
                {allReps.map((rep) => {
                  const leadCount = leadsByOwner.get(rep.name) ?? 0;
                  const opportunity = opportunitiesByOwner.get(rep.name) ?? {
                    count: 0,
                    value: 0,
                  };

                  return (
                    <tr
                      key={rep.id}
                      className={`hover:bg-slate-50/80 ${!rep.is_active ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-xs font-bold text-white">
                            {rep.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {rep.name}
                            </p>
                            {rep.email && (
                              <p className="text-xs text-slate-400">
                                {rep.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadge[rep.role] ?? roleBadge.sales}`}
                        >
                          {rep.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {leadCount}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-700">
                          {formatIDR(opportunity.value, true)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {opportunity.count} deals
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <form action={updateRep} className="inline">
                          <input type="hidden" name="id" value={rep.id} />
                          <input
                            type="hidden"
                            name="is_active"
                            value={rep.is_active ? "false" : "true"}
                          />
                          <button
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                              rep.is_active
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {rep.is_active ? "Aktif" : "Nonaktif"}
                          </button>
                        </form>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <form action={deleteRep} className="inline">
                          <input type="hidden" name="id" value={rep.id} />
                          <button className="text-xs font-semibold text-rose-400 transition-colors hover:text-rose-600">
                            Hapus
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
