import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { articles as staticArticles } from "@/data/articles";
import { getPublishedPosts } from "@/lib/posts";
import { scoreArticleSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Row {
  slug: string;
  title: string;
  locale: string;
  category: string;
  source: "Static" | "CMS";
  views: number;
  score: number;
}

const localeLabels: Record<string, string> = {
  en: "English",
  id: "Indonesia",
};

function buildAnalyticsHref(params: {
  locale?: string;
  category?: string;
  sort?: string;
}) {
  const query = new URLSearchParams();
  if (params.locale) query.set("locale", params.locale);
  if (params.category) query.set("category", params.category);
  if (params.sort) query.set("sort", params.sort);
  const search = query.toString();
  return `/admin/analytics${search ? `?${search}` : ""}`;
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string; category?: string; sort?: string }>;
}) {
  const {
    locale: localeFilter,
    category: categoryFilter,
    sort: sortParam,
  } = await searchParams;
  const supabase = getSupabaseAdmin();

  const viewsBySlug = new Map<string, number>();
  if (supabase) {
    const { data } = await supabase.from("article_views").select("slug, views");
    for (const v of (data ?? []) as { slug: string; views: number }[]) {
      viewsBySlug.set(v.slug, Number(v.views) || 0);
    }
  }

  const [cmsEn, cmsId] = await Promise.all([
    getPublishedPosts("en"),
    getPublishedPosts("id"),
  ]);

  const rows: Row[] = [
    ...staticArticles.map((article) => ({
      slug: article.slug,
      title: article.title,
      locale: article.locale ?? "id",
      category: article.category,
      source: "Static" as const,
      views: viewsBySlug.get(article.slug) ?? 0,
      score: scoreArticleSeo(article).score,
    })),
    ...[...cmsEn, ...cmsId].map((article) => ({
      slug: article.slug,
      title: article.title,
      locale: article.locale ?? "en",
      category: article.category,
      source: "CMS" as const,
      views: viewsBySlug.get(article.slug) ?? 0,
      score: scoreArticleSeo(article).score,
    })),
  ];

  const categories = Array.from(
    new Set(rows.map((row) => row.category)),
  ).sort();

  let filtered = rows;
  if (localeFilter === "en" || localeFilter === "id") {
    filtered = filtered.filter((row) => row.locale === localeFilter);
  }
  if (categoryFilter) {
    filtered = filtered.filter((row) => row.category === categoryFilter);
  }

  const seoSort = sortParam === "seo";
  if (seoSort) {
    filtered = [...filtered].sort(
      (a, b) => a.score - b.score || b.views - a.views,
    );
  } else {
    filtered = [...filtered].sort((a, b) => b.views - a.views);
  }

  const totalViews = rows.reduce((sum, row) => sum + row.views, 0);
  const tracked = rows.filter((row) => row.views > 0).length;
  const cmsCount = rows.filter((row) => row.source === "CMS").length;
  const staticCount = rows.filter((row) => row.source === "Static").length;
  const maxViews = Math.max(...filtered.map((row) => row.views), 1);
  const avgScore = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length)
    : 0;
  const atTarget = rows.filter((row) => row.score >= 100).length;
  const needsWork = rows.filter((row) => row.score < 90).length;
  const bestViewed = [...rows].sort((a, b) => b.views - a.views)[0] ?? null;
  const coverage = rows.length ? Math.round((tracked / rows.length) * 100) : 0;

  const scoreColor = (score: number) =>
    score >= 100
      ? "text-emerald-700 bg-emerald-50 ring-emerald-200"
      : score >= 85
        ? "text-sky-700 bg-sky-50 ring-sky-200"
        : score >= 70
          ? "text-amber-700 bg-amber-50 ring-amber-200"
          : "text-rose-700 bg-rose-50 ring-rose-200";

  const categoryViews = new Map<string, number>();
  for (const row of rows) {
    categoryViews.set(
      row.category,
      (categoryViews.get(row.category) ?? 0) + row.views,
    );
  }
  const topCategories = Array.from(categoryViews.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCategoryViews = Math.max(
    ...topCategories.map(([, views]) => views),
    1,
  );

  const localeBreakdown = ["id", "en"].map((locale) => {
    const items = rows.filter((row) => row.locale === locale);
    const views = items.reduce((sum, row) => sum + row.views, 0);
    return {
      locale,
      count: items.length,
      views,
    };
  });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(129,140,248,0.14),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Content cockpit
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Content analytics that shows what is read, what ranks, and what
              needs repair next.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Satu view untuk artikel static dan CMS, lengkap dengan coverage,
              SEO health, dan kategori yang paling narik traffic.
            </p>
          </div>

          <div className="grid min-w-[260px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Top article
              </p>
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">
                {bestViewed?.title ?? "Belum ada artikel dengan view"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {bestViewed
                  ? `${bestViewed.views.toLocaleString()} views · ${localeLabels[bestViewed.locale] ?? bestViewed.locale}`
                  : "Tracking masih kosong"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-950 p-4 text-white shadow-lg shadow-slate-950/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                SEO health
              </p>
              <p className="mt-2 text-3xl font-black">{avgScore}/100</p>
              <p className="mt-1 text-xs text-slate-300">
                {needsWork} article perlu perbaikan prioritas
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Total articles
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {rows.length.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {staticCount} static · {cmsCount} CMS
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
              Total views
            </p>
            <p className="mt-3 text-3xl font-black text-amber-700">
              {totalViews.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-amber-800/70">
              {tracked > 0
                ? `${Math.round(totalViews / tracked)} average per tracked article`
                : "Belum ada data view"}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
              Tracking coverage
            </p>
            <p className="mt-3 text-3xl font-black text-sky-700">{coverage}%</p>
            <p className="mt-2 text-xs text-sky-800/70">
              {tracked.toLocaleString()} artikel sudah punya view
            </p>
          </div>
          <div className="rounded-2xl border border-violet-200/80 bg-violet-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700/70">
              Categories
            </p>
            <p className="mt-3 text-3xl font-black text-violet-700">
              {categories.length}
            </p>
            <p className="mt-2 text-xs text-violet-800/70">
              Top: {topCategories[0]?.[0] ?? "Belum ada kategori"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                SEO Health
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Rubric 0-100. Target ideal: 100 per article.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              {atTarget} at target
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Average score
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {avgScore}
                <span className="ml-1 text-base font-bold text-slate-400">
                  /100
                </span>
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700/70">
                At target
              </p>
              <p className="mt-2 text-3xl font-black text-emerald-700">
                {atTarget}
              </p>
              <p className="mt-1 text-xs text-emerald-800/70">
                dari {rows.length} article
              </p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700/70">
                Needs work
              </p>
              <p className="mt-2 text-3xl font-black text-rose-700">
                {needsWork}
              </p>
              <p className="mt-1 text-xs text-rose-800/70">score di bawah 90</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Locale mix
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Breakdown artikel dan traffic per bahasa.
            </p>
          </div>
          <div className="mt-5 space-y-4">
            {localeBreakdown.map((item) => {
              const width =
                totalViews > 0
                  ? Math.max((item.views / totalViews) * 100, 8)
                  : 8;
              return (
                <div key={item.locale}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {localeLabels[item.locale] ?? item.locale}
                    </span>
                    <span className="text-slate-400">
                      {item.count} article · {item.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {topCategories.length > 0 && (
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                Views by category
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Kategori dengan traffic tertinggi saat ini.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              Top {topCategories.length}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {topCategories.map(([category, views], index) => (
              <div
                key={category}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-[32px_minmax(0,1fr)_80px]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={buildAnalyticsHref({
                        locale: localeFilter,
                        category,
                        sort: sortParam,
                      })}
                      className="truncate text-sm font-semibold text-slate-800 transition-colors hover:text-sky-600"
                    >
                      {category}
                    </Link>
                    <span className="text-xs text-slate-400">
                      {views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
                      style={{
                        width: `${Math.max(
                          (views / maxCategoryViews) * 100,
                          6,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="hidden items-center justify-end text-sm font-semibold text-slate-700 sm:flex">
                  {Math.round((views / Math.max(totalViews, 1)) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Article leaderboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Filter by locale, category, lalu urutkan berdasarkan performa atau
              SEO risk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href={buildAnalyticsHref({
                locale: localeFilter,
                category: categoryFilter,
              })}
              className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                !seoSort
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Most viewed
            </Link>
            <Link
              href={buildAnalyticsHref({
                locale: localeFilter,
                category: categoryFilter,
                sort: "seo",
              })}
              className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                seoSort
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Lowest SEO
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {[
            ["", "All"],
            ["en", "English"],
            ["id", "Indonesia"],
          ].map(([value, label]) => (
            <Link
              key={value}
              href={buildAnalyticsHref({
                locale: value || undefined,
                category: categoryFilter,
                sort: sortParam,
              })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                (localeFilter ?? "") === value
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </Link>
          ))}
          <span className="mx-1 hidden text-slate-300 sm:inline">|</span>
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category}
              href={buildAnalyticsHref({
                locale: localeFilter,
                category,
                sort: sortParam,
              })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                categoryFilter === category
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Article</th>
                  <th className="px-4 py-3 font-semibold">Lang</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">SEO</th>
                  <th className="px-4 py-3 font-semibold">Views</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="mx-auto max-w-xs">
                        <svg
                          className="mx-auto h-10 w-10 text-slate-200"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-slate-400">
                          No articles match these filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {filtered.map((row, index) => (
                  <tr
                    key={`${row.locale}-${row.slug}`}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-1 font-medium text-slate-800">
                        {row.title}
                      </p>
                      <p className="text-xs text-slate-400">{row.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-500">
                        {row.locale}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          row.source === "CMS"
                            ? "bg-sky-50 text-sky-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {row.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${scoreColor(row.score)}`}
                      >
                        {row.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                            style={{
                              width: `${Math.max(
                                (row.views / maxViews) * 100,
                                1,
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {row.views.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/${row.locale}/blog/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-sky-600 transition-colors hover:text-sky-800"
                      >
                        View {"->"}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
