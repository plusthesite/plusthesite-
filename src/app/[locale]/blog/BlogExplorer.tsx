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

  const byLang = useMemo(
    () => (lang === "all" ? cards : cards.filter((c) => c.locale === lang)),
    [cards, lang],
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
          c.category.toLowerCase().includes(q),
      );
    }

    const sorted = [...list];
    if (sort === "recent") {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === "most-read") {
      sorted.sort(
        (a, b) => b.views - a.views || new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else {
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

  const featured = results[0] ?? null;
  const rest = featured ? results.slice(1) : results;
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
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-[#1E293B] dark:bg-[#0B1120] lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {uiLocale === "id" ? "Discovery controls" : "Discovery controls"}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {uiLocale === "id"
                ? "Cari insight berdasarkan bahasa, kategori, atau mode baca yang paling relevan untuk tim Anda."
                : "Search insight by language, category, or the reading mode that best fits your team."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 p-4 text-white dark:bg-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                {uiLocale === "id" ? "Library" : "Library"}
              </p>
              <p className="mt-3 text-2xl font-semibold">{results.length}</p>
              <p className="mt-2 text-xs leading-6 text-white/70">
                {labels.articlesWord}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {uiLocale === "id" ? "Language scope" : "Language scope"}
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">
                {langOptions.find((item) => item.value === lang)?.label}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {uiLocale === "id" ? "Sort mode" : "Sort mode"}
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">
                {sortOptions.find((item) => item.value === sort)?.label}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-[#0F172A] placeholder-slate-400 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-[#F8FAFC]"
            />
          </div>

          <div className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-[#1E293B] dark:bg-slate-950">
            {langOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setLang(o.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  lang === o.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-[#64748B] hover:text-primary dark:text-[#94A3B8]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-[#1E293B] dark:bg-slate-950">
            {sortOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setSort(o.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  sort === o.value
                    ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                    : "text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                category === cat.value
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "border border-slate-200 bg-white text-[#475569] hover:border-primary/30 hover:text-primary dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-[#94A3B8]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {featured ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Link
            href={`/${featured.locale}/blog/${featured.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)] dark:border-[#1E293B] dark:bg-[#0B1120]"
          >
            <div className="relative h-[300px] w-full overflow-hidden sm:h-[360px]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm dark:bg-[#0B1120]/90">
                  {featured.category}
                </span>
                <span className="rounded-full bg-slate-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {uiLocale === "id" ? "Featured read" : "Featured read"}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  {new Date(featured.date).toLocaleDateString(dateLocale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                  {featured.description}
                </p>
              </div>
            </div>
          </Link>

          <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fafc_58%,_#eef6ff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-[#1E293B] dark:bg-[linear-gradient(135deg,_rgba(11,17,32,0.96)_0%,_rgba(15,23,42,0.92)_54%,_rgba(8,47,73,0.84)_100%)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {uiLocale === "id" ? "Editorial frame" : "Editorial frame"}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
              {uiLocale === "id"
                ? "Insight yang diprioritaskan untuk founder, operator, dan tim growth."
                : "Insight prioritized for founders, operators, and growth teams."}
            </h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-950 p-5 text-white dark:bg-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                  {uiLocale === "id" ? "Reading mode" : "Reading mode"}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/78">
                  {sort === "most-read"
                    ? uiLocale === "id"
                      ? "Anda sedang melihat artikel yang paling banyak dilihat terlebih dahulu."
                      : "You are currently viewing the most-read articles first."
                    : sort === "suggested"
                      ? uiLocale === "id"
                        ? "Anda sedang melihat kombinasi konten baru, relevan, dan populer."
                        : "You are currently viewing a mix of fresh, relevant, and popular content."
                      : uiLocale === "id"
                        ? "Anda sedang melihat artikel terbaru terlebih dahulu."
                        : "You are currently viewing the newest articles first."}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {uiLocale === "id" ? "Scope" : "Scope"}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {uiLocale === "id"
                    ? "Blog ini mencakup AI chatbot, CRM, konten, creative ops, dan cara tim digital bergerak lebih rapi."
                    : "This blog covers AI chatbots, CRM, content, creative operations, and how digital teams can move with less chaos."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((article) => (
          <Link
            key={`${article.locale}-${article.slug}`}
            href={`/${article.locale}/blog/${article.slug}`}
            className="feature-card group flex flex-col overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-[#1E293B] dark:bg-[#0B1120]"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm dark:bg-[#0B1120]/90">
                {article.category}
              </span>
              {lang === "all" && (
                <span className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {article.locale}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="line-clamp-2 text-base font-bold leading-snug text-[#0F172A] dark:text-[#F8FAFC]">
                {article.title}
              </h2>
              <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">
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
        <p className="mt-14 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
          {labels.empty}
        </p>
      )}
    </div>
  );
}
