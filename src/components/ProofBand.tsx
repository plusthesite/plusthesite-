"use client";

import { useLocale } from "@/i18n/I18nProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Honest, verifiable facts about plus. — no fabricated metrics.
const ITEMS = {
    en: [
        { v: "90+", l: "Articles & guides" },
        { v: "7", l: "Services, one team" },
        { v: "ID · EN", l: "Bilingual delivery" },
        { v: "AI + Human", l: "Built by both" },
    ],
    id: [
        { v: "90+", l: "Artikel & panduan" },
        { v: "7", l: "Layanan, satu tim" },
        { v: "ID · EN", l: "Dua bahasa" },
        { v: "AI + Manusia", l: "Dikerjakan keduanya" },
    ],
};

export function ProofBand() {
    const ref = useScrollReveal();
    const items = ITEMS[useLocale()];
    return (
        <section className="py-16 lg:py-20">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-6 rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 text-center text-white shadow-xl shadow-primary/20 sm:gap-8 lg:grid-cols-4 lg:p-12">
                    {items.map((s, i) => (
                        <div key={i} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                            <p className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">{s.v}</p>
                            <p className="mt-1 text-xs font-medium text-white/80 sm:text-sm">{s.l}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
