/**
 * On-page SEO scorer for blog articles (0–100 rubric).
 *
 * A fully optimized, rich article (good meta, focus keyword, 900+ words,
 * 3+ H2s, an alt-tagged inline image, an internal link, and rich elements
 * like tables/stat cards/blockquotes) scores 100. Thin filler scores low.
 *
 * Used by the admin analytics panel so editors can verify every article
 * meets the bar after a rewrite, then revise what falls short.
 */

export interface SeoCheck {
    key: string;
    label: string;
    points: number;
    max: number;
}

export interface SeoResult {
    score: number;
    max: number;
    checks: SeoCheck[];
}

interface ScoreInput {
    title?: string | null;
    description?: string | null;
    content?: string | null;
    tags?: string[] | null;
}

const MATCH_H2 = /<h2[\s>]/gi;
const MATCH_IMG = /<img\b/gi;
const MATCH_IMG_ALT = /<img\b[^>]*\balt=["'][^"']+["']/gi;
const MATCH_INTERNAL_LINK = /<a\b[^>]*\bhref=["']\/[^"']/gi;
const MATCH_RICH = /(class=["'][^"']*\b(stat-grid|callout)\b|<table\b|<blockquote\b)/i;

function countWords(html: string): number {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z]+;/gi, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
}

function band(value: number, full: [number, number], half: [number, number], points: number): number {
    if (value >= full[0] && value <= full[1]) return points;
    if (value >= half[0] && value <= half[1]) return Math.round(points / 2);
    return 0;
}

export function scoreArticleSeo(input: ScoreInput): SeoResult {
    const title = (input.title ?? "").trim();
    const description = (input.description ?? "").trim();
    const content = input.content ?? "";
    const tags = input.tags ?? [];

    const words = countWords(content);
    const h2 = (content.match(MATCH_H2) ?? []).length;
    const imgs = (content.match(MATCH_IMG) ?? []).length;
    const imgsWithAlt = (content.match(MATCH_IMG_ALT) ?? []).length;
    const internalLinks = (content.match(MATCH_INTERNAL_LINK) ?? []).length;
    const hasRich = MATCH_RICH.test(content);

    // Focus keyword = first tag; reward its presence in title + meta.
    // Normalize away punctuation so tags like "plus." still match "Plus The Site".
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    const focusNorm = norm(tags[0] ?? "");
    const focusHead = focusNorm.split(" ").find((w) => w.length >= 3) ?? focusNorm;
    const inTitle = !!focusHead && norm(title).includes(focusHead);
    const inDesc = !!focusHead && norm(description).includes(focusHead);

    const checks: SeoCheck[] = [
        {
            key: "title",
            label: "Title length (30–65 chars)",
            max: 15,
            points: band(title.length, [30, 65], [20, 75], 15),
        },
        {
            key: "meta",
            label: "Meta description (110–165 chars)",
            max: 15,
            points: band(description.length, [110, 165], [70, 185], 15),
        },
        {
            key: "keyword",
            label: "Focus keyword in title & meta",
            max: 10,
            points: (inTitle ? 5 : 0) + (inDesc ? 5 : 0),
        },
        {
            key: "words",
            label: "Word count (900+ ideal)",
            max: 20,
            points: words >= 900 ? 20 : words >= 600 ? 13 : words >= 300 ? 6 : 0,
        },
        {
            key: "headings",
            label: "Subheadings (3+ H2)",
            max: 12,
            points: h2 >= 3 ? 12 : h2 >= 2 ? 8 : h2 >= 1 ? 4 : 0,
        },
        {
            key: "images",
            label: "Inline image with alt text",
            max: 10,
            points: imgs >= 1 && imgsWithAlt >= 1 ? 10 : imgs >= 1 ? 4 : 0,
        },
        {
            key: "internal",
            label: "Internal link",
            max: 8,
            points: internalLinks >= 2 ? 8 : internalLinks >= 1 ? 5 : 0,
        },
        {
            key: "rich",
            label: "Rich elements (table / stat / quote)",
            max: 10,
            points: hasRich ? 10 : 0,
        },
    ];

    const score = checks.reduce((s, c) => s + c.points, 0);
    const max = checks.reduce((s, c) => s + c.max, 0);
    return { score, max, checks };
}

/** Convenience: just the numeric score. */
export function seoScore(input: ScoreInput): number {
    return scoreArticleSeo(input).score;
}
