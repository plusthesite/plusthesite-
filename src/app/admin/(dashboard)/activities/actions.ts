"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";

async function requireAdmin() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
}

function parentPath(type: string, id: string) {
    return type === "opportunity" ? `/admin/opportunities/${id}` : `/admin/leads/${id}`;
}

/** Log an interaction now, or schedule a follow-up task (when a due date is set). */
export async function logActivity(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;

    const parent_type = formData.get("parent_type") === "opportunity" ? "opportunity" : "lead";
    const parent_id = String(formData.get("parent_id") ?? "");
    if (!parent_id) return;

    const dueRaw = String(formData.get("due_at") ?? "").trim();
    const due_at = dueRaw ? new Date(dueRaw).toISOString() : null;
    const isTask = !!due_at;

    await admin.from("activities").insert({
        parent_type,
        parent_id,
        parent_label: String(formData.get("parent_label") ?? "").slice(0, 160) || null,
        type: String(formData.get("type") ?? "note").slice(0, 20),
        subject: String(formData.get("subject") ?? "").slice(0, 200) || null,
        body: String(formData.get("body") ?? "").slice(0, 4000) || null,
        owner: String(formData.get("owner") ?? "").slice(0, 80) || null,
        status: isTask ? "open" : "done",
        due_at,
        done_at: isTask ? null : new Date().toISOString(),
    });

    revalidatePath(parentPath(parent_type, parent_id));
    revalidatePath("/admin/tasks");
    revalidatePath("/admin");
}

export async function completeTask(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await admin.from("activities").update({ status: "done", done_at: new Date().toISOString() }).eq("id", id);
    revalidatePath("/admin/tasks");
    revalidatePath("/admin");
    const pt = String(formData.get("parent_type") ?? "");
    const pid = String(formData.get("parent_id") ?? "");
    if (pid) revalidatePath(parentPath(pt, pid));
}

export async function reopenTask(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await admin.from("activities").update({ status: "open", done_at: null }).eq("id", id);
    revalidatePath("/admin/tasks");
    const pt = String(formData.get("parent_type") ?? "");
    const pid = String(formData.get("parent_id") ?? "");
    if (pid) revalidatePath(parentPath(pt, pid));
}

export async function deleteActivity(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const id = String(formData.get("id") ?? "");
    if (id) await admin.from("activities").delete().eq("id", id);
    const pt = String(formData.get("parent_type") ?? "");
    const pid = String(formData.get("parent_id") ?? "");
    if (pid) revalidatePath(parentPath(pt, pid));
    revalidatePath("/admin/tasks");
}
