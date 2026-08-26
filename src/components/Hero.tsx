"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";
import HeroBackdrop from "@/components/HeroBackdrop";
import RollingLabel from "@/components/RollingLabel";
import { useLocale, useT } from "@/i18n/I18nProvider";

export default function Hero() {
    const t = useT();
    const locale = useLocale();

    return (
        <section
            id="hero"
            className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#ffffff] text-slate-950 dark:bg-[#070b14] dark:text-white"
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
