import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return productMetadata({
        locale,
        path: "/mobile-app",
        title: "Mobile App Development — plus.",
        description: "Beautiful, performant mobile apps that users love. From concept to App Store — we handle the entire journey.",
    });
}

// Service + Offer (IDR) + Breadcrumb JSON-LD is emitted by ProductPageTemplate.
export default function MobileAppLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
