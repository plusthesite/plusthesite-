import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/role";
import { updateUserRole, setUserActive, deleteUserAccount } from "./actions";

export const dynamic = "force-dynamic";

function fmt(d: string | null | undefined) {
    return d ? new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";
}

const ROLE_BADGE: Record<string, string> = {
    admin: "bg-violet-50 text-violet-700",
    manager: "bg-blue-50 text-blue-700",
    sales: "bg-emerald-50 text-emerald-700",
};

interface AuthUser { id: string; email?: string; created_at: string; last_sign_in_at?: string | null }
interface Rep { email: string | null; name: string | null; role: string | null; is_active: boolean | null }

export default async function UsersPage() {
    await requireRole(["admin"]);
    const supabase = getSupabaseAdmin();

    let users: AuthUser[] = [];
    let error: string | null = null;
    const roster = new Map<string, Rep>();
    let meId = "";

    if (supabase) {
        const [{ data, error: e }, { data: reps }, server] = await Promise.all([
            supabase.auth.admin.listUsers(),
            supabase.from("sales_reps").select("email, name, role, is_active"),
            createSupabaseServerClient(),
        ]);
        if (e) error = e.message;
        else users = data.users as AuthUser[];
        for (const r of (reps ?? []) as Rep[]) if (r.email) roster.set(r.email.toLowerCase(), r);
        if (server) { const { data: { user } } = await server.auth.getUser(); meId = user?.id ?? ""; }
    }

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                    <p className="mt-1 text-sm text-slate-500">Logins that can access this dashboard. Set each user&apos;s role; deactivate or remove access — all from here.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{users.length} user{users.length === 1 ? "" : "s"}</span>
                    <Link href="/admin/users/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Buat Akun</Link>
                </div>
            </div>

            {error && <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
            {!supabase && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Supabase isn&apos;t configured.</div>}

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Email</th>
                                <th className="px-5 py-3 font-semibold">Role</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold">Last sign-in</th>
                                <th className="px-5 py-3 font-semibold text-right">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No users.</td></tr>}
                            {users.map((u) => {
                                const email = (u.email ?? "").toLowerCase();
                                const rep = roster.get(email);
                                const role = rep?.role ?? "admin";
                                const rostered = Boolean(rep);
                                const active = rep ? rep.is_active !== false : true;
                                const isMe = u.id === meId;
                                return (
                                    <tr key={u.id} className="align-middle hover:bg-slate-50">
                                        <td className="px-5 py-3 font-medium text-slate-800">{u.email ?? "—"}{isMe && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">YOU</span>}</td>
                                        <td className="px-5 py-3">
                                            <form action={updateUserRole} className="flex items-center gap-1.5">
                                                <input type="hidden" name="email" value={u.email ?? ""} />
                                                <input type="hidden" name="name" value={rep?.name ?? ""} />
                                                <select name="role" defaultValue={role} className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ${ROLE_BADGE[role] ?? ROLE_BADGE.sales}`}>
                                                    <option value="sales">sales</option>
                                                    <option value="manager">manager</option>
                                                    <option value="admin">admin</option>
                                                </select>
                                                <button className="text-[10px] font-semibold text-slate-400 hover:text-slate-700" title="Save role">Set</button>
                                                {!rostered && <span className="text-[10px] text-slate-400" title="Not in the roster — defaults to admin (owner)">owner</span>}
                                            </form>
                                        </td>
                                        <td className="px-5 py-3">
                                            <form action={setUserActive} className="flex items-center gap-2">
                                                <input type="hidden" name="email" value={u.email ?? ""} />
                                                <input type="hidden" name="name" value={rep?.name ?? ""} />
                                                <input type="hidden" name="active" value={active ? "0" : "1"} />
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{active ? "Active" : "Inactive"}</span>
                                                {!isMe && <button className="text-[10px] font-semibold text-slate-400 hover:text-slate-700">{active ? "Deactivate" : "Activate"}</button>}
                                            </form>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">{fmt(u.last_sign_in_at)}</td>
                                        <td className="px-5 py-3 text-right">
                                            {isMe ? <span className="text-xs text-slate-300">—</span> : (
                                                <form action={deleteUserAccount}>
                                                    <input type="hidden" name="user_id" value={u.id} />
                                                    <input type="hidden" name="email" value={u.email ?? ""} />
                                                    <button className="text-xs font-semibold text-rose-400 hover:text-rose-600 transition-colors">Delete</button>
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

            <p className="mt-4 text-xs text-slate-400">Roles drive access (RBAC): <b>sales</b> = selling tools, <b>manager</b> += team & content, <b>admin</b> = everything. Deactivating drops a user to the lowest access; deleting removes their login entirely.</p>
        </div>
    );
}
