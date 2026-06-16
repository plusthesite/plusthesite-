"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";

async function requireAdmin() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
}

export async function createRep(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) throw new Error("Database not configured");
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const role = String(formData.get("role") ?? "sales");
    if (!name) throw new Error("Name is required");
    const { error } = await admin.from("sales_reps").insert({ name, email: email || null, role });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/team");
    redirect("/admin/team");
}

export async function updateRep(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) throw new Error("Database not configured");
    const id = String(formData.get("id") ?? "");
    const is_active = formData.get("is_active") === "true";
    const { error } = await admin.from("sales_reps").update({ is_active }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/team");
}

export async function deleteRep(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const id = String(formData.get("id") ?? "");
    if (id) await admin.from("sales_reps").delete().eq("id", id);
    revalidatePath("/admin/team");
}
