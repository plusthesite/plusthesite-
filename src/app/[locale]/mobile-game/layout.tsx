import type { Metadata } from "next";
import { defaultLocale, isLocale } from "@/i18n/config";

const SITE = "https://plusthe.site";

const meta = {
    en: {
        title: "Mobile Game Development - Production, Backend & Live Ops | plus.",
        description:
            "Mobile game development support for gameplay systems, Unity production, backend planning, and live-ops-ready launch execution.",
        keywords: [
            "mobile game development",
            "Unity game studio",
            "game backend planning",
            "live ops support",
            "multiplayer game production",
            "mobile game studio",
        ],
    },
    id: {
        title: "Jasa Pembuatan Game Mobile - Produksi, Backend & Live Ops | plus.",
        description:
            "Support pengembangan game mobile untuk gameplay system, produksi Unity, perencanaan backend, dan eksekusi launch yang siap live ops.",
        keywords: [
            "jasa pembuatan game mobile",
            "studio game Unity",
            "perencanaan backend game",
            "live ops game",
            "pengembangan game multiplayer",
            "mobile game studio Indonesia",
        ],
    },
} as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const loc = isLocale(locale) ? locale : defaultLocale;
    const m = meta[loc];

    return {
        title: m.title,
        description: m.description,
        keywords: [...m.keywords],
        alternates: {
            canonical: `${SITE}/${loc}/mobile-game`,
            languages: {
                en: `${SITE}/en/mobile-game`,
                id: `${SITE}/id/mobile-game`,
                "x-default": `${SITE}/en/mobile-game`,
            },
        },
        openGraph: {
            title: m.title,
            description: m.description,
            type: "website",
            url: `${SITE}/${loc}/mobile-game`,
            locale: loc === "id" ? "id_ID" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: m.title,
            description: m.description,
        },
    };
}

export default function MobileGameLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
