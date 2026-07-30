"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";
import type { LucideIcon } from "lucide-react";
import {
    Bot,
    ChevronDown,
    ChevronRight,
    Headphones,
    LayoutDashboard,
    Menu,
    Moon,
    Rocket,
    Sun,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useLocale, useT } from "@/i18n/I18nProvider";
import { locales, localeShort, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

type ProductItem = {
    icon: LucideIcon;
    label: string;
    desc: string;
    href: string;
    badge?: string;
};

type ViewTransitionDocument = Document & {
    startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
    };
};

function getProducts(t: Dictionary, locale: Locale): ProductItem[] {
    const p = t.products.items;

    return [
        {
            icon: Bot,
            label: p.chatbot.title,
            desc: t.nav.aiFeatures,
            href: `/${locale}/chat-bot`,
            badge: t.products.badgePopular,
        },
        {
            icon: Headphones,
            label: p.support.title,
            desc: t.products.tag,
            href: `/${locale}/customer-support`,
        },
        {
            icon: LayoutDashboard,
            label: p.crm.title,
            desc: t.products.tag,
            href: `/${locale}/crm`,
        },
        {
            icon: Rocket,
            label: p.agency.title,
            desc: t.products.tag,
            href: `/${locale}/digital-agency`,
            badge: t.products.badgeNew,
        },
    ];
}

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const isLight = (resolvedTheme ?? "light") === "light";

    const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
        const nextTheme = isLight ? "dark" : "light";
        const doc = document as ViewTransitionDocument;

        if (
            typeof doc.startViewTransition === "function" &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            const x = event.clientX;
            const y = event.clientY;
            const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            const transition = doc.startViewTransition(() => {
                setTheme(nextTheme);
            });

            transition.ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${endRadius}px at ${x}px ${y}px)`,
                        ],
                    },
                    {
                        duration: 500,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
            });

            return;
        }

        setTheme(nextTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            title={`Switch to ${isLight ? "dark" : "light"} mode`}
        >
            {isLight ? <Moon className="theme-icon" /> : <Sun className="theme-icon" />}
        </button>
    );
}

function persistLocale(target: string) {
    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;samesite=lax`;
}

function swapLocaleInPath(pathname: string, target: string) {
    const segments = pathname.split("/");
    const next = segments.length > 1 ? [segments[0], target, ...segments.slice(2)] : ["", target];
    return next.join("/") || `/${target}`;
}

