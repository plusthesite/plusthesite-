import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNav, LogoutButton } from "@/components/admin/AdminNav";
import { MobileSidebar } from "@/components/admin/MobileSidebar";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { getUserRole, isUserDeactivated } from "@/lib/role";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Auth gate — only signed-in admins past this point.
    if (!user) {
        redirect("/admin/login");
    }

    // Deactivated logins are fully blocked (no dashboard, no tools) — a clear
    // screen + logout, rather than redirecting (which would loop the login).
    if (await isUserDeactivated()) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                        <svg className="h-6 w-6 text-rose-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    </div>
                    <h1 className="mt-4 text-lg font-bold text-slate-900">Akses dinonaktifkan</h1>
                    <p className="mt-2 text-sm text-slate-500">Akun <span className="font-medium text-slate-700">{user.email}</span> tidak lagi memiliki akses ke dashboard. Hubungi admin jika ini sebuah kekeliruan.</p>
                    <div className="mt-6 flex justify-center"><LogoutButton /></div>
                </div>
            </div>
        );
    }

    const role = await getUserRole();

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-slate-900 px-4 py-6 lg:flex">
                <div className="flex items-start justify-between px-3 pb-6">
                    <div>
                        <div className="text-xl font-extrabold tracking-tight text-white">
                            plus<span className="text-blue-500">.</span>
                        </div>
                        <p className="text-xs text-slate-500">Admin Dashboard</p>
                    </div>
                    <NotificationBell />
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <AdminNav role={role} />
                </div>
                <div className="mt-auto border-t border-slate-800 pt-4">
                    <p className="mb-2 truncate px-3 text-xs text-slate-500" title={user.email ?? ""}>
                        {user.email}
                    </p>
                    <LogoutButton />
                </div>
            </aside>

            {/* Mobile sidebar (hamburger) */}
            <MobileSidebar email={user.email ?? ""} role={role} />

            {/* Main content */}
            <main className="min-h-screen w-full lg:ml-60">
                {/* Mobile top bar */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
                    <div className="flex items-center gap-3">
                        <div className="text-lg font-extrabold tracking-tight text-slate-900">
                            plus<span className="text-blue-500">.</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <NotificationBell />
                        <label htmlFor="mobile-nav" className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                    </div>
                </div>
                <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
            </main>
        </div>
    );
}
