"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import { useTheme } from "next-themes";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  ChevronRight,
  Clock,
  Headphones,
  LayoutDashboard,
  Menu,
  Moon,
  Rocket,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import RollingLabel from "@/components/RollingLabel";
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
      desc:
        locale === "id"
          ? "Support dan lead capture aktif 24/7"
          : "24/7 support and lead capture",
      href: `/${locale}/chat-bot`,
      badge: t.products.badgePopular,
    },
    {
      icon: Headphones,
      label: p.support.title,
      desc:
        locale === "id"
          ? "Inbox, SLA, dan respons yang lebih rapi"
          : "A cleaner inbox, SLA, and response rhythm",
      href: `/${locale}/customer-support`,
    },
    {
      icon: LayoutDashboard,
      label: p.crm.title,
      desc:
        locale === "id"
          ? "Pipeline dan follow-up yang sinkron"
          : "Pipeline and follow-ups in sync",
      href: `/${locale}/crm`,
    },
    {
      icon: Rocket,
      label: p.agency.title,
      desc:
        locale === "id"
          ? "Creative, web, dan growth dalam satu tim"
          : "Creative, web, and growth in one team",
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
        Math.max(y, window.innerHeight - y),
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
          },
        );
      });

      return;
    }

    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {/* Both icons render on the server; CSS picks one, so hydration stays clean. */}
      <Moon className="theme-icon dark:hidden" />
      <Sun className="theme-icon hidden dark:block" />
    </button>
  );
}

