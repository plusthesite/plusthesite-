"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareText, Sparkles, Zap } from "lucide-react";
import { useT, useLocale } from "@/i18n/I18nProvider";

export default function Hero() {
    const t = useT();
    const locale = useLocale();

    return (
        <section id="hero" className="relative overflow-hidden bg-[#f6f8fb] pt-28 text-slate-950 dark:bg-slate-950 dark:text-white">
            <div className="mx-auto grid min-h-[92dvh] max-w-7xl items-center gap-12 px-6 pb-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
                <div className="max-w-2xl">
                    <p className="hero-animate inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-white/5 dark:text-blue-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t.hero.badge}
                    </p>

                    <h1 className="hero-animate hero-animate-delay-1 mt-7 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
                        {t.hero.titleLine1}
                        <span className="block text-blue-700 dark:text-blue-300">{t.hero.titleLine2}</span>
                    </h1>

                    <p className="hero-animate hero-animate-delay-2 mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                        {t.hero.description}
                    </p>

                    <div className="hero-animate hero-animate-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={`/${locale}#products`}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:translate-y-px dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100"
                        >
                            {t.hero.ctaPrimary}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            href={`/${locale}#pricing`}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:border-slate-400 active:translate-y-px dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            {t.hero.ctaSecondary}
                        </Link>
                    </div>
                </div>

                <div className="hero-animate hero-animate-delay-2 relative">
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5">
                        <div className="rounded-xl border border-slate-100 bg-slate-950 p-4 text-white dark:border-white/10">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">plus desk</p>
                                    <p className="mt-1 text-lg font-semibold">Launch board</p>
                                </div>
                                <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">
                                    Live
                                </div>
                            </div>

                            <div className="grid gap-3 py-4 sm:grid-cols-3">
                                {[
                                    ["12", "Campaigns"],
                                    ["84%", "Reply rate"],
                                    ["3.2x", "Faster ship"],
                                ].map(([value, label]) => (
                                    <div key={label} className="rounded-xl bg-white/[0.06] p-4">
                                        <p className="text-2xl font-semibold tracking-tight">{value}</p>
                                        <p className="mt-1 text-xs text-slate-400">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                                <div className="rounded-xl bg-white/[0.06] p-4">
                                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                                        <MessageSquareText className="h-4 w-4 text-blue-300" />
                                        Customer flow
                                    </div>
                                    {["WhatsApp lead captured", "CRM follow-up assigned", "Proposal draft ready"].map((item) => (
                                        <div key={item} className="flex items-center gap-3 border-t border-white/10 py-3 text-sm text-slate-300">
                                            <CheckCircle2 className="h-4 w-4 text-blue-300" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="rounded-xl bg-blue-500 p-4 text-white">
                                    <Zap className="h-5 w-5" />
                                    <p className="mt-8 text-3xl font-semibold tracking-tight">1 team</p>
                                    <p className="mt-2 text-sm leading-6 text-blue-50">
                                        AI, creative, CRM, content, and apps under one operating rhythm.
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
