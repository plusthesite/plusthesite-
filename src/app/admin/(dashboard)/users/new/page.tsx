import Link from "next/link";
import { requireRole } from "@/lib/role";
import { NewUserForm } from "../NewUserForm";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
    await requireRole(["admin"]);
    return (
        <div className="max-w-2xl">
            <Link href="/admin/users" className="text-xs font-semibold text-slate-400 hover:text-slate-600">← Back to Users</Link>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">Buat Akun Baru</h1>
            <p className="mt-1 text-sm text-slate-500">Generate login untuk sales / manager / admin. Akun langsung aktif & role-nya otomatis berlaku.</p>
            <div className="mt-6"><NewUserForm /></div>
        </div>
    );
}
