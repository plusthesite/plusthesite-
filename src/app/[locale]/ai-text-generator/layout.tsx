import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
    const { locale } = await params;

    return productMetadata({
        locale,
        path: "/ai-text-generator",
        title: "AI Text Generator - Drafting, SEO Support & Editorial Workflow | plus.",
        description:
            "AI text generation support for campaign copy, long-form drafts, SEO prep, localization, and faster editorial workflows.",
    });
}

export default function AiTextGeneratorLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
