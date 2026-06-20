import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { requireRole } from "@/lib/role";

export const dynamic = "force-dynamic";

function fmt(d: string | null | undefined) {
    return d ? new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";
}

export default async function UsersPage() {
    await requireRole(["admin"]);
    const supabase = getSupabaseAdmin();

    let users: { id: string; email?: string; created_at: string; last_sign_in_at?: string | null }[] = [];
    let error: string | null = null;
    if (supabase) {
        const { data, error: e } = await supabase.auth.admin.listUsers();
        if (e) error = e.message;
        else users = data.users as typeof users;
    }

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                    <p className="mt-1 text-sm text-slate-500">Admins who can sign in to this dashboard (Supabase Auth).</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{users.length} user{users.length === 1 ? "" : "s"}</span>
                    <Link href="/admin/users/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Buat Akun</Link>
                </div>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
            )}
            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Supabase isn&apos;t configured.</div>
            )}

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Email</th>
                            <th className="px-5 py-3 font-semibold">Role</th>
                            <th className="px-5 py-3 font-semibold">Created</th>
                            <th className="px-5 py-3 font-semibold">Last sign-in</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.length === 0 && (
                            <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">No admin users.</td></tr>
                        )}
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3 font-medium text-slate-800">{u.email ?? "—"}</td>
                                <td className="px-5 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">Administrator</span></td>
                                <td className="px-5 py-3 text-slate-500">{fmt(u.created_at)}</td>
                                <td className="px-5 py-3 text-slate-500">{fmt(u.last_sign_in_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-xs text-slate-400">Add or remove admins in Supabase → Authentication → Users.</p>
        </div>
    );
}
