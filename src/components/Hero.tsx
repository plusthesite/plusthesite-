"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  Sparkles,
  Zap,
} from "lucide-react";
import { useLocale, useT } from "@/i18n/I18nProvider";

export default function Hero() {
  const t = useT();
  const locale = useLocale();

  const metrics = [
    ["12", locale === "id" ? "Campaign aktif" : "Active campaigns"],
    ["84%", locale === "id" ? "Respons tertangani" : "Response coverage"],
    [
      "3.2x",
      locale === "id" ? "Ritme kirim lebih cepat" : "Faster shipping rhythm",
    ],
  ];

  const flow = [
    locale === "id" ? "Lead WhatsApp masuk" : "WhatsApp lead captured",
    locale === "id" ? "Follow-up CRM ditugaskan" : "CRM follow-up assigned",
    locale === "id" ? "Draft proposal siap" : "Proposal draft ready",
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#f3f2ed] pt-28 text-slate-950 dark:bg-slate-950 dark:text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(59,130,246,0.10),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(14,165,233,0.10),_transparent_20%)]" />
      <div className="mx-auto grid min-h-[92dvh] max-w-7xl items-center gap-14 px-6 pb-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="relative z-10 max-w-2xl">
          <p className="hero-animate inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm dark:border-sky-400/20 dark:bg-white/5 dark:text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            {t.hero.badge}
          </p>

          <h1 className="hero-animate hero-animate-delay-1 mt-7 text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            {t.hero.titleLine1}
            <span className="block text-sky-700 dark:text-sky-300">
              {t.hero.titleLine2}
            </span>
          </h1>

          <p className="hero-animate hero-animate-delay-2 mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t.hero.description}
          </p>

          <div className="hero-animate hero-animate-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}#products`}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-px dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              {t.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`/${locale}#pricing`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 active:translate-y-px dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>

          <div className="hero-animate hero-animate-delay-3 mt-10 flex flex-wrap gap-3">
            <span className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              {locale === "id" ? "AI + creative + ops" : "AI + creative + ops"}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              {locale === "id"
                ? "Satu ritme untuk banyak workflow"
                : "One rhythm for many workflows"}
            </span>
          </div>
        </div>

        <div className="hero-animate hero-animate-delay-2 relative z-10">
          <div className="absolute -left-8 top-12 h-36 w-36 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="absolute -right-6 bottom-10 h-40 w-40 rounded-full bg-cyan-300/18 blur-3xl" />

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-3 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5">
            <div className="rounded-[1.4rem] border border-slate-100 bg-slate-950 p-5 text-white dark:border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                    plus desk
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {locale === "id" ? "Launch board" : "Launch board"}
                  </p>
                </div>
                <div className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-200">
                  {locale === "id" ? "Live" : "Live"}
                </div>
              </div>

              <div className="grid gap-3 py-4 sm:grid-cols-3">
                {metrics.map(([value, label]) => (
                  <div key={label} className="rounded-xl bg-white/[0.06] p-4">
                    <p className="text-2xl font-semibold tracking-tight">
                      {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-xl bg-white/[0.06] p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                    <MessageSquareText className="h-4 w-4 text-sky-300" />
                    {locale === "id" ? "Alur customer" : "Customer flow"}
                  </div>
                  {flow.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 border-t border-white/10 py-3 text-sm text-slate-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-sky-300" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-500 p-4 text-white">
                  <Zap className="h-5 w-5" />
                  <p className="mt-8 text-3xl font-semibold tracking-tight">
                    {locale === "id" ? "1 ritme tim" : "1 team rhythm"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {locale === "id"
                      ? "AI, creative, CRM, konten, dan app bergerak di jalur kerja yang sama."
                      : "AI, creative, CRM, content, and apps move inside the same operating path."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
