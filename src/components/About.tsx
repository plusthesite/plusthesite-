"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, BriefcaseBusiness, Sparkles } from "lucide-react";
import RollingLabel from "@/components/RollingLabel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";

const SMALL_IMAGE =
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format";
const LARGE_IMAGE =
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=80&auto=format";

export default function About() {
    const ref = useScrollReveal();
    const t = useT();
    const locale = useLocale();

    const ctaLabel = locale === "id" ? "Tentang studio kami" : "About our studio";

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

    const cta = (
        <Link
            href={`/${locale}/digital-agency`}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#0c74eb] py-2 pl-5 pr-2 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[#0a5dbc] sm:pl-6 sm:text-sm"
        >
            <RollingLabel>{ctaLabel}</RollingLabel>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 sm:h-8 sm:w-8">
                <ArrowRight className="h-3.5 w-3.5 text-[#0c74eb]" />
            </span>
        </Link>
    );

    const statRow = (
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((stat) => (
                <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-medium tracking-tight text-slate-950 dark:text-white">
                        {stat.value}
                    </dd>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {stat.label}
                    </p>
                </div>
            ))}
        </dl>
    );

    return (
        <section
            id="about"
            className="overflow-hidden bg-white pb-12 pt-16 text-slate-950 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-32 dark:bg-slate-950 dark:text-white"
        >
            <div ref={ref} className="mx-auto w-full max-w-[1440px]">
                <div className="fade-up mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-xs dark:bg-white dark:text-slate-950">
                        1
                    </span>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-[13px] dark:border-white/15">
                        {t.about.tag}
                    </span>
                </div>

                <h2 className="fade-up fade-up-delay-1 mb-12 px-5 text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-slate-950 sm:mb-16 sm:px-8 lg:mb-28 lg:px-12 dark:text-white">
                    {t.about.titleLine1}
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    {t.about.titleLine2}
                </h2>

                {/* Mobile + tablet */}
                <div className="fade-up fade-up-delay-2 px-5 sm:px-8 lg:hidden">
                    <p className="text-[15px] font-medium leading-[1.6] text-slate-900 sm:text-[17px] dark:text-white/90">
                        {t.about.description}
                    </p>
                    {statRow}
                    <div className="mt-8">{cta}</div>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5">
                        <div className="relative aspect-[438/346] overflow-hidden rounded-xl sm:w-[45%] sm:rounded-2xl">
                            <Image
                                src={SMALL_IMAGE}
                                alt={locale === "id" ? "Tim plus. bekerja" : "The plus. team at work"}
                                fill
                                sizes="(max-width: 640px) 100vw, 45vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="relative aspect-[900/600] overflow-hidden rounded-xl sm:w-[55%] sm:rounded-2xl">
                            <Image
                                src={LARGE_IMAGE}
                                alt={locale === "id" ? "Sesi kerja studio" : "Studio working session"}
                                fill
                                sizes="(max-width: 640px) 100vw, 55vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop */}
                <div className="fade-up fade-up-delay-2 hidden grid-cols-[26%_1fr_48%] items-end gap-6 px-12 lg:grid xl:gap-8">
                    <div className="relative aspect-[438/346] self-end overflow-hidden rounded-2xl">
                        <Image
                            src={SMALL_IMAGE}
                            alt={locale === "id" ? "Tim plus. bekerja" : "The plus. team at work"}
                            fill
                            sizes="26vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="flex self-start">
                        <div className="ml-auto max-w-md">
                            <p className="text-base leading-[1.65] text-slate-900 xl:text-[17px] dark:text-white/90">
                                {t.about.description}
                            </p>
                            {statRow}
                            <div className="mt-8">{cta}</div>
                        </div>
                    </div>

                    <div className="relative aspect-[3/2] self-end overflow-hidden rounded-2xl">
                        <Image
                            src={LARGE_IMAGE}
                            alt={locale === "id" ? "Sesi kerja studio" : "Studio working session"}
                            fill
                            sizes="48vw"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="fade-up fade-up-delay-3 mt-12 grid gap-4 px-5 sm:mt-16 sm:px-8 md:grid-cols-3 lg:mt-24 lg:px-12">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;

                        return (
                            <div
                                key={pillar.title}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-[#0c74eb] dark:bg-white/10 dark:text-sky-300">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-5 text-lg font-medium tracking-[-0.02em] text-slate-950 dark:text-white">
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
        </section>
    );
}
