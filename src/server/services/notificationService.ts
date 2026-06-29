import { NotConfiguredError } from "@/server/repositories/client";
import {
    insertNotification,
    listNotifications as listFromRepo,
    markAllRead,
    markRead,
    type NotificationInput,
    type NotificationList,
} from "@/server/repositories/notificationRepo";

/** Fire-and-forget notification insert. Safe to call from any action. */
export async function createNotification(opts: NotificationInput): Promise<void> {
    await insertNotification(opts);
}

/** List notifications for the admin bell. Degrades to empty when the DB is
 * not configured. */
export async function listNotifications(): Promise<NotificationList> {
    try {
        return await listFromRepo();
    } catch (err) {
        if (err instanceof NotConfiguredError) return { notifications: [], unread: 0 };
        throw err;
    }
}

/** Mark notifications as read (all unread, or a specific id list). */
export async function markNotificationsRead(
    opts: { ids?: string[]; markAllRead?: boolean }
): Promise<{ ok: boolean }> {
    try {
        if (opts.markAllRead) {
            await markAllRead();
        } else if (opts.ids?.length) {
            await markRead(opts.ids);
        }
        return { ok: true };
    } catch (err) {
        if (err instanceof NotConfiguredError) return { ok: false };
        throw err;
    }
}
