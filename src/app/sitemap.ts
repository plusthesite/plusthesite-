import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { locales } from "@/i18n/config";
import { getPublishedPosts } from "@/lib/posts";

const BASE_URL = "https://plusthe.site";

function withAlternates(path: string) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
        languages[locale] = `${BASE_URL}/${locale}${path}`;
    }
    languages["x-default"] = `${BASE_URL}/en${path}`;
    return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPaths: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
        { path: "", changeFrequency: "weekly", priority: 1 },
        { path: "/blog", changeFrequency: "daily", priority: 0.9 },
        { path: "/chat-bot", changeFrequency: "monthly", priority: 0.8 },
        { path: "/digital-agency", changeFrequency: "monthly", priority: 0.8 },
        { path: "/mobile-game", changeFrequency: "monthly", priority: 0.7 },
        { path: "/mobile-app", changeFrequency: "monthly", priority: 0.7 },
        { path: "/crm", changeFrequency: "monthly", priority: 0.7 },
        { path: "/customer-support", changeFrequency: "monthly", priority: 0.7 },
        { path: "/contact-us", changeFrequency: "monthly", priority: 0.6 },
        { path: "/ai-image-generator", changeFrequency: "monthly", priority: 0.6 },
        { path: "/ai-text-generator", changeFrequency: "monthly", priority: 0.6 },
        { path: "/ai-video-generator", changeFrequency: "monthly", priority: 0.6 },
        { path: "/ai-music-generator", changeFrequency: "monthly", priority: 0.6 },
    ];

    const entries: MetadataRoute.Sitemap = [];

    // Static routes per locale (each with hreflang alternates)
    for (const { path, changeFrequency, priority } of staticPaths) {
        for (const locale of locales) {
            entries.push({
                url: `${BASE_URL}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency,
                priority,
                alternates: { languages: withAlternates(path) },
            });
        }
    }

    // Static (SSG) blog articles — each emitted only under its own language
    const seen = new Set<string>();
    for (const article of articles) {
        const locale = article.locale ?? "id";
        const url = `${BASE_URL}/${locale}/blog/${article.slug}`;
        seen.add(url);
        entries.push({
            url,
            lastModified: new Date(article.date),
            changeFrequency: "monthly",
            priority: 0.7,
            alternates: { languages: { [locale]: url, "x-default": url } },
        });
    }

    // Live CMS posts (published) — pulled per locale so new articles
    // published from the admin dashboard are indexed automatically.
    const cmsPosts = (await Promise.all(locales.map((l) => getPublishedPosts(l as "en" | "id")))).flat();
    for (const post of cmsPosts) {
        const locale = post.locale ?? "en";
        const url = `${BASE_URL}/${locale}/blog/${post.slug}`;
        if (seen.has(url)) continue;
        seen.add(url);
        entries.push({
            url,
            lastModified: post.date ? new Date(post.date) : new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
            alternates: { languages: { [locale]: url, "x-default": url } },
        });
    }

    return entries;
}
