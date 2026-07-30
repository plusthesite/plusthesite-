import type { Metadata } from "next";
import { defaultLocale, isLocale } from "@/i18n/config";

const SITE = "https://plusthe.site";

const meta = {
    en: {
        title: "Digital Agency - Branding, Content Systems & Launch Support | plus.",
        description:
            "Digital agency support for brand strategy, landing pages, content systems, and AI-assisted campaign execution.",
        keywords: [
            "digital agency",
            "branding agency",
            "campaign strategy",
            "landing page design",
            "creative systems",
            "content operations",
        ],
    },
    id: {
        title: "Digital Agency Indonesia - Strategi Brand, Konten & Launch | plus.",
        description:
            "Digital agency untuk strategi brand, landing page, sistem konten, dan eksekusi campaign berbantu AI.",
        keywords: [
            "digital agency Indonesia",
            "jasa branding",
            "strategi campaign",
            "landing page",
            "sistem konten",
            "agensi kreatif Indonesia",
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
            canonical: `${SITE}/${loc}/digital-agency`,
            languages: {
                en: `${SITE}/en/digital-agency`,
                id: `${SITE}/id/digital-agency`,
                "x-default": `${SITE}/en/digital-agency`,
            },
        },
        openGraph: {
            title: m.title,
            description: m.description,
            type: "website",
            url: `${SITE}/${loc}/digital-agency`,
            locale: loc === "id" ? "id_ID" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: m.title,
            description: m.description,
        },
    };
}

export default function DigitalAgencyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
