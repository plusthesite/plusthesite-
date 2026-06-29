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

    // Live CMS posts win over static seeds with the same slug; remaining static
    // articles fill in the rest. We load BOTH languages so the language filter
    // can switch between all / English / Indonesian on the client.
    const dbPosts = await getAllPublishedPosts();
    const dbSlugs = new Set(dbPosts.map((p) => p.slug));
    const allArticles = [...dbPosts, ...articles.filter((a) => !dbSlugs.has(a.slug))];

    const viewsMap = await getViewsMap();

    // Ship a lightweight shape to the client — never the full article body.
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
            <main className="bg-background pt-32 pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Header */}
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                            {t.blog.tag}
                        </span>
                        <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-5xl">
                            {t.blog.title}
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                            {t.blog.description}
                        </p>
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
