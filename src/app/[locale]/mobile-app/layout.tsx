import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
    const { locale } = await params;

    return productMetadata({
        locale,
        path: "/mobile-app",
        title: "Mobile App Development - Product Framing, Launch Planning & Delivery | plus.",
        description:
            "Mobile app development offering in preparation, focused on product framing, launch planning, release workflow, and maintainable delivery.",
    });
}

export default function MobileAppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
