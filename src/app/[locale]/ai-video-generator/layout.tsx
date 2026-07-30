import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
    const { locale } = await params;

    return productMetadata({
        locale,
        path: "/ai-video-generator",
        title: "AI Video Generator - Scripted Drafts, Captions & Format Scaling | plus.",
        description:
            "AI video generation support for promo drafts, explainer formats, caption flow, and faster multi-format video production.",
    });
}

export default function AiVideoGeneratorLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
