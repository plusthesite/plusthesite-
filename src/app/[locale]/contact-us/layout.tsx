import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return productMetadata({
        locale,
        path: "/contact-us",
        title: "Contact Us — plus.",
        description: "Get in touch with our team for premium AI branding, CRM, and digital agency solutions. We are always ready to assist.",
    });
}

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
