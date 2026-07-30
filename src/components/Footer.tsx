"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Logo from "@/components/Logo";
import Newsletter from "@/components/Newsletter";
import { useT, useLocale } from "@/i18n/I18nProvider";

type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
};

export default function Footer() {
    const ref = useScrollReveal();
    const t = useT();
    const locale = useLocale();

    const productLinks: FooterLink[] = [
        { label: t.products.items.chatbot.title, href: `/${locale}/chat-bot` },
        { label: t.products.items.support.title, href: `/${locale}/customer-support` },
        { label: t.products.items.mobileApp.title, href: `/${locale}/mobile-app` },
        { label: t.products.items.crm.title, href: `/${locale}/crm` },
        { label: t.products.items.agency.title, href: `/${locale}/digital-agency` },
        { label: t.products.items.game.title, href: `/${locale}/mobile-game` },
    ];

    const companyLinks: FooterLink[] = [
        { label: t.nav.about, href: `/${locale}#about` },
        { label: t.nav.studio, href: `/${locale}/studio` },
        { label: t.nav.pricing, href: `/${locale}#pricing` },
        { label: t.nav.blog, href: `/${locale}/blog` },
    ];

    const connectLinks: FooterLink[] = [
        { label: "Instagram", href: "https://www.instagram.com/plusthe.site/", external: true },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/plusthesite/", external: true },
        { label: locale === "id" ? "Halaman Kontak" : "Contact Page", href: `/${locale}/contact-us` },
        { label: "Email", href: "mailto:plusthesite@gmail.com", external: true },
    ];

    const renderLink = (link: FooterLink) =>
        link.external ? (
            <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-footer-muted transition-colors hover:text-footer-text"
            >
                {link.label}
            </a>
        ) : (
            <Link
                key={link.label}
                href={link.href}
                className="text-sm text-footer-muted transition-colors hover:text-footer-text"
            >
                {link.label}
            </Link>
        );

    return (
        <footer id="contact" className="bg-footer-bg text-footer-text">
            <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="fade-up mx-auto mb-16 max-w-2xl">
                    <Newsletter />
                </div>

                <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
                    <div className="fade-up max-w-xs">
                        <Logo variant="light" size="large" href={`/${locale}`} />
                        <p className="mt-3 text-sm leading-relaxed text-footer-muted">
                            {t.footer.tagline}
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-footer-border/80 bg-white/5 px-4 py-2 text-xs font-medium text-footer-muted">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            {locale === "id" ? "AI, creative, dan growth dalam satu tim" : "AI, creative, and growth in one team"}
                        </div>
                    </div>

                    <div className="fade-up fade-up-delay-1 flex flex-wrap gap-16">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-footer-muted">
                                {t.footer.products}
                            </p>
                            <div className="mt-4 flex flex-col gap-3">
                                {productLinks.map(renderLink)}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-footer-muted">
                                {t.footer.company}
                            </p>
                            <div className="mt-4 flex flex-col gap-3">
                                {companyLinks.map(renderLink)}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-footer-muted">
                                {t.footer.connect}
                            </p>
                            <div className="mt-4 flex flex-col gap-3">
                                {connectLinks.map(renderLink)}
                            </div>
                        </div>
                    </div>

                    <div className="fade-up fade-up-delay-2 flex flex-col items-start gap-5">
                        <Link
                            href={`/${locale}/contact-us`}
                            className="rounded-full border border-footer-border px-7 py-3 text-sm font-semibold text-footer-text transition-all hover:scale-105 hover:border-footer-text hover:bg-footer-text hover:text-footer-bg"
                        >
                            {t.footer.contactUs} →
                        </Link>
                        <a
                            href="mailto:plusthesite@gmail.com"
                            className="text-xl font-bold text-footer-text transition-colors hover:text-primary sm:text-2xl"
                        >
                            plusthesite@gmail.com
                        </a>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-footer-border pt-8 sm:flex-row">
                    <p className="text-sm text-footer-muted">
                        © {new Date().getFullYear()} plus. {t.footer.rights}
                    </p>
                    <a
                        href="#hero"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-footer-border text-footer-muted transition-all hover:scale-110 hover:border-footer-text hover:text-footer-text"
                        aria-label={t.footer.backToTop}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
