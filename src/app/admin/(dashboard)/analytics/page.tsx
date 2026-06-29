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

export default async function AnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ locale?: string; category?: string; sort?: string }>;
}) {
    const { locale: localeFilter, category: categoryFilter, sort: sortParam } = await searchParams;
    const supabase = getSupabaseAdmin();

    // Per-article view counts (slug -> views).
    const viewsBySlug = new Map<string, number>();
    if (supabase) {
        const { data } = await supabase.from("article_views").select("slug, views");
        for (const v of (data ?? []) as { slug: string; views: number }[]) {
            viewsBySlug.set(v.slug, Number(v.views) || 0);
        }
    }

    // Merge every article: static SSG + live CMS posts.
    const [cmsEn, cmsId] = await Promise.all([getPublishedPosts("en"), getPublishedPosts("id")]);
    const rows: Row[] = [
        ...staticArticles.map((a) => ({
            slug: a.slug,
            title: a.title,
            locale: a.locale ?? "id",
            category: a.category,
            source: "Static" as const,
            views: viewsBySlug.get(a.slug) ?? 0,
            score: scoreArticleSeo(a).score,
        })),
        ...[...cmsEn, ...cmsId].map((a) => ({
            slug: a.slug,
            title: a.title,
            locale: a.locale ?? "en",
            category: a.category,
            source: "CMS" as const,
            views: viewsBySlug.get(a.slug) ?? 0,
            score: scoreArticleSeo(a).score,
        })),
    ];

    // Unique categories
    const categories = Array.from(new Set(rows.map((r) => r.category))).sort();

    let filtered = rows;
    if (localeFilter === "en" || localeFilter === "id") filtered = filtered.filter((r) => r.locale === localeFilter);
    if (categoryFilter) filtered = filtered.filter((r) => r.category === categoryFilter);
    const seoSort = sortParam === "seo";
    if (seoSort) filtered.sort((a, b) => a.score - b.score || b.views - a.views);
    else filtered.sort((a, b) => b.views - a.views);

    const totalViews = rows.reduce((s, r) => s + r.views, 0);
    const tracked = rows.filter((r) => r.views > 0).length;
    const cmsCount = rows.filter((r) => r.source === "CMS").length;
    const staticCount = rows.filter((r) => r.source === "Static").length;
    const maxViews = Math.max(...filtered.map((r) => r.views), 1);

    // SEO health (rubric 0–100; target 100)
    const avgScore = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;
    const atTarget = rows.filter((r) => r.score >= 100).length;
    const needsWork = rows.filter((r) => r.score < 90).length;
    const scoreColor = (n: number) =>
        n >= 100 ? "text-emerald-600 bg-emerald-50" : n >= 85 ? "text-blue-600 bg-blue-50" : n >= 70 ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50";

    // Top 5 categories by views
    const categoryViews = new Map<string, number>();
    for (const r of rows) {
        categoryViews.set(r.category, (categoryViews.get(r.category) ?? 0) + r.views);
    }
    const topCategories = Array.from(categoryViews.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    const maxCatViews = Math.max(...topCategories.map(([, v]) => v), 1);

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Content Analytics</h1>
                    <p className="mt-1 text-sm text-slate-500">Every article — static + CMS — ranked by real views.</p>
                </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Articles</p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900">{rows.length.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-slate-400">{staticCount} static · {cmsCount} CMS</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Views</p>
                    <p className="mt-2 text-3xl font-extrabold text-amber-600">{totalViews.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-slate-400">{tracked > 0 ? `${Math.round(totalViews / tracked)} avg/article` : "—"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Articles With Views</p>
                    <p className="mt-2 text-3xl font-extrabold text-blue-600">{tracked.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-slate-400">{rows.length > 0 ? `${Math.round((tracked / rows.length) * 100)}% coverage` : "—"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Categories</p>
                    <p className="mt-2 text-3xl font-extrabold text-violet-600">{categories.length}</p>
                    <p className="mt-1 text-xs text-slate-400">{categories.length > 0 ? `Top: ${topCategories[0]?.[0] ?? "—"}` : "—"}</p>
                </div>
            </div>

            {/* SEO health */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">SEO Health</h2>
                    <span className="text-xs text-slate-400">Rubric 0–100 · target 100 / article</span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Average Score</p>
                        <p className="mt-1 text-3xl font-extrabold text-slate-900">{avgScore}<span className="text-base font-bold text-slate-400">/100</span></p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">At Target (100)</p>
                        <p className="mt-1 text-3xl font-extrabold text-emerald-600">{atTarget}<span className="text-base font-bold text-slate-400"> / {rows.length}</span></p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Needs Work (&lt;90)</p>
                        <p className="mt-1 text-3xl font-extrabold text-rose-600">{needsWork}</p>
                    </div>
                </div>
            </div>

            {/* Top categories bar chart */}
            {topCategories.length > 0 && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">Views by Category</h2>
                    <div className="mt-4 space-y-3">
                        {topCategories.map(([cat, views]) => (
                            <div key={cat} className="flex items-center gap-3">
                                <Link href={`/admin/analytics?category=${encodeURIComponent(cat)}`} className="w-32 shrink-0 truncate text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors">{cat}</Link>
                                <div className="flex-1">
                                    <div className="h-6 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                                            style={{ width: `${Math.max((views / maxCatViews) * 100, 2)}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="w-16 text-right text-xs font-semibold text-slate-700">{views.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
                {[["", "All"], ["en", "English"], ["id", "Indonesia"]].map(([val, label]) => (
                    <Link
                        key={val}
                        href={val ? `/admin/analytics?locale=${val}` : "/admin/analytics"}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${(localeFilter ?? "") === val && !categoryFilter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                        {label}
                    </Link>
                ))}
                <span className="mx-1 text-slate-300">|</span>
                {categories.slice(0, 8).map((cat) => (
                    <Link
                        key={cat}
                        href={`/admin/analytics?category=${encodeURIComponent(cat)}`}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${categoryFilter === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                        {cat}
                    </Link>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs">
                <span className="text-slate-400">Sort:</span>
                <Link
                    href={`/admin/analytics${[localeFilter ? `locale=${localeFilter}` : "", categoryFilter ? `category=${encodeURIComponent(categoryFilter)}` : ""].filter(Boolean).length ? "?" + [localeFilter ? `locale=${localeFilter}` : "", categoryFilter ? `category=${encodeURIComponent(categoryFilter)}` : ""].filter(Boolean).join("&") : ""}`}
                    className={`rounded-full px-3 py-1 font-semibold transition-colors ${!seoSort ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    Most viewed
                </Link>
                <Link
                    href={`/admin/analytics?${[localeFilter ? `locale=${localeFilter}` : "", categoryFilter ? `category=${encodeURIComponent(categoryFilter)}` : "", "sort=seo"].filter(Boolean).join("&")}`}
                    className={`rounded-full px-3 py-1 font-semibold transition-colors ${seoSort ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    Lowest SEO
                </Link>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
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
                                <tr><td colSpan={7} className="px-4 py-12 text-center">
                                    <div className="mx-auto max-w-xs">
                                        <svg className="mx-auto h-10 w-10 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        <p className="mt-2 text-sm font-medium text-slate-400">No articles match these filters</p>
                                    </div>
                                </td></tr>
                            )}
                            {filtered.map((r, i) => (
                                <tr key={`${r.locale}-${r.slug}`} className="transition-colors hover:bg-slate-50/80">
                                    <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-800 line-clamp-1">{r.title}</p>
                                        <p className="text-xs text-slate-400">{r.category}</p>
                                    </td>
                                    <td className="px-4 py-3"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-500">{r.locale}</span></td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.source === "CMS" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{r.source}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${scoreColor(r.score)}`}>{r.score}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-20 rounded-full bg-slate-100 overflow-hidden">
                                                <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${Math.max((r.views / maxViews) * 100, 1)}%` }} />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-800">{r.views.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <a href={`/${r.locale}/blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">View ↗</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
