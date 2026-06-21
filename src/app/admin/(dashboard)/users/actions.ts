"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { requireRole } from "@/lib/role";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ["sales", "manager", "admin"];

export interface CreateUserState {
    ok?: boolean;
    email?: string;
    password?: string;
    error?: string;
}

/**
 * Create a login account (Supabase Auth) AND register it in the sales_reps
 * roster so RBAC resolves the role. Admin-only.
 */
export async function createUserAccount(_prev: CreateUserState, formData: FormData): Promise<CreateUserState> {
    await requireRole(["admin"]);
    const admin = getSupabaseAdmin();
    if (!admin) return { error: "Database not configured." };

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const name = String(formData.get("name") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const role = ROLES.includes(String(formData.get("role"))) ? String(formData.get("role")) : "sales";

    if (!EMAIL_RE.test(email)) return { error: "Email tidak valid." };
    if (password.length < 8) return { error: "Password minimal 8 karakter." };
    if (!name) return { error: "Nama wajib diisi." };

    // 1) Create the auth login (email pre-confirmed so they can log in immediately).
    const { error: authErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
    });
    if (authErr) return { error: authErr.message.includes("already") ? "Email sudah terdaftar." : authErr.message };

    // 2) Register/refresh in the sales_reps roster (drives RBAC by email).
    const { data: existing } = await admin.from("sales_reps").select("id").eq("email", email).maybeSingle();
    if (existing) await admin.from("sales_reps").update({ name, role, is_active: true }).eq("id", existing.id);
    else await admin.from("sales_reps").insert({ name, email, role, is_active: true });

    revalidatePath("/admin/users");
    revalidatePath("/admin/team");
    return { ok: true, email, password };
}

/** Change a user's role (upserts the sales_reps roster that drives RBAC). */
export async function updateUserRole(formData: FormData) {
    await requireRole(["admin"]);
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const role = String(formData.get("role") ?? "");
    const name = String(formData.get("name") ?? "").trim() || email.split("@")[0];
    if (!EMAIL_RE.test(email) || !ROLES.includes(role)) return;

    const { data: existing } = await admin.from("sales_reps").select("id").eq("email", email).maybeSingle();
    if (existing) await admin.from("sales_reps").update({ role, is_active: true }).eq("id", existing.id);
    else await admin.from("sales_reps").insert({ name, email, role, is_active: true });

    revalidatePath("/admin/users");
    revalidatePath("/admin/team");
}

/** Activate / deactivate a user's dashboard access (via the roster). */
export async function setUserActive(formData: FormData) {
    await requireRole(["admin"]);
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const active = String(formData.get("active") ?? "") === "1";
    const name = String(formData.get("name") ?? "").trim() || email.split("@")[0];
    if (!EMAIL_RE.test(email)) return;

    const { data: existing } = await admin.from("sales_reps").select("id").eq("email", email).maybeSingle();
    if (existing) await admin.from("sales_reps").update({ is_active: active }).eq("id", existing.id);
    // If unrostered, only create a row when deactivating (to record the block at 'sales').
    else if (!active) await admin.from("sales_reps").insert({ name, email, role: "sales", is_active: false });

    revalidatePath("/admin/users");
    revalidatePath("/admin/team");
}

/** Permanently delete a login (Supabase Auth) + its roster entry. Admin-only. */
export async function deleteUserAccount(formData: FormData) {
    await requireRole(["admin"]);
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const userId = String(formData.get("user_id") ?? "");
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    if (!userId) return;

    // Never let an admin delete their own account.
    const server = await createSupabaseServerClient();
    const { data: { user: me } } = server ? await server.auth.getUser() : { data: { user: null } };
    if (me?.id === userId) return;

    await admin.auth.admin.deleteUser(userId);
    if (email) await admin.from("sales_reps").delete().eq("email", email);

    revalidatePath("/admin/users");
    revalidatePath("/admin/team");
}
