import { getSiteSettings, isHex } from "@/lib/siteSettings";

/**
 * Injects admin-chosen brand colors as CSS variable overrides (light + dark).
 * Returns null when unset, so the site falls back to its default theme.
 */
export async function ThemeStyle() {
    const { primaryColor, secondaryColor } = await getSiteSettings();
    const p = primaryColor && isHex(primaryColor) ? primaryColor : null;
    const s = secondaryColor && isHex(secondaryColor) ? secondaryColor : null;
    if (!p && !s) return null;

    const decls = [
        p && `--primary:${p};--primary-light:${p};--primary-dark:${p};`,
        s && `--secondary:${s};--secondary-light:${s};--secondary-dark:${s};`,
    ].filter(Boolean).join("");

    return <style dangerouslySetInnerHTML={{ __html: `:root,.dark{${decls}}` }} />;
}
