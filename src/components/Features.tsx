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

const accents = {
  chatbot:
    "bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  support:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  mobileApp:
    "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  crm:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
  agency:
    "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
  game:
    "bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
} as const;

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
    note: string;
  }> = [
    {
      key: "chatbot",
      title: items.chatbot.title,
      description: items.chatbot.description,
      href: `/${locale}/chat-bot`,
      badge: t.products.badgePopular,
      note:
        locale === "id"
          ? "Sales dan support aktif 24/7"
          : "Sales and support that never sleeps",
    },
    {
      key: "support",
      title: items.support.title,
      description: items.support.description,
      href: `/${locale}/customer-support`,
      note:
        locale === "id"
          ? "Inbox, SLA, dan respons makin rapi"
          : "A calmer inbox with clearer SLAs",
    },
    {
      key: "mobileApp",
      title: items.mobileApp.title,
      description: items.mobileApp.description,
      href: `/${locale}/mobile-app`,
      note:
        locale === "id"
          ? "Produk mobile yang siap dipakai tim"
          : "Mobile products built for real teams",
    },
    {
      key: "crm",
      title: items.crm.title,
      description: items.crm.description,
      href: `/${locale}/crm`,
      note:
        locale === "id"
          ? "Pipeline, owner, dan follow-up sinkron"
          : "Pipeline, owners, and follow-ups in sync",
    },
    {
      key: "agency",
      title: items.agency.title,
      description: items.agency.description,
      href: `/${locale}/digital-agency`,
      badge: t.products.badgeNew,
      note:
        locale === "id"
          ? "Creative ops dan growth bergerak bersama"
          : "Creative operations and growth in one rhythm",
    },
    {
      key: "game",
      title: items.game.title,
      description: items.game.description,
      href: `/${locale}/mobile-game`,
      note:
        locale === "id"
          ? "Build interaksi yang terasa hidup"
          : "Build interactive experiences with range",
    },
  ];

  return (
    <section
      id="products"
      className="overflow-hidden bg-white py-24 text-slate-950 lg:py-32 dark:bg-slate-950 dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
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

          <div className="fade-up fade-up-delay-2 rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(135deg,_#fff_0%,_#f8fafc_54%,_#eef6ff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.95)_0%,_rgba(15,23,42,0.88)_52%,_rgba(8,47,73,0.82)_100%)]">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-950 p-5 text-white dark:bg-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Product mix
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">6</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {locale === "id"
                    ? "Surface utama untuk sales, support, creative, dan product delivery."
                    : "Core surfaces for sales, support, creative, and product delivery."}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Built for
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                  {locale === "id"
                    ? "Tim yang butuh output cepat tanpa chaos."
                    : "Teams that need momentum without chaos."}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Delivery style
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                  {locale === "id"
                    ? "Sistem, interface, dan operasional bergerak bareng."
                    : "Systems, interfaces, and operations move together."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const Icon = icons[product.key];
            const accent = accents[product.key];

            return (
              <Link
                key={product.key}
                href={product.href}
                className="group flex min-h-[280px] flex-col rounded-[1.7rem] border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {product.badge ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      {product.badge}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                  {product.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {product.description}
                </p>

                <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  {product.note}
                </div>

                <div className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-slate-950 dark:text-white">
                  <span>{locale === "id" ? "Buka produk" : "Open product"}</span>
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
