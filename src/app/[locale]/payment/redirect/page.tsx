"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useT, useLocale } from "@/i18n/I18nProvider";

export default function PaymentRedirectPage() {
    const t = useT();
    const locale = useLocale();
    const r = t.paymentRedirect;

    // Placeholder flow: cycle through "connecting" copy, then settle on a
    // pending state because the live gateway is not wired up yet.
    const [stepIndex, setStepIndex] = useState(0);
    const [pending, setPending] = useState(false);

    const steps = [r.statusPreparing, r.statusConnecting, r.statusAlmost];

    useEffect(() => {
        const tick = setInterval(() => {
            setStepIndex((i) => (i < steps.length - 1 ? i + 1 : i));
        }, 1100);
        const done = setTimeout(() => setPending(true), 3600);
        return () => {
            clearInterval(tick);
            clearTimeout(done);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-[#0B1120] bg-grid pt-28 pb-16 lg:pt-36 flex items-center">
                <div className="glow-ambient glow-ambient-1" aria-hidden="true" />
                <div className="glow-ambient glow-ambient-2" aria-hidden="true" />

                <div className="relative mx-auto w-full max-w-xl px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-slate-900/80 p-10 text-center shadow-xl backdrop-blur-md">
                        {!pending ? (
                            <>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <svg className="h-8 w-8 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                                <h1 className="mt-7 text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                                    {r.title}
                                </h1>
                                <p className="mt-3 text-sm text-[#475569] dark:text-[#94A3B8]">{r.subtitle}</p>
                                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary transition-all">
                                    {steps[stepIndex]}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h1 className="mt-7 text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                                    {r.pendingTitle}
                                </h1>
                                <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">{r.pendingDesc}</p>

                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link
                                        href={`/${locale}/contact-us`}
                                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                                    >
                                        {r.contactSales}
                                    </Link>
                                    <Link
                                        href={`/${locale}`}
                                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-700 px-7 py-3 text-sm font-semibold text-[#0F172A] dark:text-white hover:scale-105 transition-all"
                                    >
                                        {r.backHome}
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Placeholder gateway notice */}
                    <div className="mt-6 rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4 text-center">
                        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">{r.dummyNotice}</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
