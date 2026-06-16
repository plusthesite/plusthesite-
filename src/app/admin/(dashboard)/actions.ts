"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ALLOWED = ["subscribers", "leads", "contacts"] as const;
type Table = (typeof ALLOWED)[number];

/** Delete a row — only for authenticated admins. */
export async function deleteRow(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const table = formData.get("table") as Table;
    const id = formData.get("id") as string;
    if (!ALLOWED.includes(table) || !id) return;

    const admin = getSupabaseAdmin();
    if (!admin) return;
    await admin.from(table).delete().eq("id", id);

    revalidatePath(`/admin/${table}`);
    revalidatePath("/admin");
}

/** Delete an entire chat conversation (all messages in a session). */
export async function deleteConversation(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const sessionId = formData.get("session_id") as string;
    if (!sessionId) return;

    const admin = getSupabaseAdmin();
    if (!admin) return;
    await admin.from("chat_messages").delete().eq("session_id", sessionId);

    revalidatePath("/admin/conversations");
    revalidatePath("/admin");
}
