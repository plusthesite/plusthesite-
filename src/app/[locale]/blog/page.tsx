import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogExplorer, { type BlogCard } from "./BlogExplorer";
import { articles } from "@/data/articles";
import { getAllPublishedPosts, getViewsMap } from "@/lib/posts";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);

  const dbPosts = await getAllPublishedPosts();
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const allArticles = [...dbPosts, ...articles.filter((a) => !dbSlugs.has(a.slug))];

  const viewsMap = await getViewsMap();

  const cards: BlogCard[] = allArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    image: a.image,
    category: a.category,
    date: a.date,
    readTime: a.readTime,
    locale: (a.locale ?? "id") as Locale,
    views: viewsMap[a.slug] ?? 0,
  }));

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-[#f5f4ef] pb-24 pt-32 dark:bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.10),_transparent_20%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                {t.blog.tag}
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-[#0F172A] dark:text-[#F8FAFC] sm:text-5xl">
                {t.blog.title}
              </h1>
              <p className="mt-4 text-base leading-8 text-[#475569] dark:text-[#94A3B8]">
                {t.blog.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white dark:bg-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                  Editorial hub
                </p>
                <p className="mt-4 text-lg font-semibold">
                  {locale === "id"
                    ? "Insight yang lebih dekat ke keputusan bisnis nyata."
                    : "Insight built closer to real operating decisions."}
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Best for
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                  {locale === "id"
                    ? "Founder, operator, dan tim growth."
                    : "Founders, operators, and growth teams."}
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Library mode
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                  {locale === "id"
                    ? "Cari, sortir, dan baca lintas bahasa."
                    : "Search, sort, and read across languages."}
                </p>
              </div>
            </div>
          </div>

          <BlogExplorer
            cards={cards}
            uiLocale={locale}
            labels={{
              all: t.blog.all,
              empty: t.blog.empty,
              readSuffix: t.blog.readSuffix,
              searchPlaceholder: t.blog.searchPlaceholder,
              sortLabel: t.blog.sortLabel,
              sortRecent: t.blog.sortRecent,
              sortMostRead: t.blog.sortMostRead,
              sortSuggested: t.blog.sortSuggested,
              langAll: t.blog.langAll,
              langEN: t.blog.langEN,
              langID: t.blog.langID,
              articlesWord: t.blog.articlesWord,
              viewsWord: t.views,
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
