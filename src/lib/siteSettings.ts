import { unstable_cache } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface SiteSettings {
    primaryColor: string | null;
    secondaryColor: string | null;
}

/**
 * Public site theme settings. Cached (revalidate 120s, tag "site-settings")
 * so the static/ISR public pages aren't hit with a DB read on every request.
 * The admin save action calls revalidateTag("site-settings") to apply instantly.
 */
export const getSiteSettings = unstable_cache(
    async (): Promise<SiteSettings> => {
        const supabase = getSupabaseAdmin();
        if (!supabase) return { primaryColor: null, secondaryColor: null };
        try {
            const { data } = await supabase
                .from("site_settings")
                .select("primary_color, secondary_color")
                .eq("id", 1)
                .maybeSingle();
            return { primaryColor: data?.primary_color ?? null, secondaryColor: data?.secondary_color ?? null };
        } catch {
            return { primaryColor: null, secondaryColor: null };
        }
    },
    ["site-settings-v1"],
    { revalidate: 120, tags: ["site-settings"] }
);

const HEX = /^#[0-9a-fA-F]{6}$/;
export const isHex = (s: string) => HEX.test(s);