function persistLocale(target: string) {
  document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;samesite=lax`;
}

function swapLocaleInPath(pathname: string, target: string) {
  const segments = pathname.split("/");
  const next =
    segments.length > 1 ? [segments[0], target, ...segments.slice(2)] : ["", target];
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
      className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 p-0.5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60"
      role="group"
      aria-label={t.nav.switchLanguage}
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
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
        <p className="text-xs leading-5 text-[#64748B] dark:text-[#94A3B8]">
          {desc}
        </p>
      </div>
      <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#94A3B8] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-[#64748B]" />
    </>
  );
}

function NavAnchor({
  href,
  label,
  scrolled,
  onClick,
}: {
  href: string;
  label: string;
  scrolled: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`nav-link whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors xl:text-[13px] xl:tracking-widest ${
        scrolled
          ? "text-muted hover:text-foreground"
          : "text-[#0F172A] hover:text-primary dark:text-white/90 dark:hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function ProductsDropdown({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`nav-link inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors xl:text-[13px] xl:tracking-widest ${
          scrolled
            ? "text-muted hover:text-foreground"
            : "text-[#0F172A] hover:text-primary dark:text-white/90 dark:hover:text-white"
        }`}
      >
        {t.nav.products}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="w-[380px] rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_28px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-2 rounded-[1.2rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#111827_52%,_#082f49_100%)] px-4 py-4 text-white">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200/80">
              <Sparkles className="h-3 w-3" />
              <span>{t.nav.ourProducts}</span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6">
              {locale === "id"
                ? "Pilih lane yang paling dekat dengan kebutuhan tim Anda saat ini."
                : "Choose the lane that best matches what your team needs right now."}
            </p>
          </div>

          {products.map((product) => (
            <Link
              key={product.label}
              href={product.href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3.5 rounded-[1rem] px-3 py-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
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
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    });
    const tick = () => setTime(format.format(new Date()));

    tick();
    // Minutes-only display: a per-second interval re-rendered the navbar
    // 60x more often than anyone can read.
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="hidden items-center gap-1.5 whitespace-nowrap text-[13px] text-slate-600 2xl:inline-flex dark:text-slate-400">
      <Clock className="h-3.5 w-3.5" />
      <span className="tabular-nums">{time ?? "--:--"} WIB</span>
    </span>
  );
}

/** Scroll state read through an external store: the server and the first client
 *  render both start at `false`, so the navbar never trips hydration. */
function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const isScrolled = () => window.scrollY > 50;
const notScrolled = () => false;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, notScrolled);
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
  // Contact goes straight to email until the booking flow is live.
  const ctaHref = "mailto:plusthesite@gmail.com";
  const ctaLabel = t.nav.contactUs;

  const island = `rounded-full border transition-all duration-300 ${
    scrolled
      ? "border-slate-200/80 bg-white/85 shadow-[0_16px_45px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80"
      : "border-white/50 bg-white/70 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-slate-950/55"
  }`;

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 lg:px-8 xl:justify-normal 2xl:max-w-[1440px]">
        {/* Island 1 — brand */}
        <div className="flex xl:flex-1 xl:justify-start">
          <div
            className={`${island} flex h-[57px] shrink-0 items-center gap-3 px-4`}
          >
          <Logo variant="auto" href={`/${locale}`} />
          <span className="hidden h-5 w-px bg-slate-900/10 xl:block dark:bg-white/15" />
          <p className="hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 xl:block dark:text-slate-400">
              Digital agency
            </p>
          </div>
        </div>

        {/* Island 2 — navigation */}
        <div className="hidden shrink-0 lg:flex">
          <div
            className={`${island} flex h-[57px] items-center gap-5 px-6 xl:gap-6`}
          >
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <ProductsDropdown key={link.label} scrolled={scrolled} />
              ) : (
                <NavAnchor
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  scrolled={scrolled}
                />
              ),
            )}
          </div>
        </div>

        {/* Island 3 — status + actions */}
        <div className="flex items-center gap-3 xl:flex-1 xl:justify-end">
        <div
          className={`${island} hidden h-[57px] shrink-0 items-center gap-2 pl-4 pr-2 lg:flex`}
        >
          <LocalClock />
          <LanguageToggle />
          <ThemeToggle />
          <a
            href={ctaHref}
            className="group inline-flex items-center gap-2.5 rounded-full bg-foreground py-2 pl-4 pr-2 text-[13px] font-semibold text-background shadow-md transition-all hover:opacity-90"
          >
            <RollingLabel>{ctaLabel}</RollingLabel>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
              <ArrowRight className="h-3.5 w-3.5 text-foreground" />
            </span>
          </a>
        </div>

        {/* Mobile + tablet island */}
        <div className={`${island} flex h-[57px] items-center gap-2 px-2 lg:hidden`}>
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        </div>
      </div>

      <div
        className={`mx-auto max-w-7xl px-6 transition-all duration-500 ease-in-out lg:hidden lg:px-8 ${
          mobileOpen
            ? "pointer-events-auto max-h-[860px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="mt-3 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/95 px-5 py-5 shadow-[0_22px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
          <div className="mb-5 rounded-[1.4rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#111827_52%,_#082f49_100%)] px-4 py-4 text-white">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200/80">
              <Sparkles className="h-3 w-3" />
              <span>{locale === "id" ? "Quick map" : "Quick map"}</span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6">
              {locale === "id"
                ? "Masuk ke lane produk, baca insight, atau langsung buka pricing dari satu tempat."
                : "Jump into product lanes, read insight, or open pricing from one place."}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.label}>
                  <button
                    type="button"
                    aria-expanded={mobileProductsOpen}
                    onClick={() => setMobileProductsOpen((value) => !value)}
                    className="flex w-full items-center justify-between rounded-2xl px-1 py-2 text-sm font-semibold uppercase tracking-widest text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
                  >
                    {t.nav.products}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mobileProductsOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-2 pb-3 pt-2">
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
                            className="flex items-start gap-3 rounded-[1rem] bg-slate-50 px-3 py-3 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                {product.label}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {product.desc}
                              </span>
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
                  className="rounded-2xl px-1 py-2 text-sm font-semibold uppercase tracking-widest text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <a
            href={ctaHref}
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}
