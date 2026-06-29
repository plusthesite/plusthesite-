import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return productMetadata({
        locale,
        path: "/ai-text-generator",
        title: "AI Text Generator — plus.",
        description: "Write smarter and save time with AI-powered tools. Generate copy, content, and creative writing that connects with your audience.",
    });
}

// Service + Offer (IDR) + Breadcrumb JSON-LD is emitted by ProductPageTemplate.
export default function AiTextGeneratorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
