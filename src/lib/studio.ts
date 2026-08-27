/**
 * PLUS Studio lives in its own repository and on its own subdomain, so every
 * link to it from the marketing site is absolute and cross-origin.
 *
 * The studio reads `?lang=` on first load, which is how the locale carries
 * across the hop.
 */
export const STUDIO_URL =
    process.env.NEXT_PUBLIC_STUDIO_URL?.replace(/\/$/, "") ??
    "https://studio.plusthe.site";

export const studioUrl = (locale: string) => `${STUDIO_URL}/?lang=${locale}`;
