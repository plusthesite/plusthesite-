"use client";

import { useState } from "react";
import { ArrowRight, Instagram, Send } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/i18n/I18nProvider";

const EMAIL = "official@plusthe.site";

// The public price table is gone while the team focuses on finding first
// customers: pricing is agreed per project over email or social. The id stays
// "pricing" because nav, footer and many subpages still link to /#pricing.
export default function PricingContact() {
  const ref = useScrollReveal();
  const locale = useLocale();
  const isID = locale === "id";

  const needs = isID
    ? ["Landing page 1 hari", "AI Chat Bot", "CRM", "Aplikasi mobile", "Branding & konten", "Belum yakin"]
    : ["1-day landing page", "AI Chat Bot", "CRM", "Mobile app", "Branding & content", "Not sure yet"];
  const [need, setNeed] = useState(0);

  const steps = isID
    ? [
        ["Ceritakan bisnis Anda", "Pilih kebutuhan, buka template, isi 4 baris. Cukup 2 menit."],
        ["Terima rencana dan harga", "Rekomendasi produk, estimasi waktu, dan penawaran tertulis."],
        ["Mulai jalan", "Landing page bisa live dalam 1 hari kerja setelah materi lengkap."],
      ]
    : [
        ["Tell us about your business", "Pick what you need, open the template, fill in four lines. Takes about two minutes."],
        ["Get your plan and quote", "A product recommendation, an estimated timeline, and a written quote."],
        ["Launch", "Your landing page can be live within one business day once we have your materials."],
      ];

  const subject = isID ? `Minta penawaran: ${needs[need]}` : `Quote request: ${needs[need]}`;
  const fields = isID
    ? [["Nama bisnis", "..."], ["Bidang usaha", "..."], ["Yang saya butuhkan", needs[need]], ["Target mulai", "..."]]
    : [["Business name", "..."], ["Industry", "..."], ["What I need", needs[need]], ["Target start", "..."]];
  const body = [isID ? "Halo tim plus.," : "Hi plus. team,", "", ...fields.map(([k, v]) => `${k}: ${v}`)].join("\n");
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section
      id="pricing"
      className="scroll-mt-20 bg-white text-slate-950 dark:bg-[#0B1120] dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="fade-up relative overflow-hidden rounded-[1.75rem] bg-[#0c74eb] p-6 text-white shadow-[0_24px_80px_rgba(12,116,235,0.30)] sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
                {isID ? "Penawaran" : "Get a quote"}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[2.75rem]">
                {isID
                  ? "Kirim satu email. Kami siapkan rencana terbaik untuk bisnis Anda."
                  : "Send one email. We'll map out the best plan for your business."}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
                {isID
                  ? "Tanpa tabel paket yang bikin bingung. Harga disusun dari kebutuhan bisnis Anda, jadi Anda hanya membayar yang benar-benar dipakai."
                  : "No confusing plan tables. Every quote is built around your business, so you only pay for what you'll actually use."}
              </p>

              <ol className="mt-8 space-y-3">
                {steps.map(([title, text], i) => (
                  <li
                    key={title}
                    className="flex gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#0c74eb]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-0.5 text-sm leading-6 text-white/75">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <a
                href="https://www.instagram.com/plusthe.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
              >
                <Instagram className="h-4 w-4" />
                {isID ? "Lebih suka chat? DM Instagram @plusthe.site" : "Prefer chat? DM us on Instagram @plusthe.site"}
              </a>
            </div>

            {/* A pre-filled email: the visitor picks a need, and the template
                and mailto link follow, so the only step left is hitting send. */}
            <div className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-[0_30px_80px_rgba(2,32,71,0.35)] lg:rotate-[1.5deg] lg:transition-transform lg:duration-500 lg:hover:rotate-0">
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-slate-500">
                  {isID ? "Pesan baru" : "New message"}
                </span>
              </div>

              <div className="space-y-2 border-b border-slate-100 px-5 py-4 text-sm">
                <p>
                  <span className="text-slate-400">{isID ? "Kepada" : "To"}: </span>
                  <span className="font-medium">{EMAIL}</span>
                </p>
                <p className="truncate">
                  <span className="text-slate-400">{isID ? "Subjek" : "Subject"}: </span>
                  <span className="font-medium">{subject}</span>
                </p>
              </div>

              <div className="px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {isID ? "Saya butuh" : "I need"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {needs.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setNeed(i)}
                      aria-pressed={need === i}
                      className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                        need === i
                          ? "bg-[#0c74eb] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-1.5 rounded-xl bg-slate-50 p-4 text-[13px] leading-6 text-slate-600">
                  <p>{isID ? "Halo tim plus.," : "Hi plus. team,"}</p>
                  {fields.map(([k, v]) => (
                    <p key={k}>
                      {k}:{" "}
                      <span
                        className={
                          v === "..."
                            ? "inline-block w-20 border-b border-dashed border-slate-300 align-middle"
                            : "rounded bg-sky-100 px-1.5 py-0.5 font-medium text-sky-800"
                        }
                      >
                        {v === "..." ? "" : v}
                      </span>
                    </p>
                  ))}
                </div>

                <a
                  href={mail}
                  className="group mt-5 flex items-center justify-between gap-3 rounded-full bg-[#0c74eb] py-2 pl-5 pr-2 text-sm font-medium text-white transition-colors hover:bg-[#0a5dbc]"
                >
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {isID ? "Buka di email saya" : "Open in my email"}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
                    <ArrowRight className="h-4 w-4 text-[#0c74eb]" />
                  </span>
                </a>
                <p className="mt-3 text-center text-xs text-slate-400">
                  {isID ? "Terbuka di aplikasi email Anda, tinggal isi lalu kirim." : "Opens in your email app. Fill in the blanks and hit send."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
