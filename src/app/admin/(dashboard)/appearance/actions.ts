"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { requireRole } from "@/lib/role";
import { isHex } from "@/lib/siteSettings";

export interface AppearanceState { ok?: boolean; error?: string; }

export async function saveAppearance(_prev: AppearanceState, formData: FormData): Promise<AppearanceState> {
    await requireRole(["admin"]);
    const admin = getSupabaseAdmin();
    if (!admin) return { error: "Database not configured." };

    const reset = formData.get("reset") === "1";
    let primary: string | null = String(formData.get("primary_color") ?? "").trim();
    let secondary: string | null = String(formData.get("secondary_color") ?? "").trim();

    if (reset) {
        primary = null;
        secondary = null;
    } else {
        if (primary && !isHex(primary)) return { error: "Warna primary harus hex (mis. #2563eb)." };
        if (secondary && !isHex(secondary)) return { error: "Warna secondary harus hex (mis. #7c3aed)." };
    }

    const { error } = await admin
        .from("site_settings")
        .upsert({ id: 1, primary_color: primary || null, secondary_color: secondary || null, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    return { ok: true };
}
