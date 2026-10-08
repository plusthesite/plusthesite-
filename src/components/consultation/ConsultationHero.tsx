"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useLocale } from "@/i18n/I18nProvider";
import { getConsultation } from "@/lib/consultationContent";

export default function ConsultationHero() {
    const locale = useLocale();
    const copy = getConsultation(locale).hero;

    return (
        <section className="relative overflow-hidden bg-[#f5f4ef] pt-28 dark:bg-slate-950 lg:pt-36">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.10),_transparent_24%)]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl py-16 text-center lg:py-24">
                    <span className="fade-up inline-flex w-max items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        {copy.eyebrow}
                    </span>

                    <h1 className="fade-up fade-up-delay-1 mt-7 text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                        {copy.headline}
                    </h1>

                    <p className="fade-up fade-up-delay-2 mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                        {copy.subtitle}
                    </p>

                    <div className="fade-up fade-up-delay-3 mt-10 flex flex-col items-center gap-4">
                        <a
                            href="#form"
                            className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-sky-700 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100"
                        >
                            {copy.cta}
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 dark:bg-slate-900/10">
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </a>

                        <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            {copy.trust}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
