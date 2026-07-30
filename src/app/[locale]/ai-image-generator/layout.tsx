import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
    const { locale } = await params;

    return productMetadata({
        locale,
        path: "/ai-image-generator",
        title: "AI Image Generator - Creative Direction, Variations & Visual Workflow | plus.",
        description:
            "AI image generation support for campaign visuals, concept frames, creative variations, and faster design workflow exploration.",
    });
}

export default function AiImageGeneratorLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
