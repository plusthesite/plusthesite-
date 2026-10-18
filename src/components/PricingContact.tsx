"use client";

import { ArrowRight, Instagram, Mail } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/i18n/I18nProvider";

// The public price table is gone while the team focuses on finding first
// customers: pricing is agreed per project over email or social. The id stays
// "pricing" because nav, footer and many subpages still link to /#pricing.
export default function PricingContact() {
  const ref = useScrollReveal();
  const locale = useLocale();
  const isID = locale === "id";

  const mail = `mailto:official@plusthe.site?subject=${encodeURIComponent(
    isID ? "Tanya harga plus." : "plus. pricing inquiry"
  )}`;

  return (
    <section
      id="pricing"
      className="scroll-mt-20 bg-white py-20 text-slate-950 lg:py-28 dark:bg-[#0B1120] dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="fade-up relative overflow-hidden rounded-[1.75rem] bg-[#0c74eb] px-6 py-12 text-white shadow-[0_24px_80px_rgba(12,116,235,0.30)] sm:px-12 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
                {isID ? "Harga" : "Pricing"}
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {isID
                  ? "Ceritakan kebutuhan Anda, kami kirim penawarannya."
                  : "Tell us what you need, we'll send you a quote."}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
                {isID
                  ? "Setiap bisnis mulai dari titik yang berbeda. Kirim email singkat tentang bisnis dan target Anda, kami balas dengan rekomendasi produk dan harga yang masuk akal untuk skala Anda."
                  : "Every business starts from a different place. Send a short email about your business and goals, and we'll reply with a product recommendation and a price that fits your scale."}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={mail}
                className="group flex items-center justify-between gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-medium text-slate-950 transition-colors hover:bg-sky-100"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#0c74eb]" />
                  <span className="truncate">official@plusthe.site</span>
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c74eb] transition-transform duration-500 group-hover:-rotate-45">
                  <ArrowRight className="h-4 w-4 text-white" />
                </span>
              </a>
              <a
                href="https://www.instagram.com/plusthe.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-full border border-white/40 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <Instagram className="h-4 w-4" />
                Instagram @plusthe.site
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
