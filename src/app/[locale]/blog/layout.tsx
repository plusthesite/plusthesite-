import type { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, defaultLocale } from "@/i18n/config";

const SITE = "https://plusthe.site";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const loc = isLocale(locale) ? locale : defaultLocale;
    const t = getDictionary(loc);

    return {
        title: `${t.blog.title}, plus.`,
        description: t.blog.description,
        alternates: {
            canonical: `${SITE}/${loc}/blog`,
            languages: {
                en: `${SITE}/en/blog`,
                id: `${SITE}/id/blog`,
                "x-default": `${SITE}/en/blog`,
            },
        },
        openGraph: {
            title: `${t.blog.title}, plus.`,
            description: t.blog.description,
            type: "website",
            url: `${SITE}/${loc}/blog`,
        },
    };
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
