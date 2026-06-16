"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const STATUSES = ["new", "contacted", "qualified", "unqualified", "converted"];

async function requireAdmin() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
}

/** Create a lead manually from the dashboard. */
export async function createLead(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) throw new Error("Database not configured");

    const name = String(formData.get("name") ?? "").trim() || null;
    const email = String(formData.get("email") ?? "").trim().toLowerCase() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    if (!name && !email && !phone) throw new Error("Provide at least a name, email, or phone");
    const company = String(formData.get("company") ?? "").trim() || null;

    let account_id: string | null = null;
    if (company) {
        const { data: acc } = await admin.from("accounts").upsert({ name: company }, { onConflict: "name" }).select("id").maybeSingle();
        account_id = acc?.id ?? null;
    }

    await admin.from("leads").insert({
        name, email, phone, company, account_id,
        service: String(formData.get("service") ?? "").trim() || null,
        status: String(formData.get("status") ?? "new").trim() || "new",
        value: Number(formData.get("value")) || null,
        owner: String(formData.get("owner") ?? "").trim() || null,
        source: String(formData.get("source") ?? "manual").trim() || "manual",
        message: String(formData.get("message") ?? "").trim() || null,
        locale: formData.get("locale") === "en" ? "en" : "id",
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    redirect("/admin/leads");
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
