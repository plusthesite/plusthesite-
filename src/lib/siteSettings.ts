import { unstable_cache } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface SiteSettings {
    primaryColor: string | null;
    secondaryColor: string | null;
    tertiaryColor: string | null;
}

/**
 * Public site theme settings. Cached (revalidate 120s, tag "site-settings")
 * so the static/ISR public pages aren't hit with a DB read on every request.
 * The admin save action calls updateTag("site-settings") (Next 16, read-your-
 * own-writes) so a new theme applies immediately instead of waiting 120s.
 */
export const getSiteSettings = unstable_cache(
    async (): Promise<SiteSettings> => {
        const supabase = getSupabaseAdmin();
        if (!supabase) return { primaryColor: null, secondaryColor: null, tertiaryColor: null };
        try {
            const { data } = await supabase
                .from("site_settings")
                .select("primary_color, secondary_color, tertiary_color")
                .eq("id", 1)
                .maybeSingle();
            return {
                primaryColor: data?.primary_color ?? null,
                secondaryColor: data?.secondary_color ?? null,
                tertiaryColor: data?.tertiary_color ?? null,
            };
        } catch {
            return { primaryColor: null, secondaryColor: null, tertiaryColor: null };
        }
    },
    ["site-settings-v2"],
    { revalidate: 120, tags: ["site-settings"] }
);

const HEX = /^#[0-9a-fA-F]{6}$/;
export const isHex = (s: string) => HEX.test(s);
