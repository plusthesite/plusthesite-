"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { STAGES, STAGE_PROBABILITY, type Stage } from "./constants";

async function requireAdmin() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
}

export async function updateOpportunityStage(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const id = String(formData.get("id") ?? "");
    const stage = String(formData.get("stage") ?? "");
    if (!id || !STAGES.includes(stage as Stage)) return;

    await admin
        .from("opportunities")
        .update({ stage, probability: STAGE_PROBABILITY[stage as Stage] })
        .eq("id", id);

    revalidatePath("/admin/opportunities");
    revalidatePath("/admin");
}

/** Move an opportunity to a new stage — callable directly from the Kanban board. */
export async function moveOpportunity(id: string, stage: string) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin || !id || !STAGES.includes(stage as Stage)) return;
    await admin
        .from("opportunities")
        .update({ stage, probability: STAGE_PROBABILITY[stage as Stage] })
        .eq("id", id);
    revalidatePath("/admin/opportunities/board");
    revalidatePath("/admin/opportunities");
    revalidatePath("/admin");
}

export async function deleteOpportunity(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const id = String(formData.get("id") ?? "");
    if (id) await admin.from("opportunities").delete().eq("id", id);
    revalidatePath("/admin/opportunities");
    revalidatePath("/admin");
}

/** Create an opportunity manually from the dashboard. */
export async function createOpportunity(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) throw new Error("Database not configured");

    const name = String(formData.get("name") ?? "").trim();
    if (!name) throw new Error("Deal name is required");
    const stage = String(formData.get("stage") ?? "new");
    const safeStage = STAGES.includes(stage as Stage) ? (stage as Stage) : "new";
    const company = String(formData.get("company") ?? "").trim() || null;

    // Link/create a company account.
    let account_id: string | null = null;
    if (company) {
        const { data: acc } = await admin.from("accounts").upsert({ name: company }, { onConflict: "name" }).select("id").maybeSingle();
        account_id = acc?.id ?? null;
    }

    await admin.from("opportunities").insert({
        name,
        company,
        account_id,
        contact_name: String(formData.get("contact_name") ?? "").trim() || null,
        email: String(formData.get("email") ?? "").trim() || null,
        phone: String(formData.get("phone") ?? "").trim() || null,
        value: Number(formData.get("value")) || 0,
        stage: safeStage,
        probability: STAGE_PROBABILITY[safeStage],
        service: String(formData.get("service") ?? "").trim() || null,
        owner: String(formData.get("owner") ?? "").trim() || null,
        source: String(formData.get("source") ?? "manual").trim() || "manual",
        expected_close: String(formData.get("expected_close") ?? "").trim() || null,
        notes: String(formData.get("notes") ?? "").trim() || null,
        locale: formData.get("locale") === "en" ? "en" : "id",
    });

    revalidatePath("/admin/opportunities");
    revalidatePath("/admin");
    redirect("/admin/opportunities");
}

/** Apply an action to many selected opportunities at once. */
export async function bulkUpdateOpportunities(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const ids = formData.getAll("ids").map(String).filter(Boolean);
    const action = String(formData.get("bulk_action") ?? "");
    if (ids.length === 0 || !action) return;

    if (action === "delete") {
        await admin.from("opportunities").delete().in("id", ids);
    } else if (action === "owner") {
        const owner = String(formData.get("bulk_owner") ?? "").trim();
        await admin.from("opportunities").update({ owner: owner || null }).in("id", ids);
    } else if (action.startsWith("stage:")) {
        const stage = action.slice(6);
        if (STAGES.includes(stage as Stage)) {
            await admin.from("opportunities").update({ stage, probability: STAGE_PROBABILITY[stage as Stage] }).in("id", ids);
        }
    }
    revalidatePath("/admin/opportunities");
    revalidatePath("/admin");
}

/** Promote a lead into the opportunities pipeline, carrying its service tag. */
export async function convertLeadToOpportunity(formData: FormData) {
    await requireAdmin();
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const id = String(formData.get("id") ?? "");
    if (!id) return;

    const { data: lead } = await admin
        .from("leads")
        .select("id, name, email, phone, company, service, value, owner, locale")
        .eq("id", id)
        .maybeSingle();
    if (!lead) return;

    await admin.from("opportunities").insert({
        name: `${lead.company || lead.name || "New deal"} — ${lead.service ?? "general"}`,
        company: lead.company,
        contact_name: lead.name,
        email: lead.email,
        phone: lead.phone,
        value: lead.value ?? 0,
        stage: "qualified",
        probability: 45,
        source: "lead",
        service: lead.service,
        owner: lead.owner,
        lead_id: lead.id,
        locale: lead.locale ?? "id",
    });
    await admin.from("leads").update({ status: "converted" }).eq("id", id);

    revalidatePath("/admin/opportunities");
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
}
