"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useScrollReveal();
  const t = useT();
  const locale = useLocale();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const highlights = [
    {
      label: locale === "id" ? "Respon awal" : "First response",
      value: locale === "id" ? "< 1 hari kerja" : "< 1 business day",
    },
    {
      label: locale === "id" ? "Gaya kerja" : "Working style",
      value:
        locale === "id"
          ? "Langsung ke scope dan prioritas"
          : "Straight into scope and priorities",
    },
    {
      label: locale === "id" ? "Cocok untuk" : "Best fit",
      value:
        locale === "id"
          ? "Tim yang butuh delivery cepat"
          : "Teams that need fast delivery",
    },
  ];

  return (
    <section
      id="faq"
      className="bg-[#f7f5ef] py-24 text-slate-950 lg:py-32 dark:bg-[#0B1120] dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              {t.faq.tag}
            </p>
            <h2 className="fade-up fade-up-delay-1 mt-5 text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl dark:text-white">
              {t.faq.title}
            </h2>
            <p className="fade-up fade-up-delay-2 mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              {t.faq.description}
            </p>

            <div className="fade-up fade-up-delay-3 mt-8 rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04]">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-white/[0.05]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-950 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fade-up fade-up-delay-3 grid gap-4">
            {t.faqItems.map(
              (faq: { question: string; answer: string }, index: number) => {
                const open = openIndex === index;
                const panelId = `faq-panel-${index}`;
                const buttonId = `faq-trigger-${index}`;

                return (
                  <div
                    key={faq.question}
                    className={`rounded-[1.6rem] border transition-all ${
                      open
                        ? "border-slate-950 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] dark:border-white dark:bg-white/[0.06]"
                        : "border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/[0.04]"
                    }`}
                  >
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left sm:px-7"
                    >
                      <span
                        className={`text-base font-semibold leading-relaxed ${
                          open ? "text-white" : "text-slate-950 dark:text-white"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                          open
                            ? "bg-white/10 text-white"
                            : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                        }`}
                      >
                        {open ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={open ? "block" : "hidden"}
                    >
                      <div className="px-6 pb-6 sm:px-7">
                        <div className="border-t border-white/10 pt-5 dark:border-white/10">
                          <p className="max-w-3xl text-sm leading-7 text-white/75 dark:text-slate-300">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
