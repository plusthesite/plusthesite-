import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
    const { locale } = await params;

    return productMetadata({
        locale,
        path: "/customer-support",
        title: "Customer Support - Response Flow, Escalation & Knowledge Support | plus.",
        description:
            "Customer support workflow support for faster response handling, cleaner escalation, operator handoff, and AI-assisted knowledge flow.",
    });
}

export default function CustomerSupportLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
