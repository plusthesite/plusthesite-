import { getDashboardStats } from "@/lib/adminStats";
import { LiveDashboard } from "./LiveDashboard";
import { TodayFocus } from "./TodayFocus";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    if (!stats.configured) {
        return (
            <section className="overflow-hidden rounded-3xl border border-amber-200 bg-[linear-gradient(135deg,_#fff8e7,_#fffdf7)] p-6 shadow-sm">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                    Setup needed
                </span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Dashboard belum aktif penuh</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Data admin siap dipakai, tapi koneksi Supabase belum lengkap. Isi environment variable Supabase agar statistik, lead, kontak, dan pipeline bisa tampil live di dashboard ini.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {[
                        "Set NEXT_PUBLIC_SUPABASE_URL",
                        "Set NEXT_PUBLIC_SUPABASE_ANON_KEY",
                        "Pastikan service-role key tersedia di server",
                    ].map((item) => (
                        <div key={item} className="rounded-2xl border border-amber-200 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700">
                            {item}
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <>
            <LiveDashboard initial={stats} />
            <TodayFocus />
        </>
    );
}
