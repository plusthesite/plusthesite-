import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/role";
import { getSupabaseAdmin } from "@/lib/supabase";
import { deleteUserAccount, setUserActive, updateUserRole } from "./actions";

export const dynamic = "force-dynamic";

function fmt(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-violet-50 text-violet-700",
  manager: "bg-sky-50 text-sky-700",
  sales: "bg-emerald-50 text-emerald-700",
};

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string | null;
}

interface Rep {
  email: string | null;
  name: string | null;
  role: string | null;
  is_active: boolean | null;
}

export default async function UsersPage() {
  await requireRole(["admin"]);
  const supabase = getSupabaseAdmin();

  let users: AuthUser[] = [];
  let error: string | null = null;
  const roster = new Map<string, Rep>();
  let meId = "";

  if (supabase) {
    const [{ data, error: authError }, { data: reps }, server] =
      await Promise.all([
        supabase.auth.admin.listUsers(),
        supabase.from("sales_reps").select("email, name, role, is_active"),
        createSupabaseServerClient(),
      ]);

    if (authError) {
      error = authError.message;
    } else {
      users = data.users as AuthUser[];
    }

    for (const rep of (reps ?? []) as Rep[]) {
      if (rep.email) roster.set(rep.email.toLowerCase(), rep);
    }

    if (server) {
      const {
        data: { user },
      } = await server.auth.getUser();
      meId = user?.id ?? "";
    }
  }

  const activeUsers = users.filter((user) => {
    const rep = roster.get((user.email ?? "").toLowerCase());
    return rep ? rep.is_active !== false : true;
  }).length;

  const ownersOnly = users.filter((user) => {
    const rep = roster.get((user.email ?? "").toLowerCase());
    return !rep;
  }).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
              Access control
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Manage who can enter the admin, what they can touch, and whether
              they are still active.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Role, activation state, and login access ada di satu tempat. Ini
              layar kontrol utama buat tim internal plus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
              {users.length} users
            </span>
            <Link
              href="/admin/users/new"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              + Buat Akun
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Total logins
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {users.length}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/70">
              Active users
            </p>
            <p className="mt-3 text-3xl font-black text-emerald-700">
              {activeUsers}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
              Roster mapped
            </p>
            <p className="mt-3 text-3xl font-black text-sky-700">
              {roster.size}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
              Owner-only
            </p>
            <p className="mt-3 text-3xl font-black text-amber-700">
              {ownersOnly}
            </p>
            <p className="mt-2 text-xs text-amber-800/70">
              login tanpa roster rep
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!supabase && (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase is not configured.
        </div>
      )}

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              User roster
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Set role, activate or deactivate access, lalu hapus login bila
              memang sudah tidak dipakai.
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Last sign-in</th>
                  <th className="px-5 py-3 font-semibold text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map((user) => {
                  const email = (user.email ?? "").toLowerCase();
                  const rep = roster.get(email);
                  const role = rep?.role ?? "admin";
                  const active = rep ? rep.is_active !== false : true;
                  const rostered = Boolean(rep);
                  const isMe = user.id === meId;

                  return (
                    <tr
                      key={user.id}
                      className="align-middle hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-slate-800">
                            {user.email ?? "-"}
                            {isMe && (
                              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                YOU
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Created {fmt(user.created_at)}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <form
                          action={updateUserRole}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="hidden"
                            name="email"
                            value={user.email ?? ""}
                          />
                          <input
                            type="hidden"
                            name="name"
                            value={rep?.name ?? ""}
                          />
                          <select
                            name="role"
                            defaultValue={role}
                            className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ${ROLE_BADGE[role] ?? ROLE_BADGE.sales}`}
                          >
                            <option value="sales">sales</option>
                            <option value="manager">manager</option>
                            <option value="admin">admin</option>
                          </select>
                          <button
                            className="text-[10px] font-semibold text-slate-400 transition-colors hover:text-slate-700"
                            title="Save role"
                          >
                            Set
                          </button>
                        </form>
                        {!rostered && (
                          <p className="mt-1 text-[10px] text-slate-400">
                            owner login, not mapped to sales roster
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <form
                          action={setUserActive}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="hidden"
                            name="email"
                            value={user.email ?? ""}
                          />
                          <input
                            type="hidden"
                            name="name"
                            value={rep?.name ?? ""}
                          />
                          <input
                            type="hidden"
                            name="active"
                            value={active ? "0" : "1"}
                          />
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {active ? "Active" : "Inactive"}
                          </span>
                          {!isMe && (
                            <button className="text-[10px] font-semibold text-slate-400 transition-colors hover:text-slate-700">
                              {active ? "Deactivate" : "Activate"}
                            </button>
                          )}
                        </form>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {fmt(user.last_sign_in_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {isMe ? (
                          <span className="text-xs text-slate-300">-</span>
                        ) : (
                          <form action={deleteUserAccount}>
                            <input
                              type="hidden"
                              name="user_id"
                              value={user.id}
                            />
                            <input
                              type="hidden"
                              name="email"
                              value={user.email ?? ""}
                            />
                            <button className="text-xs font-semibold text-rose-400 transition-colors hover:text-rose-600">
                              Delete
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          RBAC: <b>sales</b> untuk tools penjualan, <b>manager</b> untuk team
          dan content oversight, <b>admin</b> untuk full control.
        </p>
      </section>
    </div>
  );
}
