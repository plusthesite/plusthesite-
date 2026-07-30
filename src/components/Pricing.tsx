"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";
import { formatIDR } from "@/lib/services";

type PlanView = {
  key: string;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  features: readonly string[];
  highlighted: boolean;
};

function CheckIcon({ highlighted }: { highlighted?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        highlighted
          ? "bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"
          : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
      }`}
    >
      <Check className="h-3.5 w-3.5" />
    </span>
  );
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const ref = useScrollReveal();
  const t = useT();
  const locale = useLocale();

  const p = t.pricing;
  const plans: PlanView[] = [
    { key: "starter", ...p.plans.starter, highlighted: false },
    { key: "professional", ...p.plans.professional, highlighted: true },
    { key: "enterprise", ...p.plans.enterprise, highlighted: false },
  ];

  return (
    <section
      id="pricing"
      className="bg-[#f7f5ef] py-24 text-slate-950 lg:py-32 dark:bg-[#0B1120] dark:text-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              {p.tag}
            </p>
            <h2 className="fade-up fade-up-delay-1 mt-5 text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl dark:text-white">
              {p.title}
            </h2>
            <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
              {p.description}
            </p>

            <div className="fade-up fade-up-delay-2 mt-8 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <button
                onClick={() => setIsAnnual(false)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                  !isAnnual
                    ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {p.monthly}
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                  isAnnual
                    ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {p.annual}
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {p.save}
                </span>
              </button>
            </div>
          </div>

          <div className="fade-up fade-up-delay-3 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.12)] dark:bg-white/10">
                <Sparkles className="h-5 w-5 text-sky-300" />
                <p className="mt-6 text-2xl font-semibold tracking-tight">
                  {locale === "id"
                    ? "Mulai ringan, naik saat workflow makin padat."
                    : "Start light, scale when the workflow gets heavier."}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {locale === "id"
                    ? "Pricing ini dibuat untuk tim yang ingin bertumbuh tanpa langsung membeli kompleksitas yang belum mereka perlukan."
                    : "Pricing is shaped for teams that want to grow without buying complexity before they actually need it."}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:bg-white/5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                <p className="mt-6 text-lg font-semibold text-slate-950 dark:text-white">
                  {locale === "id"
                    ? "Jalur pembelian lebih jelas."
                    : "A clearer buying path."}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {locale === "id"
                    ? "Pilih plan dasar, lanjutkan ke payment, lalu biarkan tim menyesuaikan scope lewat alur sales bila kebutuhan lebih besar."
                    : "Choose a base plan, continue to payment, then let the team adjust scope through sales if the need is larger."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="fade-up fade-up-delay-3 mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annual : plan.monthly;

            return (
              <article
                key={`${plan.key}-${isAnnual ? "annual" : "monthly"}`}
                className={`relative flex h-full flex-col rounded-[1.8rem] border p-7 transition-all hover:-translate-y-1 ${
                  plan.highlighted
                    ? "border-sky-500 bg-slate-950 text-white shadow-[0_24px_80px_rgba(14,165,233,0.16)] dark:border-sky-400"
                    : "border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/[0.04]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-6">
                    <span className="rounded-full bg-sky-500 px-4 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md shadow-sky-500/30">
                      {p.recommended}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className={`text-xl font-semibold tracking-[-0.02em] ${
                        plan.highlighted
                          ? "text-white"
                          : "text-slate-950 dark:text-white"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-6 ${
                        plan.highlighted
                          ? "text-white/68"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {plan.tagline}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                      plan.highlighted
                        ? "bg-white/10 text-white/80"
                        : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                    }`}
                  >
                    {plan.key}
                  </span>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6 dark:border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                        plan.highlighted ? "text-white/45" : "text-slate-400"
                      }`}
                    >
                      {p.from}
                    </span>
                    <span className="text-4xl font-semibold tracking-tight">
                      {formatIDR(price)}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      plan.highlighted
                        ? "text-white/62"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {p.perMonth}
                    {isAnnual ? ` / ${p.billedAnnually}` : ""}
                  </p>
                </div>

                <Link
                  href={`/${locale}/payment?plan=${plan.key}&billing=${isAnnual ? "annual" : "monthly"}`}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition hover:scale-[1.02] ${
                    plan.highlighted
                      ? "bg-white text-slate-950 hover:bg-slate-100"
                      : "border border-slate-200 bg-slate-950 text-white hover:bg-slate-800 dark:border-white/10 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  }`}
                >
                  {p.choosePlan}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="mt-8 border-t border-white/10 pt-6 dark:border-white/10">
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                      plan.highlighted
                        ? "text-white/45"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {p.whatsIncluded}
                  </p>
                  <ul className="mt-4 flex flex-col gap-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckIcon highlighted={plan.highlighted} />
                        <span
                          className={`text-sm leading-6 ${
                            plan.highlighted
                              ? "text-white/78"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <p className="fade-up mx-auto mt-10 max-w-2xl text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
          {p.note}
        </p>
      </div>
    </section>
  );
}
