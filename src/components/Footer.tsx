"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Newsletter from "@/components/Newsletter";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";

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
        {
            label: "Instagram",
            href: "https://www.instagram.com/plusthe.site/",
            external: true,
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/company/plusthesite/",
            external: true,
        },
        {
            label: locale === "id" ? "Halaman Kontak" : "Contact Page",
            href: `/${locale}/contact-us`,
        },
        {
            label: "Email",
            href: "mailto:plusthesite@gmail.com",
            external: true,
        },
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
        <footer
            id="contact"
            className="relative overflow-hidden bg-footer-bg text-footer-text"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.08),_transparent_24%)]" />

            <div ref={ref} className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="fade-up mx-auto mb-16 max-w-3xl">
                    <Newsletter />
                </div>

                <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr_0.72fr]">
                    <div className="fade-up max-w-sm">
                        <Logo variant="light" size="large" href={`/${locale}`} />
                        <p className="mt-4 text-sm leading-7 text-footer-muted">
                            {t.footer.tagline}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="rounded-full border border-footer-border/80 bg-white/5 px-4 py-2 text-xs font-medium text-footer-muted">
                                {locale === "id"
                                    ? "AI + creative + growth"
                                    : "AI + creative + growth"}
                            </span>
                            <span className="rounded-full border border-footer-border/80 bg-white/5 px-4 py-2 text-xs font-medium text-footer-muted">
                                {locale === "id"
                                    ? "Dibangun untuk tim yang bergerak cepat"
                                    : "Built for teams that move fast"}
                            </span>
                        </div>
                    </div>

                    <div className="fade-up fade-up-delay-1 grid gap-10 sm:grid-cols-3">
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

                    <div className="fade-up fade-up-delay-2 rounded-[1.8rem] border border-footer-border bg-white/5 p-6 backdrop-blur-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-footer-muted">
                            Direct line
                        </p>
                        <p className="mt-4 text-2xl font-semibold text-footer-text">
                            {locale === "id"
                                ? "Siap ngobrol soal sistem, growth, dan delivery."
                                : "Ready to talk systems, growth, and delivery."}
                        </p>
                        <a
                            href="mailto:plusthesite@gmail.com"
                            className="mt-5 block text-lg font-semibold text-footer-text transition-colors hover:text-sky-300"
                        >
                            plusthesite@gmail.com
                        </a>
                        <Link
                            href={`/${locale}/contact-us`}
                            className="mt-6 inline-flex rounded-full border border-footer-border px-6 py-3 text-sm font-semibold text-footer-text transition-all hover:border-footer-text hover:bg-footer-text hover:text-footer-bg"
                        >
                            {t.footer.contactUs} -&gt;
                        </Link>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-footer-border pt-8 sm:flex-row">
                    <p className="text-sm text-footer-muted">
                        &copy; {new Date().getFullYear()} plus. {t.footer.rights}
                    </p>
                    <a
                        href="#hero"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-footer-border text-footer-muted transition-all hover:scale-110 hover:border-footer-text hover:text-footer-text"
                        aria-label={t.footer.backToTop}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
