import { getSupabaseAdmin } from "@/lib/supabase";
import { articles as staticArticles } from "@/data/articles";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

interface Row {
    slug: string;
    title: string;
    locale: string;
    category: string;
    source: "Static" | "CMS";
    views: number;
}

export default async function AnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ locale?: string }>;
}) {
    const { locale: localeFilter } = await searchParams;
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
        })),
        ...[...cmsEn, ...cmsId].map((a) => ({
            slug: a.slug,
            title: a.title,
            locale: a.locale ?? "en",
            category: a.category,
            source: "CMS" as const,
            views: viewsBySlug.get(a.slug) ?? 0,
        })),
    ];

    const filtered = (localeFilter === "en" || localeFilter === "id" ? rows.filter((r) => r.locale === localeFilter) : rows)
        .sort((a, b) => b.views - a.views);

    const totalViews = rows.reduce((s, r) => s + r.views, 0);
    const tracked = rows.filter((r) => r.views > 0).length;

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Content Analytics</h1>
                    <p className="mt-1 text-sm text-slate-500">Every article — static + CMS — ranked by real views.</p>
                </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Articles</p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900">{rows.length.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Views</p>
                    <p className="mt-2 text-3xl font-extrabold text-amber-600">{totalViews.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Articles With Views</p>
                    <p className="mt-2 text-3xl font-extrabold text-blue-600">{tracked.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
                {[["", "All"], ["en", "English"], ["id", "Indonesia"]].map(([val, label]) => (
                    <a
                        key={val}
                        href={val ? `/admin/analytics?locale=${val}` : "/admin/analytics"}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${(localeFilter ?? "") === val ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                        {label}
                    </a>
                ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-semibold">#</th>
                            <th className="px-4 py-3 font-semibold">Article</th>
                            <th className="px-4 py-3 font-semibold">Lang</th>
                            <th className="px-4 py-3 font-semibold">Source</th>
                            <th className="px-4 py-3 font-semibold text-right">Views</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((r, i) => (
                            <tr key={`${r.locale}-${r.slug}`} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-slate-800 line-clamp-1">{r.title}</p>
                                    <p className="text-xs text-slate-400">{r.category}</p>
                                </td>
                                <td className="px-4 py-3"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-500">{r.locale}</span></td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.source === "CMS" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{r.source}</span>
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-slate-800">{r.views.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right">
                                    <a href={`/${r.locale}/blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:text-blue-800">View</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
