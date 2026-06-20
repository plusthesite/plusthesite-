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
        .select("role")
        .eq("email", user.email)
        .eq("is_active", true)
        .maybeSingle();

    const r = data?.role as string | undefined;
    return r === "sales" || r === "manager" || r === "admin" ? r : "admin";
}

/** Server guard — redirect to /admin if the user's role isn't allowed. */
export async function requireRole(allowed: Role[]) {
    const role = await getUserRole();
    if (!allowed.includes(role)) redirect("/admin");
}
