"use client";

import { useLocale } from "@/i18n/I18nProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ITEMS = {
  en: [
    { value: "90+", label: "Articles and field guides" },
    { value: "7", label: "Delivery lanes in one team" },
    { value: "ID / EN", label: "Bilingual collaboration" },
    { value: "AI + Human", label: "Built with both in the loop" },
  ],
  id: [
    { value: "90+", label: "Artikel dan panduan lapangan" },
    { value: "7", label: "Jalur delivery dalam satu tim" },
    { value: "ID / EN", label: "Kolaborasi dua bahasa" },
    { value: "AI + Manusia", label: "Dibangun dengan dua-duanya aktif" },
  ],
} as const;

export function ProofBand() {
  const ref = useScrollReveal();
  const locale = useLocale();
  const items = ITEMS[locale];

  return (
    <section className="bg-white py-20 lg:py-24 dark:bg-slate-950">
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,_#0f172a_0%,_#111827_46%,_#082f49_100%)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)] sm:px-8 lg:px-10 lg:py-10 dark:border-white/10">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200/80">
                {locale === "id" ? "Trust layer" : "Trust layer"}
              </p>
              <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {locale === "id"
                  ? "Bukti yang simpel, jujur, dan bisa diverifikasi."
                  : "Simple proof points that stay honest and verifiable."}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                {locale === "id"
                  ? "Kami tidak mengisi landing page dengan angka palsu. Yang ditampilkan di sini adalah sinyal nyata dari konten, bahasa kerja, dan cara tim plus bergerak."
                  : "We do not pad landing pages with made-up metrics. These are practical signals from our content footprint, delivery language, and how the plus team operates."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:gap-5">
              {items.map((item, index) => (
                <article
                  key={item.label}
                  className="fade-up rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <p className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {item.label}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
