"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cloud, Lightbulb, Megaphone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";

const serviceIcons = [Cloud, Megaphone, Lightbulb];

/**
 * IT Solutions - the services band that replaced "Our Products" and
 * "AI Features". One focused section: caption, a visual anchor, and the
 * three service lanes (cloud / marketing / innovative).
 */
export default function ITSolutions() {
  const ref = useScrollReveal();
  const t = useT();
  const locale = useLocale();
  const s = t.aiFeatures.services;

  const services = [
    { title: s.cloud.title, description: s.cloud.description },
    { title: s.marketing.title, description: s.marketing.description },
    { title: s.innovative.title, description: s.innovative.description },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white py-24 text-slate-950 lg:py-32 dark:bg-slate-950 dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          {/* Caption */}
          <div className="max-w-2xl">
            <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              {t.aiFeatures.servicesTag}
            </p>
            <h2 className="fade-up fade-up-delay-1 mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-white">
              {t.aiFeatures.servicesTitle}
            </h2>
            <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
              {locale === "id"
                ? "Dari chatbot AI sampai cloud dan growth, satu tim yang merancang, membangun, dan mengoperasikan solusi digital untuk bisnis Indonesia."
                : "From AI chatbots to cloud and growth, one team that designs, builds, and runs digital solutions for Indonesian businesses."}
            </p>

            <div className="fade-up fade-up-delay-3 mt-10 grid gap-4 sm:grid-cols-3">
              {services.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <div
                    key={service.title}
                    className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(12,116,235,0.12)] dark:border-[#2a3b5c] dark:bg-[#131e36]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <Link
              href={`/${locale}#pricing`}
              className="fade-up fade-up-delay-3 group mt-10 inline-flex w-fit items-center gap-2.5 rounded-full bg-[#0c74eb] py-2 pl-5 pr-2 text-sm font-medium text-white transition-colors hover:bg-[#0a5dbc]"
            >
              {locale === "id" ? "Diskusikan kebutuhanmu" : "Discuss your needs"}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
                <ArrowRight className="h-3.5 w-3.5 text-[#0c74eb]" />
              </span>
            </Link>
          </div>

          {/* Visual anchor */}
          <div className="fade-up fade-up-delay-2 relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 shadow-[0_28px_80px_rgba(15,23,42,0.14)] dark:border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format"
                alt={
                  locale === "id"
                    ? "Tim plus. merancang solusi digital"
                    : "The plus. team designing digital solutions"
                }
                width={1200}
                height={900}
                className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[480px]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
                <div className="rounded-2xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur dark:bg-slate-900/90">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
                    {locale === "id" ? "Satu tim, satu alur" : "One team, one flow"}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-950 dark:text-white">
                    {locale === "id"
                      ? "Strategi → desain → build → operasional"
                      : "Strategy → design → build → operations"}
                  </p>
                </div>
                <span className="rounded-full bg-[#0c74eb] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-sky-500/30">
                  plus.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
