"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/i18n/I18nProvider";
import { getConsultation } from "@/lib/consultationContent";

export default function ConsultationAgenda() {
    const locale = useLocale();
    const copy = getConsultation(locale).agenda;
    const ref = useScrollReveal();

    return (
        <section className="bg-slate-50 py-24 text-slate-950 lg:py-32 dark:bg-[#0B1120] dark:text-white">
            <div ref={ref} className="mx-auto max-w-5xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="fade-up text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                        {copy.title}
                    </h2>
                </div>

                {/* Desktop: table */}
                <div className="fade-up fade-up-delay-1 mt-14 hidden overflow-hidden rounded-[1.8rem] border border-slate-200 shadow-[0_12px_35px_rgba(15,23,42,0.05)] md:block dark:border-white/10">
                    <table className="w-full border-collapse bg-white text-left dark:bg-white/[0.03]">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10">
                                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Waktu
                                </th>
                                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Bagian
                                </th>
                                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Yang Anda dapat
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {copy.rows.map((row) => (
                                <tr
                                    key={row.time}
                                    className="border-b border-slate-100 last:border-0 dark:border-white/5"
                                >
                                    <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-sky-700 dark:text-sky-300">
                                        {row.time}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold">
                                        {row.part}
                                    </td>
                                    <td className="px-6 py-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        {row.detail}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile: stacked cards */}
                <div className="fade-up fade-up-delay-1 mt-10 grid gap-4 md:hidden">
                    {copy.rows.map((row) => (
                        <div
                            key={row.time}
                            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/[0.05]"
                        >
                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
                                    {row.time}
                                </span>
                                <span className="text-sm font-semibold">{row.part}</span>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {row.detail}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="fade-up fade-up-delay-2 mt-10 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[1.8rem] border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.05]">
                        <h3 className="text-lg font-semibold tracking-[-0.02em]">
                            {copy.noPitch.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {copy.noPitch.body}
                        </p>
                    </div>
                    <div className="rounded-[1.8rem] border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.05]">
                        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {copy.pricing}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
