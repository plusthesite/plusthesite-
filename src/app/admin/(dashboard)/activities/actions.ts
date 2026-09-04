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

/** Log an interaction now, or schedule a follow-up task (when a due date is set).
 * ERD v2: activities use explicit lead_id/opportunity_id FKs (no polymorphic
 * parent_type/parent_id, no denormalized parent_label — derivable via join). */
export async function logActivity(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;

    const isOpportunity = formData.get("parent_type") === "opportunity";
    const parent_id = String(formData.get("parent_id") ?? "");
    if (!parent_id) return;

    const dueRaw = String(formData.get("due_at") ?? "").trim();
    const due_at = dueRaw ? new Date(dueRaw).toISOString() : null;
    const isTask = !!due_at;

    const ownerRaw = String(formData.get("owner") ?? "").trim();
    const owner_id = ownerRaw && ownerRaw !== "none" ? ownerRaw : null;

    await admin.from("activities").insert({
        ...(isOpportunity ? { opportunity_id: parent_id } : { lead_id: parent_id }),
        type: String(formData.get("type") ?? "note").slice(0, 20),
        subject: String(formData.get("subject") ?? "").slice(0, 200) || null,
        body: String(formData.get("body") ?? "").slice(0, 4000) || null,
        owner_id,
        status: isTask ? "open" : "done",
        due_at,
        done_at: isTask ? null : new Date().toISOString(),
    });

    revalidatePath(parentPath(isOpportunity ? "opportunity" : "lead", parent_id));
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
