import { NextResponse } from "next/server";
import { route } from "@/server/http/respond";
import { requireAdmin } from "@/server/http/auth";
import { listNotifications, markNotificationsRead } from "@/server/services/notificationService";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/notifications - fetch latest notifications (unread first).
 * PATCH /api/admin/notifications - mark notification(s) as read.
 *
 * Both require an admin session (consistent with the other /api/admin routes).
 * Defense in depth: the `notifications` table is also locked to the service
 * role at the DB level - see supabase/notifications.sql.
 */
export const GET = route(async () => {
    await requireAdmin();
    return NextResponse.json(await listNotifications());
});

export const PATCH = route(async (request) => {
    await requireAdmin();
    const body = (await request.json()) as { ids?: string[]; markAllRead?: boolean };
    return NextResponse.json(await markNotificationsRead(body));
});
