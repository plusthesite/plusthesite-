"use server";

import { revalidatePath, updateTag } from "next/cache";
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
    let tertiary: string | null = String(formData.get("tertiary_color") ?? "").trim();

    if (reset) {
        primary = null;
        secondary = null;
        tertiary = null;
    } else {
        if (primary && !isHex(primary)) return { error: "Warna primary harus hex (mis. #2563eb)." };
        if (secondary && !isHex(secondary)) return { error: "Warna secondary harus hex (mis. #7c3aed)." };
        if (tertiary && !isHex(tertiary)) return { error: "Warna accent harus hex (mis. #0d9488)." };
    }

    const { error } = await admin
        .from("site_settings")
        .upsert({ id: 1, primary_color: primary || null, secondary_color: secondary || null, tertiary_color: tertiary || null, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) {
        // Friendly, single message when the table hasn't been created yet.
        if (/site_settings/.test(error.message) && /(does not exist|schema cache|find the table)/i.test(error.message)) {
            return { error: "Tabel site_settings belum dibuat. Jalankan migrasi supabase/site_settings.sql dulu (lihat panduan di halaman ini)." };
        }
        return { error: error.message };
    }

    // Bust the unstable_cache data cache for site settings IMMEDIATELY
    // (read-your-own-writes), then re-render the public layout so the new
    // brand colors apply right away instead of waiting out the 120s revalidate.
    updateTag("site-settings");
    revalidatePath("/", "layout");
    return { ok: true };
}
