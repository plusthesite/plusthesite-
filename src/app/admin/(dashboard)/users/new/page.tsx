import Link from "next/link";
import { requireRole } from "@/lib/role";
import { NewUserForm } from "../NewUserForm";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
        >
          {"<-"} Back to Users
        </Link>
        <div className="mt-4 max-w-3xl">
          <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
            New login
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            Create a new admin login and assign the right role from the start.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Gunakan form ini untuk membuat akun sales, manager, atau admin baru.
            Akun yang dibuat akan langsung aktif sesuai role yang dipilih.
          </p>
        </div>
      </section>

      <section className="max-w-2xl rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <NewUserForm />
      </section>
    </div>
  );
}
