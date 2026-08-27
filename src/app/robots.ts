import type { MetadataRoute } from "next";

const BASE_URL = "https://plusthe.site";

// Keep admin out of every index. The studio moved to its own subdomain and
// carries its own robots rules.
const DISALLOW = ["/admin", "/api/"];

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
