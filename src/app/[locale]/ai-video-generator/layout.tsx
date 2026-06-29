import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return productMetadata({
        locale,
        path: "/ai-video-generator",
        title: "AI Video Generator — plus.",
        description: "Text-to-Video generation for seamless integration and engaging multimedia content. Create professional videos in minutes, not days.",
    });
}

// Service + Offer (IDR) + Breadcrumb JSON-LD is emitted by ProductPageTemplate.
export default function AiVideoGeneratorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
