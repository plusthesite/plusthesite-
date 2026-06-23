import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return productMetadata({
        locale,
        path: "/crm",
        title: "CRM Platform — plus.",
        description: "AI-powered CRM that turns leads into loyal customers. Automate workflows, track every deal, and grow revenue predictably.",
    });
}

// Service + Offer (IDR) + Breadcrumb JSON-LD is emitted by ProductPageTemplate.
export default function CrmLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
