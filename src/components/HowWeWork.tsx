"use client";

import { useLocale } from "@/i18n/I18nProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const COPY = {
    en: {
        tag: "How We Work",
        title: "From idea to launch, without the chaos",
        steps: [
            { t: "Discovery", d: "We learn your goals, audience, and what a win looks like." },
            { t: "Strategy & Design", d: "We map the plan and craft the look — on-brand and built to convert." },
            { t: "Build & Launch", d: "Our AI + creative team ships it fast, tested and polished." },
            { t: "Grow & Support", d: "We track results and keep improving — so you stay ahead." },
        ],
    },
    id: {
        tag: "Cara Kami Bekerja",
        title: "Dari ide ke rilis, tanpa ribet",
        steps: [
            { t: "Discovery", d: "Kami pahami tujuan, audiens, dan target kesuksesan Anda." },
            { t: "Strategi & Desain", d: "Kami susun rencana dan rancang tampilan — sesuai brand, fokus konversi." },
            { t: "Bangun & Rilis", d: "Tim AI + kreatif kami rilis cepat, teruji, dan rapi." },
            { t: "Tumbuh & Dukungan", d: "Kami pantau hasil dan terus tingkatkan — agar Anda tetap unggul." },
        ],
    },
};

export function HowWeWork() {
    const ref = useScrollReveal();
    const c = COPY[useLocale()];
    return (
        <section className="py-20 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="fade-up inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                        {c.tag}
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl">
                        {c.title}
                    </h2>
                </div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {c.steps.map((s, i) => (
                        <div key={i} className="fade-up relative rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] p-6" style={{ animationDelay: `${i * 90}ms` }}>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-md shadow-primary/30">
                                {i + 1}
                            </span>
                            <h3 className="mt-4 text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">{s.t}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">{s.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
