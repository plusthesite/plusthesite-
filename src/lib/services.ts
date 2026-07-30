/**
 * Canonical service taxonomy for plus.
 *
 * Single source of truth shared by:
 *  - Pricing (Indonesian-market IDR reference)
 *  - CRM segmentation (leads & opportunities are tagged by `slug`)
 *
 * Keeping every lead / opportunity tagged with one of these slugs lets the
 * sales team filter the pipeline per service line and reach out directly.
 */

export interface ServiceLine {
    slug: string;
    en: string;
    id: string;
    /** Short value proposition (EN). */
    tagline: string;
    /** Indicative starting deal value in IDR — sales reference, not a public price. */
    startingValue: number;
    /** Public-page route under /[locale]. */
    path: string;
    /** Tailwind chip color (light bg + text). */
    chip: string;
    /** Not yet offered — shown as "Coming soon", excluded from lead-gen funnels. */
    comingSoon?: boolean;
}

export const SERVICES: ServiceLine[] = [
    {
        slug: "chatbot",
        en: "AI Chat Bot",
        id: "AI Chat Bot",
        tagline: "24/7 conversational AI for sales & support",
        startingValue: 8_000_000,
        path: "/chat-bot",
        chip: "bg-blue-50 text-blue-700",
    },
    {
        slug: "digital-agency",
        en: "Digital Agency",
        id: "Digital Agency",
        tagline: "Branding, content & AI-powered strategy",
        startingValue: 15_000_000,
        path: "/digital-agency",
        chip: "bg-violet-50 text-violet-700",
    },
    {
        slug: "mobile-app",
        en: "Mobile App Development",
        id: "Pengembangan Aplikasi Mobile",
        tagline: "Cross-platform apps that drive growth",
        startingValue: 35_000_000,
        path: "/mobile-app",
        chip: "bg-emerald-50 text-emerald-700",
    },
    {
        slug: "mobile-game",
        en: "Mobile Game Development",
        id: "Pengembangan Game Mobile",
        tagline: "Android & iOS games (Unity / Unreal)",
        startingValue: 50_000_000,
        path: "/mobile-game",
        chip: "bg-amber-50 text-amber-700",
    },
    {
        slug: "crm",
        en: "CRM Platform",
        id: "Platform CRM",
        tagline: "AI-powered customer relationship management",
        startingValue: 12_000_000,
        path: "/crm",
        chip: "bg-cyan-50 text-cyan-700",
    },
    {
        slug: "customer-support",
        en: "Customer Support",
        id: "Customer Support",
        tagline: "Smart tooling for faster support",
        startingValue: 6_000_000,
        path: "/customer-support",
        chip: "bg-rose-50 text-rose-700",
    },
    {
        slug: "ai-tools",
        en: "AI Generators",
        id: "AI Generator",
        tagline: "Image, text, video & music generation",
        startingValue: 4_000_000,
        path: "/ai-image-generator",
        chip: "bg-fuchsia-50 text-fuchsia-700",
    },
];

/** Services we actively sell right now (excludes future "coming soon" lines). */
export const ACTIVE_SERVICES = SERVICES.filter((s) => !s.comingSoon);

export function isComingSoon(slug: string | null | undefined): boolean {
    return Boolean(getService(slug)?.comingSoon);
}

const SERVICE_MAP = new Map(SERVICES.map((s) => [s.slug, s]));

export function getService(slug: string | null | undefined): ServiceLine | null {
    return slug ? SERVICE_MAP.get(slug) ?? null : null;
}

export function serviceName(slug: string | null | undefined, locale: "en" | "id" = "en"): string {
    const s = getService(slug);
    if (!s) return "General";
    return locale === "id" ? s.id : s.en;
}

/** Format an IDR amount compactly, e.g. 15000000 -> "Rp 15 jt". */
export function formatIDR(value: number, compact = false): string {
    if (compact) {
        if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
        if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
        if (value >= 1_000) return `Rp ${(value / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`;
    }
    return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}
