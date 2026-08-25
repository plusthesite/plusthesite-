"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";
import HeroBackdrop from "@/components/HeroBackdrop";
import RollingLabel from "@/components/RollingLabel";
import { useLocale, useT } from "@/i18n/I18nProvider";

/** Starburst used on the credential pill. */
function Starburst({ className = "" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            aria-hidden
        >
            <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
        </svg>
    );
}

export default function Hero() {
    const t = useT();
    const locale = useLocale();

    return (
        <section
            id="hero"
            className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#efefef] text-slate-950 dark:bg-[#070b14] dark:text-white"
        >
            <HeroBackdrop />

            <div className="relative z-20 flex min-h-[100svh] flex-col">
                <div className="flex-1" />

                <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
                    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mb-8">
                        <AnimatedLogo
                            href={null}
                            variant="auto"
                            size="large"
                            loop
                            replayOnHover={false}
                            className="translate-y-[1px]"
                        />
                        <span className="h-4 w-px bg-slate-900/20 dark:bg-white/20" />
                        <p className="text-[13px] tracking-wide text-slate-900 sm:text-sm dark:text-white/90">
                            {t.hero.badge}
                        </p>
                    </div>

                    <h1 className="max-w-[20ch] text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-slate-950 sm:max-w-none sm:text-[clamp(2.5rem,5vw,4.2rem)] dark:text-white">
                        {t.hero.titleLine1}
                        <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                        {t.hero.titleLine2}
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-[1.65] text-slate-700 sm:mt-6 sm:text-base dark:text-white/70">
                        {t.hero.description}
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
                        <Link
                            href={`/${locale}#products`}
                            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#0c74eb] py-2 pl-5 pr-2 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[#0a5dbc] sm:pl-6 sm:text-sm"
                        >
                            <RollingLabel>{t.hero.ctaPrimary}</RollingLabel>
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 sm:h-8 sm:w-8">
                                <ArrowRight className="h-3.5 w-3.5 text-[#0c74eb]" />
                            </span>
                        </Link>

                        <div className="inline-flex w-fit items-center gap-2.5 rounded-[4px] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:bg-white/10">
                            <Starburst className="h-5 w-5 fill-current text-[#0c74eb] sm:h-6 sm:w-6" />
                            <span className="text-[13px] font-medium text-slate-900 sm:text-sm dark:text-white">
                                {t.hero.subtitle}
                            </span>
                            <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:text-[11px] dark:bg-white dark:text-slate-950">
                                {locale === "id" ? "Global" : "Global"}
                            </span>
                        </div>

                        <Link
                            href={`/${locale}#pricing`}
                            className="w-fit text-[13px] font-medium text-slate-700 underline-offset-4 transition-colors hover:text-slate-950 hover:underline sm:text-sm dark:text-white/70 dark:hover:text-white"
                        >
                            {t.hero.ctaSecondary}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
