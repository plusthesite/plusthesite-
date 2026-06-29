import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return productMetadata({
        locale,
        path: "/ai-image-generator",
        title: "AI Image Generator — plus.",
        description: "Create beautiful art with artificial intelligence. Three APIs integrated: OpenAI, Stable Diffusion, and Stability AI — 100+ models combined.",
    });
}

// Service + Offer (IDR) + Breadcrumb JSON-LD is emitted by ProductPageTemplate.
export default function AiImageGeneratorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
