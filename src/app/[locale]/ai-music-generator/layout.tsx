import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return productMetadata({
        locale,
        path: "/ai-music-generator",
        title: "AI Music Generator — plus.",
        description: "Create music generated using text. Text-to-Music generation API for seamless integration and engaging audio content creation.",
    });
}

// Service + Offer (IDR) + Breadcrumb JSON-LD is emitted by ProductPageTemplate.
export default function AiMusicGeneratorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
