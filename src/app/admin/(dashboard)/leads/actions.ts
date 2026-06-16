"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const STATUSES = ["new", "contacted", "qualified", "unqualified", "converted"];

async function requireAdmin() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
}

/** Apply an action to many selected leads at once. */
export async function bulkUpdateLeads(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const ids = formData.getAll("ids").map(String).filter(Boolean);
    const action = String(formData.get("bulk_action") ?? "");
    if (ids.length === 0 || !action) return;

    if (action === "delete") {
        await admin.from("leads").delete().in("id", ids);
    } else if (action === "owner") {
        const owner = String(formData.get("bulk_owner") ?? "").trim();
        await admin.from("leads").update({ owner: owner || null }).in("id", ids);
    } else if (action.startsWith("status:")) {
        const status = action.slice(7);
        if (STATUSES.includes(status)) await admin.from("leads").update({ status }).in("id", ids);
    }
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
}
