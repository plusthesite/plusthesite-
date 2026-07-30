import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
    const { locale } = await params;

    return productMetadata({
        locale,
        path: "/mobile-app",
        title: "Mobile App Development - Cross-Platform Product Design & Launch | plus.",
        description:
            "Cross-platform mobile app development for brands that need product clarity, clean UX, launch readiness, and maintainable growth.",
    });
}

export default function MobileAppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
