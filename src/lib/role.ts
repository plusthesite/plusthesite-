import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Role } from "@/lib/roleAccess";

export type { Role } from "@/lib/roleAccess";
export { canAccess } from "@/lib/roleAccess";

/**
 * Resolve the signed-in user's role by matching their auth email against the
 * `sales_reps` roster. Owner / unrostered logins default to `admin`.
 */
export async function getUserRole(): Promise<Role> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return "admin";

    const admin = getSupabaseAdmin();
    if (!admin) return "admin";
    const { data } = await admin
        .from("sales_reps")
        .select("role, is_active")
        .eq("email", user.email)
        .maybeSingle();

    // Unrostered (e.g. the owner) defaults to admin.
    if (!data) return "admin";
    // A deactivated rep must NEVER escalate to the admin default — drop them to
    // the lowest privilege instead.
    if (data.is_active === false) return "sales";
    const r = data.role as string | undefined;
    return r === "sales" || r === "manager" || r === "admin" ? r : "admin";
}

/**
 * True when the signed-in user has an explicit roster row marked inactive.
 * Used by the dashboard layout to fully block deactivated logins.
 */
export async function isUserDeactivated(): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return false;
    const admin = getSupabaseAdmin();
    if (!admin) return false;
    const { data } = await admin
        .from("sales_reps")
        .select("is_active")
        .eq("email", user.email)
        .maybeSingle();
    return data?.is_active === false;
}

/** Server guard — redirect to /admin if the user's role isn't allowed. */
export async function requireRole(allowed: Role[]) {
    const role = await getUserRole();
    if (!allowed.includes(role)) redirect("/admin");
}
