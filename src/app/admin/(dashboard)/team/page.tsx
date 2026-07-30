import { getSupabaseAdmin } from "@/lib/supabase";
import { formatIDR } from "@/lib/services";
import { createRep, updateRep, deleteRep } from "./actions";
import { requireRole } from "@/lib/role";

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

    // Fetch reps
    const { data: reps } = supabase
        ? await supabase
            .from("sales_reps")
            .select("id, name, email, role, is_active, created_at")
            .order("is_active", { ascending: false })
            .order("name")
        : { data: [] };
    const allReps = (reps ?? []) as Rep[];

    // Fetch lead counts per owner
    const { data: leadsRaw } = supabase
        ? await supabase.from("leads").select("owner")
        : { data: [] };
    const leadsByOwner = new Map<string, number>();
    for (const r of (leadsRaw ?? []) as { owner: string | null }[]) {
        if (r.owner) leadsByOwner.set(r.owner, (leadsByOwner.get(r.owner) ?? 0) + 1);
    }

    // Fetch opp counts per owner
    const { data: oppsRaw } = supabase
        ? await supabase.from("opportunities").select("owner, value, stage")
        : { data: [] };
    const oppsByOwner = new Map<string, { count: number; value: number }>();
    for (const r of (oppsRaw ?? []) as { owner: string | null; value: number; stage: string }[]) {
        if (r.owner && r.stage !== "lost") {
            const cur = oppsByOwner.get(r.owner) ?? { count: 0, value: 0 };
            cur.count++;
            cur.value += Number(r.value) || 0;
            oppsByOwner.set(r.owner, cur);
        }
    }

    const ROLE_BADGE: Record<string, string> = {
        sales: "bg-blue-50 text-blue-700",
        manager: "bg-violet-50 text-violet-700",
        admin: "bg-amber-50 text-amber-700",
    };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales Team</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your sales reps — assign leads and track pipeline per person.
                    </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {allReps.filter((r) => r.is_active).length} active · {allReps.length} total
                </span>
            </div>

            {/* Add new rep form */}
            <form action={createRep} className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex-1 min-w-[160px]">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
                    <input name="name" required placeholder="Jane Doe" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="flex-1 min-w-[160px]">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                    <input name="email" type="email" placeholder="jane@plusthe.site" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="w-32">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Role</label>
                    <select name="role" defaultValue="sales" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
                        <option value="sales">Sales</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                    + Add Rep
                </button>
            </form>

            {/* Rep list */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Name</th>
                            <th className="px-5 py-3 font-semibold">Role</th>
                            <th className="px-5 py-3 font-semibold">Assigned Leads</th>
                            <th className="px-5 py-3 font-semibold">Open Pipeline</th>
                            <th className="px-5 py-3 font-semibold">Status</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allReps.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center">
                                    <div className="mx-auto max-w-xs">
                                        <svg className="mx-auto h-10 w-10 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                        </svg>
                                        <p className="mt-2 text-sm font-medium text-slate-400">No reps yet</p>
                                        <p className="mt-1 text-xs text-slate-300">Add your first sales rep above.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {allReps.map((rep) => {
                            const lc = leadsByOwner.get(rep.name) ?? 0;
                            const opp = oppsByOwner.get(rep.name) ?? { count: 0, value: 0 };
                            return (
                                <tr key={rep.id} className={`transition-colors hover:bg-slate-50/80 ${!rep.is_active ? "opacity-50" : ""}`}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">
                                                {rep.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{rep.name}</p>
                                                {rep.email && <p className="text-xs text-slate-400">{rep.email}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_BADGE[rep.role] ?? ROLE_BADGE.sales}`}>
                                            {rep.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-semibold text-slate-700">{lc}</td>
                                    <td className="px-5 py-3">
                                        <p className="font-semibold text-slate-700">{formatIDR(opp.value, true)}</p>
                                        <p className="text-xs text-slate-400">{opp.count} deal{opp.count !== 1 ? "s" : ""}</p>
                                    </td>
                                    <td className="px-5 py-3">
                                        <form action={updateRep} className="inline">
                                            <input type="hidden" name="id" value={rep.id} />
                                            <input type="hidden" name="is_active" value={rep.is_active ? "false" : "true"} />
                                            <button className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${rep.is_active ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                                                {rep.is_active ? "Active" : "Inactive"}
                                            </button>
                                        </form>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <form action={deleteRep} className="inline">
                                            <input type="hidden" name="id" value={rep.id} />
                                            <button className="text-xs font-semibold text-rose-400 hover:text-rose-600 transition-colors">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
