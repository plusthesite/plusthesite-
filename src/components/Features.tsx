"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Gamepad2,
  Headphones,
  LayoutDashboard,
  Smartphone,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";

const icons = {
  chatbot: Bot,
  support: Headphones,
  mobileApp: Smartphone,
  crm: LayoutDashboard,
  agency: BriefcaseBusiness,
  game: Gamepad2,
};

export default function Products() {
  const ref = useScrollReveal();
  const t = useT();
  const locale = useLocale();
  const items = t.products.items;

  const products: Array<{
    key: keyof typeof icons;
    title: string;
    description: string;
    href: string;
    badge?: string;
    comingSoon?: boolean;
  }> = [
    {
      key: "chatbot",
      title: items.chatbot.title,
      description: items.chatbot.description,
      href: `/${locale}/chat-bot`,
      badge: t.products.badgePopular,
    },
    {
      key: "support",
      title: items.support.title,
      description: items.support.description,
      href: `/${locale}/customer-support`,
    },
    {
      key: "mobileApp",
      title: items.mobileApp.title,
      description: items.mobileApp.description,
      href: `/${locale}/mobile-app`,
    },
    {
      key: "crm",
      title: items.crm.title,
      description: items.crm.description,
      href: `/${locale}/crm`,
    },
    {
      key: "agency",
      title: items.agency.title,
      description: items.agency.description,
      href: `/${locale}/digital-agency`,
      badge: t.products.badgeNew,
    },
    {
      key: "game",
      title: items.game.title,
      description: items.game.description,
      href: `/${locale}/mobile-game`,
    },
  ];

  return (
    <section
      id="products"
      className="bg-white py-24 text-slate-950 lg:py-32 dark:bg-slate-950 dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
            {t.products.tag}
          </p>
          <h2 className="fade-up fade-up-delay-1 mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-white">
            {t.products.title}
          </h2>
          <p className="fade-up fade-up-delay-2 mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            {t.products.description}
          </p>
        </div>

        <div className="fade-up fade-up-delay-3 mt-14 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/10 dark:bg-white/10">
          {products.map((product) => {
            const Icon = icons[product.key];

            return (
              <Link
                key={product.key}
                href={product.href}
                className="group min-h-[260px] bg-white p-6 transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  {product.comingSoon ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {locale === "id" ? "Segera hadir" : "Coming soon"}
                    </span>
                  ) : product.badge ? (
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                      {product.badge}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                  {product.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {product.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                  <span>
                    {locale === "id" ? "Buka produk" : "Open product"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
