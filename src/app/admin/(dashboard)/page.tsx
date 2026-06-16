import { getDashboardStats } from "@/lib/adminStats";
import { LiveDashboard } from "./LiveDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    if (!stats.configured) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
                Supabase is not configured. Add the env vars to enable the dashboard.
            </div>
        );
    }

    return <LiveDashboard initial={stats} />;
}