function LanguageToggle() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const t = useT();

    const switchTo = (target: Locale) => {
        if (target === locale) return;

        persistLocale(target);

        const navigate = () => {
            const suffix = window.location.search + window.location.hash;
            router.push(swapLocaleInPath(pathname, target) + suffix);
        };

        const doc = document as ViewTransitionDocument;
        if (typeof doc.startViewTransition === "function") {
            const root = document.documentElement;
            root.classList.add("lang-transition");
            const transition = doc.startViewTransition(navigate);
            transition.finished.finally(() => root.classList.remove("lang-transition"));
            return;
        }

        navigate();
    };

    return (
        <div
            className="inline-flex items-center rounded-full border border-slate-200 bg-white/60 p-0.5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60"
            role="group"
            aria-label={t.nav.switchLanguage}
        >
            {locales.map((l) => (
                <button
                    key={l}
                    onClick={() => switchTo(l)}
                    aria-pressed={l === locale}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
                        l === locale
                            ? "bg-foreground text-background shadow-sm"
                            : "text-[#64748B] hover:text-foreground dark:text-[#94A3B8]"
                    }`}
                >
                    {localeShort[l]}
                </button>
            ))}
        </div>
    );
}

function ProductItemInner({
    icon: Icon,
    label,
    desc,
    badge,
}: {
    icon: LucideIcon;
    label: string;
    desc: string;
    badge?: string;
}) {
    return (
        <>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-transform group-hover:scale-110 dark:bg-slate-800 dark:text-slate-100">
                <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {label}
                    {badge ? (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
                            {badge}
                        </span>
                    ) : null}
                </p>
                <p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{desc}</p>
            </div>
            <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#94A3B8] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-[#64748B]" />
        </>
    );
}

function ProductsDropdown({ scrolled }: { scrolled: boolean }) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = useT();
    const locale = useLocale();
    const products = getProducts(t, locale);

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
    };

    useEffect(() => {
        const handleClick = (event: globalThis.MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <button
                onClick={() => setOpen((value) => !value)}
                className={`nav-link inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-widest transition-colors ${
                    scrolled
                        ? "text-muted hover:text-foreground"
                        : "text-[#0F172A] hover:text-primary dark:text-white/90 dark:hover:text-white"
                }`}
            >
                {t.nav.products}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            <div
                className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-all duration-200 ${
                    open
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                }`}
            >
                <div className="w-[340px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-1 px-3 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8]">
                            {t.nav.ourProducts}
                        </p>
                    </div>

                    {products.map((product) => (
                        <Link
                            key={product.label}
                            href={product.href}
                            onClick={() => setOpen(false)}
                            className="group flex items-center gap-3.5 rounded-xl px-3 py-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <ProductItemInner
                                icon={product.icon}
                                label={product.label}
                                desc={product.desc}
                                badge={product.badge}
                            />
                        </Link>
                    ))}

                    <div className="mt-1 border-t border-slate-200 px-3 py-3 dark:border-slate-700">
                        <Link
                            href={`/${locale}#products`}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                        >
                            {t.nav.viewAllProducts}
                            <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(
        typeof window !== "undefined" ? window.scrollY > 50 : false
    );
    const { resolvedTheme } = useTheme();
    const pathname = usePathname();
    const t = useT();
    const locale = useLocale();
    const products = getProducts(t, locale);

    const isHome = pathname === `/${locale}`;

    const homeLinks = [
        { label: t.nav.about, href: `/${locale}#about` },
        { label: t.nav.products, href: `/${locale}#products`, hasDropdown: true },
        { label: t.nav.aiFeatures, href: `/${locale}#features` },
        { label: t.nav.studio, href: `/${locale}/studio` },
        { label: t.nav.blog, href: `/${locale}/blog` },
        { label: t.nav.pricing, href: `/${locale}#pricing` },
    ];

    const subpageLinks = [
        { label: t.nav.home, href: `/${locale}` },
        { label: t.nav.products, href: `/${locale}#products`, hasDropdown: true },
        { label: t.nav.aiFeatures, href: `/${locale}#features` },
        { label: t.nav.studio, href: `/${locale}/studio` },
        { label: t.nav.blog, href: `/${locale}/blog` },
        { label: t.nav.pricing, href: `/${locale}#pricing` },
    ];

    const navLinks = isHome ? homeLinks : subpageLinks;
    const ctaHref = isHome ? "mailto:plusthesite@gmail.com" : `/${locale}#pricing`;
    const ctaLabel = isHome ? t.nav.contactUs : t.nav.viewPricing;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const currentTheme = resolvedTheme ?? "light";

    return (
        <nav
            className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
                scrolled ? "navbar-scrolled py-3" : "border-b border-transparent bg-transparent py-5"
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
                <Logo variant={currentTheme === "dark" ? "light" : "dark"} href={`/${locale}`} />

                <div className="hidden items-center gap-10 md:flex">
                    {navLinks.map((link) =>
                        link.hasDropdown ? (
                            <ProductsDropdown key={link.label} scrolled={scrolled} />
                        ) : (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`nav-link text-[13px] font-semibold uppercase tracking-widest transition-colors ${
                                    scrolled
                                        ? "text-muted hover:text-foreground"
                                        : "text-[#0F172A] hover:text-primary dark:text-white/90 dark:hover:text-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <LanguageToggle />
                    <ThemeToggle />
                    <Link
                        href={ctaHref}
                        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background shadow-md transition-all hover:scale-105 hover:opacity-90"
                    >
                        {ctaLabel}
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <LanguageToggle />
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileOpen((value) => !value)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-900 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
                    mobileOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="flex flex-col gap-1 border-t border-slate-200 bg-white px-6 py-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    {navLinks.map((link) =>
                        link.hasDropdown ? (
                            <div key={link.label}>
                                <button
                                    onClick={() => setMobileProductsOpen((value) => !value)}
                                    className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-widest text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
                                >
                                    {t.nav.products}
                                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`} />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        mobileProductsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="grid grid-cols-2 gap-2 pb-3 pt-1">
                                        {products.map((product) => {
                                            const Icon = product.icon;
                                            return (
                                                <Link
                                                    key={product.label}
                                                    href={product.href}
                                                    onClick={() => {
                                                        setMobileOpen(false);
                                                        setMobileProductsOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                >
                                                    <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                                    <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                                        {product.label}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm font-semibold uppercase tracking-widest text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                    <Link
                        href={ctaHref}
                        onClick={() => setMobileOpen(false)}
                        className="mt-2 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                    >
                        {ctaLabel}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
