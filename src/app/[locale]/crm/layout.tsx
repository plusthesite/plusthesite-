import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
    const { locale } = await params;

    return productMetadata({
        locale,
        path: "/crm",
        title: "CRM Platform - Lead Flow, Pipeline Visibility & Follow-Up Logic | plus.",
        description:
            "CRM platform support for lead intake, pipeline tracking, follow-up workflows, and cleaner sales operations.",
    });
}

export default function CrmLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
