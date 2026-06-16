import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Insert a notification into the notifications table.
 * Fire-and-forget — failures are silently ignored so they never break the main action.
 */
export async function createNotification(opts: {
    type: "new_lead" | "new_opportunity" | "lead_converted" | "task_overdue" | "system";
    title: string;
    message?: string;
    link?: string;
}) {
    try {
        const supabase = getSupabaseAdmin();
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
