"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, BriefcaseBusiness, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";

export default function About() {
  const ref = useScrollReveal();
  const t = useT();
  const locale = useLocale();

  const pillars = [
    {
      icon: Bot,
      title:
        locale === "id"
          ? "AI yang benar-benar dipakai"
          : "AI that actually gets used",
      body:
        locale === "id"
          ? "Kami fokus pada workflow yang membantu tim bergerak lebih cepat, bukan demo AI yang menarik tapi tidak masuk operasi."
          : "We focus on workflows that help teams move faster, not AI demos that look impressive but never fit operations.",
    },
    {
      icon: Sparkles,
      title:
        locale === "id"
          ? "Creative taste tetap manusia"
          : "Creative taste stays human",
      body:
        locale === "id"
          ? "Kecepatan penting, tapi hasil akhir tetap perlu rasa, seleksi, dan arah visual yang sengaja dibentuk."
          : "Speed matters, but the final output still needs taste, selection, and visual direction shaped with intent.",
    },
    {
      icon: BriefcaseBusiness,
      title:
        locale === "id"
          ? "Dibangun untuk tim operasional"
          : "Built for operating teams",
      body:
        locale === "id"
          ? "Kami merancang sistem yang benar-benar bisa dipakai tim sales, marketing, support, dan produk setelah launch."
          : "We design systems that sales, marketing, support, and product teams can actually keep using after launch.",
    },
  ];

  const stats = [
    { value: "AI+", label: t.about.statPoweredLabel },
    { value: "6+", label: t.about.statProductsLabel },
    { value: "5+", label: t.about.statToolsLabel },
  ];

  return (
    <section
      id="about"
      className="bg-white py-24 text-slate-950 lg:py-32 dark:bg-slate-950 dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              {t.about.tag}
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
              {t.about.titleLine1}
              <span className="block text-sky-700 dark:text-sky-300">
                {t.about.titleLine2}
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              {t.about.description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/digital-agency`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:translate-x-0.5 hover:text-sky-700 dark:text-white dark:hover:text-sky-300"
            >
              <span>
                {locale === "id"
                  ? "Lihat cara kami bekerja"
                  : "See how we work"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="fade-up fade-up-delay-2 grid gap-5">
            <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
              <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/[0.04]">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format"
                  alt="Team collaboration"
                  width={800}
                  height={700}
                  className="h-full min-h-[280px] w-full object-cover"
                />
              </div>
              <div className="rounded-[1.8rem] border border-slate-200 bg-slate-950 p-6 text-white dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                  plus. operating model
                </p>
                <p className="mt-6 text-2xl font-semibold tracking-tight">
                  {locale === "id"
                    ? "Bukan sekadar agency. Ini rhythm kerja digital yang lebih rapat."
                    : "Not just an agency. A tighter digital operating rhythm."}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  {locale === "id"
                    ? "Kami menyatukan AI, creative, content, dan operator workflow supaya ide tidak berhenti di deck lalu mati di eksekusi."
                    : "We connect AI, creative, content, and operator workflows so ideas do not stop at the deck and die during execution."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <div
                    key={pillar.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {pillar.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
