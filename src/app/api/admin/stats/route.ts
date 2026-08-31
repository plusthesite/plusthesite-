import { NextResponse } from "next/server";
import { route } from "@/server/http/respond";
import { requireAdmin } from "@/server/http/auth";
import { getDashboardStats } from "@/server/services/statsService";

export const dynamic = "force-dynamic";

// GET /api/admin/stats - live dashboard snapshot (admin session required).
export const GET = route(async () => {
    await requireAdmin();
    const stats = await getDashboardStats();
    return NextResponse.json(stats, { headers: { "Cache-Control": "no-store" } });
});
