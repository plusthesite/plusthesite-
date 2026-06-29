"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useT, useLocale } from "@/i18n/I18nProvider";
import { formatIDR } from "@/lib/services";

type Billing = "monthly" | "annual";
type Method = "card" | "va" | "ewallet";

const PLAN_KEYS = ["starter", "professional", "enterprise"] as const;
type PlanKey = (typeof PLAN_KEYS)[number];

function isPlanKey(value: string | null): value is PlanKey {
    return !!value && (PLAN_KEYS as readonly string[]).includes(value);
}

function PaymentContent() {
    const t = useT();
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();

    // The selected plan arrives via query params from the pricing CTAs.
    const planParam = searchParams.get("plan");
    const planKey: PlanKey | null = isPlanKey(planParam) ? planParam : null;
    const billing: Billing = searchParams.get("billing") === "annual" ? "annual" : "monthly";
    const customName = searchParams.get("name") ?? "";
    const customPrice = searchParams.get("price") ?? "";

    const [method, setMethod] = useState<Method>("card");
    const [cardName, setCardName] = useState("");
    const [email, setEmail] = useState("");

    const p = t.payment;

    // Resolve the active plan into a single display model the UI can read.
    const summary = useMemo(() => {
        if (planKey) {
            const plan = t.pricing.plans[planKey];
            const amount = billing === "annual" ? plan.annual : plan.monthly;
            return {
                mode: "plan" as const,
                name: plan.name,
                tagline: plan.tagline,
                features: plan.features as readonly string[],
                priceLabel: formatIDR(amount),
            };
        }
        if (customName) {
            return {
                mode: "custom" as const,
                name: customName,
                tagline: p.custom,
                features: [] as readonly string[],
                priceLabel: customPrice || "—",
            };
        }
        return null;
    }, [planKey, billing, customName, customPrice, t.pricing.plans, p.custom]);

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (planKey) {
            params.set("plan", planKey);
            params.set("billing", billing);
        } else if (customName) {
            params.set("name", customName);
            if (customPrice) params.set("price", customPrice);
        }
        params.set("method", method);
        router.push(`/${locale}/payment/redirect?${params.toString()}`);
    };

    const methods: { id: Method; label: string }[] = [
        { id: "card", label: p.methodCard },
        { id: "va", label: p.methodVA },
        { id: "ewallet", label: p.methodEwallet },
    ];

    return (
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <Link
                    href={`/${locale}#pricing`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary-dark mb-6 transition-colors"
                >
                    <svg className="h-3 w-3 rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {p.backToPricing}
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                    {p.title} <span className="gradient-text">{p.titleHighlight}</span>
                </h1>
                <p className="mt-4 text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                    {p.subtitle}
                </p>
            </div>

            {/* Placeholder gateway notice */}
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4 flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 shrink-0 items-center rounded-full bg-amber-500/15 px-2.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {p.dummyBadge}
                </span>
                <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">{p.dummyNotice}</p>
            </div>

            {!summary ? (
                <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-slate-900/80 p-10 text-center shadow-xl">
                    <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">{p.emptyTitle}</h2>
                    <p className="mt-3 text-sm text-[#475569] dark:text-[#94A3B8]">{p.emptyDesc}</p>
                    <Link
                        href={`/${locale}#pricing`}
                        className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                    >
                        {p.choosePlan}
                    </Link>
                </div>
            ) : (
                <div className="mt-12 grid gap-8 lg:grid-cols-5">
                    {/* ── Payment method ── */}
                    <form onSubmit={handleContinue} className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-slate-900/80 p-8 shadow-xl backdrop-blur-md">
                        <div>
                            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">{p.methodTitle}</h2>
                            <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">{p.methodSubtitle}</p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            {methods.map((m) => (
                                <button
                                    type="button"
                                    key={m.id}
                                    onClick={() => setMethod(m.id)}
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition-all ${method === m.id
                                        ? "border-primary bg-primary/5 text-[#0F172A] dark:text-[#F8FAFC] ring-1 ring-primary/20"
                                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-[#475569] dark:text-[#CBD5E1] hover:border-slate-300 dark:hover:border-slate-600"
                                        }`}
                                >
                                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${method === m.id ? "border-primary" : "border-slate-300 dark:border-slate-600"}`}>
                                        {method === m.id && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                    </span>
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col gap-6">
                            <div>
                                <label htmlFor="cardName" className="block text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                                    {p.cardName}
                                </label>
                                <input
                                    type="text"
                                    id="cardName"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="mt-2 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    placeholder={p.cardNamePlaceholder}
                                />
                            </div>

                            <div>
                                <label htmlFor="cardNumber" className="block text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                                    {p.cardNumber}
                                </label>
                                <div className="mt-2 flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/40 px-4 py-3 text-sm tracking-widest text-slate-400 select-none">
                                    •••• •••• •••• ••••
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                                    {p.emailLabel}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    placeholder={p.emailPlaceholder}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-100 transition-all"
                        >
                            {summary.mode === "plan" ? `${p.payButton} ${summary.priceLabel}` : p.continueButton}
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>

                        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {p.securedNote}
                        </p>
                    </form>

                    {/* ── Order summary ── */}
                    <aside className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-slate-900/80 p-8 shadow-xl backdrop-blur-md lg:sticky lg:top-28">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                                {p.orderSummary}
                            </p>

                            <div className="mt-5 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#1E293B] pb-5">
                                <div>
                                    <p className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">{summary.name}</p>
                                    <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">{summary.tagline}</p>
                                </div>
                                <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                                    {p.planLabel}
                                </span>
                            </div>

                            {summary.mode === "plan" && (
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E293B] py-4 text-sm">
                                    <span className="text-[#64748B] dark:text-[#94A3B8]">{p.billingLabel}</span>
                                    <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                        {billing === "annual" ? p.annual : p.monthly}
                                    </span>
                                </div>
                            )}

                            {summary.features.length > 0 && (
                                <div className="border-b border-slate-100 dark:border-[#1E293B] py-5">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                                        {p.whatsIncluded}
                                    </p>
                                    <ul className="mt-4 flex flex-col gap-3">
                                        {summary.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <svg className="h-4 w-4 flex-shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="pt-5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#64748B] dark:text-[#94A3B8]">{p.subtotal}</span>
                                    <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                        {summary.priceLabel}{summary.mode === "plan" ? ` ${p.perMonth}` : ""}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-[#94A3B8]">
                                    <span>{p.tax}</span>
                                </div>
                                <div className="mt-4 flex items-end justify-between border-t border-slate-100 dark:border-[#1E293B] pt-4">
                                    <span className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{p.total}</span>
                                    <span className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                                        {summary.priceLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default function PaymentPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-[#0B1120] bg-grid pt-28 pb-16 lg:pt-36">
                <div className="glow-ambient glow-ambient-1" aria-hidden="true" />
                <div className="glow-ambient glow-ambient-2" aria-hidden="true" />
                <Suspense fallback={null}>
                    <PaymentContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
