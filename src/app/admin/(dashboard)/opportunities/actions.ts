"use server";

import { revalidatePath } from "next/cache";
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
