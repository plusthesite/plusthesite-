import { adminClient, tryAdminClient } from "@/server/repositories/client";

export interface NotificationInput {
    type: "new_lead" | "new_opportunity" | "lead_converted" | "task_overdue" | "system";
    title: string;
    message?: string;
    link?: string;
}

export interface NotificationList {
    notifications: Record<string, unknown>[];
    unread: number;
}

/** Insert a notification. Fire-and-forget: never throws, so callers can use it
 * without risking the primary action. */
export async function insertNotification(opts: NotificationInput): Promise<void> {
    try {
        const supabase = tryAdminClient();
        if (!supabase) return;
        await supabase.from("notifications").insert({
            type: opts.type,
            title: opts.title,
            message: opts.message ?? null,
            link: opts.link ?? null,
        });
    } catch {
        // Never let notification failures break the primary action.
    }
}

/** Latest 30 notifications plus the unread count. Throws NotConfiguredError
 * when Supabase is absent (the service maps that to empty data). */
export async function listNotifications(): Promise<NotificationList> {
    const supabase = adminClient();
    const [unreadRes, allRes] = await Promise.all([
        supabase.from("notifications").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase
            .from("notifications")
            .select("id, type, title, message, link, is_read, created_at")
            .order("created_at", { ascending: false })
            .limit(30),
    ]);
    return {
        notifications: (allRes.data ?? []) as Record<string, unknown>[],
        unread: unreadRes.count ?? 0,
    };
}

/** Mark every unread notification as read. */
export async function markAllRead(): Promise<void> {
    await adminClient().from("notifications").update({ is_read: true }).eq("is_read", false);
}

/** Mark the given notification ids as read. */
export async function markRead(ids: string[]): Promise<void> {
    await adminClient().from("notifications").update({ is_read: true }).in("id", ids);
}
