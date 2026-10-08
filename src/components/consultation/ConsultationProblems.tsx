"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/i18n/I18nProvider";
import { getConsultation } from "@/lib/consultationContent";

export default function ConsultationProblems() {
    const locale = useLocale();
    const copy = getConsultation(locale).problems;
    const ref = useScrollReveal();

    return (
        <section className="bg-white py-24 text-slate-950 lg:py-32 dark:bg-[#0B1120] dark:text-white">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="fade-up text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                        {copy.title}
                    </h2>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {copy.items.map((item, index) => (
                        <div
                            key={item.title}
                            className={`fade-up fade-up-delay-${index + 1} rounded-[1.8rem] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/[0.05]`}
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                                {index + 1}
                            </span>
                            <h3 className="mt-6 text-lg font-semibold leading-8 tracking-[-0.02em]">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
