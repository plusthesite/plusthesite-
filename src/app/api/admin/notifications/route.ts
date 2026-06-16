import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/notifications — fetch latest notifications (unread first).
 * PATCH /api/admin/notifications — mark notification(s) as read.
 */
export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ notifications: [], unread: 0 });

    const [unreadRes, allRes] = await Promise.all([
        supabase
            .from("notifications")
            .select("*", { count: "exact", head: true })
            .eq("is_read", false),
        supabase
            .from("notifications")
            .select("id, type, title, message, link, is_read, created_at")
            .order("created_at", { ascending: false })
            .limit(30),
    ]);

    return NextResponse.json({
        notifications: allRes.data ?? [],
        unread: unreadRes.count ?? 0,
    });
}

export async function PATCH(req: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ ok: false });

    const body = (await req.json()) as { ids?: string[]; markAllRead?: boolean };

    if (body.markAllRead) {
        await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    } else if (body.ids?.length) {
        await supabase.from("notifications").update({ is_read: true }).in("id", body.ids);
    }

    return NextResponse.json({ ok: true });
}
