"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";

export interface BlogCard {
    slug: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    locale: Locale;
    views: number;
}

interface Labels {
    all: string;
    empty: string;
    readSuffix: string;
    searchPlaceholder: string;
    sortLabel: string;
    sortRecent: string;
    sortMostRead: string;
    sortSuggested: string;
    langAll: string;
    langEN: string;
    langID: string;
    articlesWord: string;
    viewsWord: string;
}

type LangFilter = "all" | "en" | "id";
type SortKey = "recent" | "most-read" | "suggested";

const ALL = "__all__";
const FEATURED_SLUG = "kenapa-plus-partner-digital-bisnis-indonesia";

export default function BlogExplorer({
    cards,
    uiLocale,
    labels,
}: {
    cards: BlogCard[];
    uiLocale: Locale;
    labels: Labels;
}) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState(ALL);
    const [lang, setLang] = useState<LangFilter>(uiLocale);
    const [sort, setSort] = useState<SortKey>("recent");

    // Language scope first — categories + everything else follow from it.
    const byLang = useMemo(
        () => (lang === "all" ? cards : cards.filter((c) => c.locale === lang)),
        [cards, lang]
    );

    const categories = useMemo(() => {
        const seen = Array.from(new Set(byLang.map((c) => c.category)));
        return [{ value: ALL, label: labels.all }, ...seen.map((c) => ({ value: c, label: c }))];
    }, [byLang, labels.all]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = byLang;
        if (category !== ALL) list = list.filter((c) => c.category === category);
        if (q) {
            list = list.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q) ||
                    c.category.toLowerCase().includes(q)
            );
        }

        const sorted = [...list];
        if (sort === "recent") {
            sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sort === "most-read") {
            sorted.sort(
                (a, b) => b.views - a.views || new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } else {
            // Suggested: blend freshness + real popularity, with a nudge for the
            // cornerstone "why Plus The Site" pillar. No fabricated numbers.
            const times = sorted.map((c) => new Date(c.date).getTime());
            const maxViews = Math.max(1, ...sorted.map((c) => c.views));
            const minT = times.length ? Math.min(...times) : 0;
            const maxT = times.length ? Math.max(...times) : 1;
            const span = Math.max(1, maxT - minT);
            const score = (c: BlogCard) =>
                0.55 * ((new Date(c.date).getTime() - minT) / span) +
                0.45 * (c.views / maxViews) +
                (c.slug === FEATURED_SLUG ? 0.4 : 0);
            sorted.sort((a, b) => score(b) - score(a));
        }
        return sorted;
    }, [byLang, category, query, sort]);

    const dateLocale = uiLocale === "id" ? "id-ID" : "en-US";

    const langOptions: { value: LangFilter; label: string }[] = [
        { value: "all", label: labels.langAll },
        { value: "en", label: labels.langEN },
        { value: "id", label: labels.langID },
    ];
    const sortOptions: { value: SortKey; label: string }[] = [
        { value: "recent", label: labels.sortRecent },
        { value: "most-read", label: labels.sortMostRead },
        { value: "suggested", label: labels.sortSuggested },
    ];

    return (
        <div className="mt-12">
            {/* Controls */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-[#1E293B] dark:bg-[#0B1120] lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {/* Search */}
                <div className="relative flex-1">
                    <svg
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={labels.searchPlaceholder}
                        className="w-full rounded-full border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] py-3 pl-11 pr-4 text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>

                {/* Language segmented */}
                <div className="inline-flex shrink-0 items-center rounded-full border border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-slate-950 p-1">
                    {langOptions.map((o) => (
                        <button
                            key={o.value}
                            onClick={() => setLang(o.value)}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                lang === o.value
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-primary"
                            }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>

                {/* Sort segmented */}
                <div className="inline-flex shrink-0 items-center rounded-full border border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-slate-950 p-1">
                    {sortOptions.map((o) => (
                        <button
                            key={o.value}
                            onClick={() => setSort(o.value)}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                sort === o.value
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                            }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                            category === cat.value
                                ? "bg-primary text-white shadow-md shadow-primary/25"
                                : "border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] text-[#475569] dark:text-[#94A3B8] hover:border-primary/30 hover:text-primary"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Result count */}
            <p className="mt-6 text-center text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                {results.length} {labels.articlesWord}
            </p>
            </div>

            {/* Grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((article) => (
                    <Link
                        key={`${article.locale}-${article.slug}`}
                        href={`/${article.locale}/blog/${article.slug}`}
                        className="feature-card group flex flex-col overflow-hidden rounded-[1.7rem] border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="absolute top-4 left-4 rounded-full bg-white/90 dark:bg-[#0B1120]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
                                {article.category}
                            </span>
                            {lang === "all" && (
                                <span className="absolute top-4 right-4 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                                    {article.locale}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                            <h2 className="text-base font-bold leading-snug text-[#0F172A] dark:text-[#F8FAFC] line-clamp-2">
                                {article.title}
                            </h2>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8] line-clamp-3">
                                {article.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                                <span>
                                    {new Date(article.date).toLocaleDateString(dateLocale, {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                                <span>
                                    {sort === "most-read" && article.views > 0
                                        ? `${article.views.toLocaleString()} ${labels.viewsWord}`
                                        : `${article.readTime} ${labels.readSuffix}`}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {results.length === 0 && (
                <p className="mt-14 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">{labels.empty}</p>
            )}
        </div>
    );
}
