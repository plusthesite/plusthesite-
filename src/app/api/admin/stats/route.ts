import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/adminStats";

export const dynamic = "force-dynamic";

// GET /api/admin/stats — live dashboard snapshot (admin session required).
export async function GET() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const stats = await getDashboardStats();
    return NextResponse.json(stats, {
        headers: { "Cache-Control": "no-store" },
    });
}
