import type { MetadataRoute } from "next";

const BASE_URL = "https://plusthe.site";

// Keep admin & internal studio out of every index.
const DISALLOW = ["/admin", "/en/studio", "/id/studio", "/api/"];

// AI search / answer engines we explicitly welcome (for AI-search visibility).
const AI_BOTS = [
    "GPTBot",          // OpenAI training
    "OAI-SearchBot",   // OpenAI search
    "ChatGPT-User",    // ChatGPT browsing
    "ClaudeBot",       // Anthropic
    "anthropic-ai",
    "Claude-Web",
    "PerplexityBot",   // Perplexity
    "Perplexity-User",
    "Google-Extended",  // Gemini / Vertex
    "Applebot-Extended",
    "CCBot",            // Common Crawl (feeds many LLMs)
    "Amazonbot",
    "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: DISALLOW },
            // Explicit allow so AI crawlers can read & cite the site even if
            // a future blanket rule tightens up.
            { userAgent: AI_BOTS, allow: "/", disallow: ["/admin"] },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
