"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { requireRole } from "@/lib/role";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ["sales", "manager", "admin"];

export async function createRep(formData: FormData) {
    await requireRole(["admin", "manager"]);
    const admin = getSupabaseAdmin();
    if (!admin) throw new Error("Database not configured");
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const role = ROLES.includes(String(formData.get("role"))) ? String(formData.get("role")) : "sales";
    if (!name) throw new Error("Name is required");
    if (email && !EMAIL_RE.test(email)) throw new Error("Email tidak valid");

    // Dedupe by email - a duplicate roster row would break RBAC (maybeSingle).
    if (email) {
        const { data: existing } = await admin.from("sales_reps").select("id").eq("email", email).maybeSingle();
        if (existing) {
            await admin.from("sales_reps").update({ name, role, is_active: true }).eq("id", existing.id);
            revalidatePath("/admin/team");
            redirect("/admin/team");
        }
    }
    const { error } = await admin.from("sales_reps").insert({ name, email: email || null, role });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/team");
    redirect("/admin/team");
}

export async function updateRep(formData: FormData) {
    await requireRole(["admin", "manager"]);
    const admin = getSupabaseAdmin();
    if (!admin) throw new Error("Database not configured");
    const id = String(formData.get("id") ?? "");
    const is_active = formData.get("is_active") === "true";
    const { error } = await admin.from("sales_reps").update({ is_active }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/team");
    revalidatePath("/admin/users");
}

export async function deleteRep(formData: FormData) {
    await requireRole(["admin", "manager"]);
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const id = String(formData.get("id") ?? "");
    if (id) await admin.from("sales_reps").delete().eq("id", id);
    revalidatePath("/admin/team");
    revalidatePath("/admin/users");
}
