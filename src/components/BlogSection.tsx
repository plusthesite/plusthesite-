"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";

/** Only the fields the three cards render — keeps the 500KB+ article bodies
 *  out of the client bundle. */
export type ArticleTeaser = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
};

export default function BlogSection({
  teasers,
}: {
  teasers: ArticleTeaser[];
}) {
  const ref = useScrollReveal();
  const t = useT();
  const locale = useLocale();

  const latest = teasers;

  const dateLocale = locale === "id" ? "id-ID" : "en-US";

  return (
    <section
      id="blog"
      className="bg-white py-24 text-slate-950 lg:py-32 dark:bg-slate-950 dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              {t.blogSection.tag}
            </p>
            <h2 className="fade-up fade-up-delay-1 mt-5 text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl dark:text-white">
              {t.blogSection.title}
            </h2>
            <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
              {t.blogSection.description}
            </p>
          </div>

          <div className="fade-up fade-up-delay-2 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Editorial pulse
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              {locale === "id"
                ? "Konten dipilih untuk membantu tim memahami apa yang sedang dibangun, bukan cuma mengisi blog."
                : "Content is selected to help teams understand what they are building, not just to fill a blog feed."}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {locale === "id"
                ? "Kami angkat topik yang lebih dekat ke workflow bisnis, AI adoption, dan keputusan digital yang benar-benar memengaruhi operasi."
                : "We highlight topics closer to business workflows, AI adoption, and digital decisions that actually affect operations."}
            </p>
          </div>
        </div>

        <div className="fade-up fade-up-delay-3 mt-14 grid gap-6 lg:grid-cols-3">
          {latest.map((article, index) => (
            <Link
              key={article.id}
              href={`/${locale}/blog/${article.slug}`}
              className={`group flex flex-col overflow-hidden rounded-[1.8rem] border transition ${
                index === 0
                  ? "border-[#0c74eb] bg-[#0c74eb] text-white shadow-[0_24px_70px_rgba(12,116,235,0.3)] dark:border-sky-400"
                  : "border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-[#2a3b5c] dark:bg-[#131e36]"
              }`}
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div
                  className={`absolute inset-0 ${
                    index === 0
                      ? "bg-gradient-to-t from-[#083a78]/90 via-[#0c74eb]/30 to-transparent"
                      : "bg-gradient-to-t from-slate-950/40 to-transparent"
                  }`}
                />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                    index === 0
                      ? "bg-white/12 text-white"
                      : "bg-white/90 text-sky-700 dark:bg-slate-950/90 dark:text-sky-300"
                  }`}
                >
                  {article.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                  <span
                    className={
                      index === 0
                        ? "text-white/55"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  >
                    {new Date(article.date).toLocaleDateString(dateLocale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={
                      index === 0
                        ? "text-white/35"
                        : "text-slate-300 dark:text-white/15"
                    }
                  >
                    /
                  </span>
                  <span
                    className={
                      index === 0
                        ? "text-white/55"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  >
                    {article.readTime} {t.blogSection.readSuffix}
                  </span>
                </div>

                <h3
                  className={`mt-4 line-clamp-2 text-xl font-semibold leading-snug tracking-[-0.02em] ${
                    index === 0
                      ? "text-white"
                      : "text-slate-950 dark:text-white"
                  }`}
                >
                  {article.title}
                </h3>
                <p
                  className={`mt-3 flex-1 line-clamp-3 text-sm leading-6 ${
                    index === 0
                      ? "text-white/72"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {article.description}
                </p>

                <div
                  className={`mt-8 flex items-center gap-2 text-sm font-semibold ${
                    index === 0
                      ? "text-white"
                      : "text-slate-950 dark:text-white"
                  }`}
                >
                  <span>
                    {locale === "id" ? "Baca artikel" : "Read article"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="fade-up fade-up-delay-3 mt-12 text-center">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-105 hover:border-slate-950 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            {t.blogSection.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
