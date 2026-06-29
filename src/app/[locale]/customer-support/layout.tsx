import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return productMetadata({
        locale,
        path: "/customer-support",
        title: "Customer Support — plus.",
        description: "Smarter decisions, faster resolutions, happier customers. AI-powered support platform that scales with your business.",
    });
}

// Service + Offer (IDR) + Breadcrumb JSON-LD is emitted by ProductPageTemplate.
export default function CustomerSupportLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
