import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import AuthRedirectCatcher from "@/components/AuthRedirectCatcher";
import { ChatWidget } from "@/components/ChatWidget";
import Preloader from "@/components/Preloader";
import { ThemeStyle } from "@/components/ThemeStyle";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, isLocale } from "@/i18n/config";
import { SERVICES } from "@/lib/services";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono and Bricolage Grotesque were loaded here for every page but only
// ever used deep inside /studio and blog articles — they cost ~90KB of woff2
// on the landing page for nothing. Pages that want them can load their own.

const SITE = "https://plusthe.site";

const keywordsByLocale: Record<string, string[]> = {
  en: [
    "digital agency",
    "AI agency",
    "AI chatbot service",
    "branding agency",
    "mobile app development",
    "CRM platform",
    "digital marketing",
    "AI image generator",
    "web development",
    "creative agency",
  ],
  id: [
    "digital agency Indonesia",
    "digital agency Jakarta",
    "agensi AI Indonesia",
    "jasa chatbot AI",
    "chatbot WhatsApp Indonesia",
    "jasa branding Indonesia",
    "jasa pembuatan aplikasi mobile",
    "jasa pembuatan aplikasi Jakarta",
    "jasa pembuatan game mobile",
    "CRM Indonesia",
    "jasa digital marketing Indonesia",
    "AI image generator Indonesia",
    "jasa pembuatan website Indonesia",
    "agensi kreatif Indonesia",
    "jasa SEO Indonesia",
    "AI untuk bisnis UMKM",
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(SITE),
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    keywords: keywordsByLocale[locale],
    alternates: {
      canonical: `${SITE}/${locale}`,
      languages: {
        en: `${SITE}/en`,
        id: `${SITE}/id`,
        "x-default": `${SITE}/en`,
      },
    },
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      type: "website",
      url: `${SITE}/${locale}`,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? "en_US" : "id_ID",
      siteName: "plus.",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const cities = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Bali", "Yogyakarta"];
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE}/#organization`,
    name: "plus.",
    alternateName: "plus. Digital AI-gency",
    url: SITE,
    logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    image: `${SITE}/logo.png`,
    description: dict.meta.homeDescription,
    email: "plusthesite@gmail.com",
    slogan: locale === "id" ? "Bangun Brand Lebih Cerdas. Lebih Cepat." : "Build Smarter Brands. Faster.",
    priceRange: "Rp 2.500.000 - Rp 20.000.000+",
    currenciesAccepted: "IDR",
    knowsLanguage: ["id-ID", "en-US"],
    address: { "@type": "PostalAddress", addressCountry: "ID", addressRegion: "DKI Jakarta", addressLocality: "Jakarta" },
    areaServed: [
      { "@type": "Country", name: "Indonesia" },
      ...cities.map((c) => ({ "@type": "City", name: c })),
    ],
    contactPoint: [{
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "plusthesite@gmail.com",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "English"],
    }],
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      priceCurrency: "IDR",
      itemOffered: { "@type": "Service", name: locale === "id" ? s.id : s.en, description: s.tagline, serviceType: s.en },
    })),
    sameAs: ["https://www.instagram.com/plusthe.site/", "https://www.linkedin.com/company/plusthesite/"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "plus.",
    url: `${SITE}/${locale}`,
    inLanguage: locale === "id" ? "id-ID" : "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/${locale}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Speed up first image paint from the CDN (better LCP) */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ThemeStyle />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider>
          <Preloader locale={locale} />
          <AuthRedirectCatcher />
          {/* Animated starfield behind every section (dark mode only) */}
          <div className="space-stars" aria-hidden />
          {/* Ambient glow effects for dark mode */}
          <div className="glow-ambient glow-ambient-1" aria-hidden="true" />
          <div className="glow-ambient glow-ambient-2" aria-hidden="true" />
          <I18nProvider locale={locale} dict={dict}>
            {children}
          </I18nProvider>
          <ScrollToTop />
          <ChatWidget locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
