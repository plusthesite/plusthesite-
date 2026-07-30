"use client";

import { useLocale } from "@/i18n/I18nProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const COPY = {
    en: {
        tag: "How We Work",
        title: "From idea to launch, without the chaos",
        intro:
            "A tighter delivery rhythm for teams that want speed, clarity, and output that survives past launch week.",
        steps: [
            {
                t: "Discovery",
                d: "We align on goals, audience, and what a real win looks like before any assets are made.",
            },
            {
                t: "Strategy & Design",
                d: "We shape the flow, narrative, and interface so the work feels coherent before it scales.",
            },
            {
                t: "Build & Launch",
                d: "Our AI, creative, and product layers move together so delivery stays fast and polished.",
            },
            {
                t: "Grow & Support",
                d: "We measure what matters, then keep tuning the system instead of treating launch as the finish line.",
            },
        ],
    },
    id: {
        tag: "Cara Kami Bekerja",
        title: "Dari ide ke rilis, tanpa ribet",
        intro:
            "Ritme delivery yang lebih rapat untuk tim yang butuh kecepatan, kejelasan, dan hasil yang tetap hidup setelah launch.",
        steps: [
            {
                t: "Discovery",
                d: "Kami selaraskan tujuan, audiens, dan definisi menang yang nyata sebelum aset mulai dibuat.",
            },
            {
                t: "Strategi & Desain",
                d: "Kami bentuk alur, narasi, dan interface supaya sistem terasa utuh sebelum diperbesar.",
            },
            {
                t: "Bangun & Rilis",
                d: "Layer AI, creative, dan product bergerak bersama agar delivery tetap cepat dan rapi.",
            },
            {
                t: "Tumbuh & Dukungan",
                d: "Kami ukur yang penting, lalu terus tuning sistem agar launch bukan titik berhenti.",
            },
        ],
    },
} as const;

export function HowWeWork() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const copy = COPY[locale];

    return (
        <section className="bg-[#f7f5ef] py-24 text-slate-950 lg:py-32 dark:bg-[#0B1120] dark:text-white">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
                    <div className="max-w-2xl">
                        <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                            {copy.tag}
                        </p>
                        <h2 className="fade-up fade-up-delay-1 mt-5 text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl dark:text-white">
                            {copy.title}
                        </h2>
                        <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
                            {copy.intro}
                        </p>
                    </div>

                    <div className="fade-up fade-up-delay-2 rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-950 p-5 text-white dark:bg-white/10">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                    Delivery stance
                                </p>
                                <p className="mt-4 text-lg font-semibold">
                                    {locale === "id"
                                        ? "Cepat, tapi tetap terstruktur."
                                        : "Fast, but still structured."}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-white/5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Best fit
                                </p>
                                <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                                    {locale === "id"
                                        ? "Tim yang ingin launch tanpa drama operasional."
                                        : "Teams that want launch momentum without operational drama."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {copy.steps.map((step, index) => (
                        <div
                            key={step.t}
                            className="fade-up rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/[0.04]"
                            style={{ animationDelay: `${index * 90}ms` }}
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                {index + 1}
                            </span>
                            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                                {step.t}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {step.d}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
