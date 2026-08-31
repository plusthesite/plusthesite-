import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import PlusCursor from "@/components/PlusCursor";
import ITSolutions from "@/components/ITSolutions";
import BlogSection, { type ArticleTeaser } from "@/components/BlogSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, defaultLocale } from "@/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : defaultLocale);

  // Server-side: pick the 3 newest teasers for this locale. Only these small
  // objects reach the client - the article bodies stay out of the bundle.
  const teasers: ArticleTeaser[] = [...articles]
    .filter((article) => (article.locale ?? "id") === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(({ id, slug, title, description, category, date, readTime, image }) => ({
      id,
      slug,
      title,
      description,
      category,
      date,
      readTime,
      image,
    }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <PlusCursor />
      <Hero />
      <About />
      <Projects />
      <ITSolutions />
      <BlogSection teasers={teasers} />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
