"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProofBand } from "@/components/ProofBand";
import { HowWeWork } from "@/components/HowWeWork";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type SectionItem = {
    title: string;
    body: string;
};

type StepItem = {
    step: string;
    title: string;
    body: string;
};

type LandingCopy = {
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        primaryCta: string;
        secondaryCta: string;
        note: string;
        chips: readonly string[];
        panelTitle: string;
        panelSubtitle: string;
        panelStatus: string;
        panelProblemLabel: string;
        panelProblemBody: string;
        panelValueLabel: string;
        panelValueBullets: readonly string[];
    };
    useCases: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: readonly SectionItem[];
    };
    system: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: readonly SectionItem[];
    };
    workflow: {
        eyebrow: string;
        title: string;
        subtitle: string;
        steps: readonly StepItem[];
    };
    outputs: {
        eyebrow: string;
        title: string;
        items: readonly string[];
    };
    cta: {
        kicker: string;
        title: string;
        subtitle: string;
        primary: string;
        secondary: string;
    };
};

type Theme = {
    heroBg: string;
    panelBg: string;
    panelAccent: string;
    softBg: string;
    softButton: string;
    darkAccent: string;
};

type LandingProps = {
    copy: LandingCopy;
    locale: "en" | "id";
    theme: Theme;
    cardIcons: React.ReactNode[];
    systemIcons: React.ReactNode[];
};

function HeroSection({ copy, theme, locale }: Pick<LandingProps, "copy" | "theme" | "locale">) {
    const summaryCards = [
        {
            label: locale === "id" ? "Pandangan operasi" : "Operating view",
            body:
                locale === "id"
                    ? "Tool generator bekerja paling baik saat masuk ke alur review, produksi, dan distribusi yang sama."
                    : "Generator tools work best when they sit inside the same review, production, and distribution flow.",
        },
        {
            label: locale === "id" ? "Paling cocok" : "Best fit",
            body:
                locale === "id"
                    ? "Untuk tim lean yang butuh output lebih cepat tanpa menurunkan rasa editorial atau kontrol brand."
                    : "For lean teams that need faster output without lowering editorial taste or brand control.",
        },
    ];

    return (
        <section className={`relative overflow-hidden ${theme.heroBg} pb-24 pt-28 text-white sm:pb-28 lg:pb-32`}>
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur">
                            <span className={`h-2 w-2 rounded-full ${theme.darkAccent}`} />
                            {copy.hero.badge}
                        </div>
                        <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                            {copy.hero.title}
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                            {copy.hero.subtitle}
                        </p>
                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="mailto:plusthesite@gmail.com?subject=AI%20Generator%20Inquiry"
                                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 ${theme.softButton}`}
                            >
                                {copy.hero.primaryCta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href="#use-cases"
                                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white/88 transition hover:border-white/28 hover:bg-white/10"
                            >
                                {copy.hero.secondaryCta}
                            </a>
                        </div>
                        <p className="mt-5 text-sm text-white/56">{copy.hero.note}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {copy.hero.chips.map((chip) => (
                                <span
                                    key={chip}
                                    className="rounded-full border border-white/10 bg-white/6 px-3.5 py-2 text-xs font-medium text-white/74"
                                >
                                    {chip}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {summaryCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                                >
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/52">
                                        {card.label}
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-white/74">{card.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className={`absolute -left-6 top-8 h-32 w-32 rounded-full blur-3xl ${theme.panelAccent}`} />
                        <div className={`absolute -right-8 bottom-12 h-40 w-40 rounded-full blur-3xl ${theme.panelAccent}`} />
                        <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur ${theme.panelBg}`}>
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">{copy.hero.panelTitle}</p>
                                    <p className="mt-1 text-xs text-white/54">{copy.hero.panelSubtitle}</p>
                                </div>
                                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                                    {copy.hero.panelStatus}
                                </span>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/42">{copy.hero.panelProblemLabel}</p>
                                    <p className="mt-2 text-sm leading-6 text-white/78">
                                        {copy.hero.panelProblemBody}
                                    </p>
                                </div>
                                <div className={`rounded-2xl border border-white/10 p-4 text-slate-900 ${theme.softBg}`}>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{copy.hero.panelValueLabel}</p>
                                    <ul className="mt-3 space-y-2 text-sm leading-6">
                                        {copy.hero.panelValueBullets.map((bullet) => (
                                            <li key={bullet} className="flex gap-2">
                                                <Check className="mt-0.5 h-4 w-4 text-slate-950" />
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function UseCasesSection({ copy, cardIcons, locale }: Pick<LandingProps, "copy" | "cardIcons" | "locale">) {
    const ref = useScrollReveal();

    return (
        <section id="use-cases" className="bg-[#f8f7f3] py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                    <div className="max-w-3xl">
                        <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {copy.useCases.eyebrow}
                        </p>
                        <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                            {copy.useCases.title}
                        </h2>
                        <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                            {copy.useCases.subtitle}
                        </p>
                    </div>

                    <div className="fade-up fade-up-delay-3 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    {locale === "id" ? "Tensi inti" : "Core tension"}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {locale === "id"
                                        ? "Masalah utamanya sering bukan kurang tool, tapi terlalu banyak langkah kreatif yang pecah dan tidak nyambung."
                                        : "The core problem is often not missing tools, but too many creative steps split across disconnected workflows."}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    {locale === "id" ? "Target perbaikan" : "Repair goal"}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {locale === "id"
                                        ? "Membuat generator terasa seperti bagian dari mesin produksi, bukan eksperimen lepas yang sulit dipakai tim."
                                        : "Make the generator feel like part of a production engine, not a detached experiment the team cannot reliably use."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-4 mt-14 grid gap-5 md:grid-cols-2">
                    {copy.useCases.items.map((item, index) => (
                        <article
                            key={item.title}
                            className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                {cardIcons[index]}
                            </div>
                            <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SystemSection({ copy, systemIcons, locale }: Pick<LandingProps, "copy" | "systemIcons" | "locale">) {
    const ref = useScrollReveal();

    return (
        <section className="bg-white py-24 lg:py-28">
            <div ref={ref} className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
                <div>
                    <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {copy.system.eyebrow}
                    </p>
                    <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                        {copy.system.title}
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                        {copy.system.subtitle}
                    </p>

                    <div className="fade-up fade-up-delay-3 mt-8 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {locale === "id" ? "Sikap sistem" : "System stance"}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {locale === "id"
                                ? "Generator yang bagus bukan sekadar mengeluarkan aset. Ia harus membantu tim menyaring, memilih, lalu meneruskan output ke langkah kerja berikutnya."
                                : "A good generator should not just output assets. It should help the team filter, choose, and move the result into the next working step."}
                        </p>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-4 grid gap-5">
                    {copy.system.items.map((item, index) => (
                        <div
                            key={item.title}
                            className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,23,42,0.1)] sm:p-7"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                                    {systemIcons[index]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WorkflowSection({ copy, theme }: Pick<LandingProps, "copy" | "theme">) {
    const ref = useScrollReveal();

    return (
        <section className="bg-slate-950 py-24 text-white lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                        {copy.workflow.eyebrow}
                    </p>
                    <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                        {copy.workflow.title}
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-white/66 sm:text-lg">
                        {copy.workflow.subtitle}
                    </p>
                </div>

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 lg:grid-cols-3">
                    {copy.workflow.steps.map((step) => (
                        <article
                            key={step.step}
                            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur"
                        >
                            <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${theme.darkAccent}`}>
                                {step.step}
                            </p>
                            <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-white/68">{step.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function OutputsSection({ copy, locale }: Pick<LandingProps, "copy" | "locale">) {
    const ref = useScrollReveal();

    return (
        <section className="bg-[#f8f7f3] py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                    <div>
                        <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {copy.outputs.eyebrow}
                        </p>
                        <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                            {copy.outputs.title}
                        </h2>

                        <div className="fade-up fade-up-delay-2 mt-8 rounded-[1.6rem] border border-slate-200 bg-white p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {locale === "id" ? "Bundle umum" : "Typical bundle"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {locale === "id"
                                    ? "Biasanya tim tidak butuh semua output sekaligus. Yang dibutuhkan adalah paket hasil yang paling cepat membuka jalur campaign atau produksi konten."
                                    : "Teams usually do not need every output at once. They need the package that opens the next campaign or content production step fastest."}
                            </p>
                        </div>
                    </div>

                    <div className="fade-up fade-up-delay-3 grid gap-4 sm:grid-cols-2">
                        {copy.outputs.items.map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-3 rounded-[1.4rem] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700 shadow-[0_10px_34px_rgba(15,23,42,0.05)]"
                            >
                                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                                    <Check className="h-3.5 w-3.5" />
                                </span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTASection({ copy, locale, theme }: Pick<LandingProps, "copy" | "locale" | "theme">) {
    const ref = useScrollReveal();

    return (
        <section className="bg-white py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="fade-up overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                                {copy.cta.kicker}
                            </p>
                            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                                {copy.cta.title}
                            </h2>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                                {copy.cta.subtitle}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                            <Link
                                href="mailto:plusthesite@gmail.com?subject=AI%20Generator%20Inquiry"
                                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 ${theme.softButton}`}
                            >
                                {copy.cta.primary}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href={`/${locale}#pricing`}
                                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white/86 transition hover:border-white/28 hover:bg-white/10"
                            >
                                {copy.cta.secondary}
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">
                                {locale === "id" ? "Apa yang dibuka dulu" : "What gets unlocked first"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-white/68">
                                {locale === "id"
                                    ? "Diskusi awal biasanya langsung menunjukkan titik lemah di workflow, quality control, dan jalur handoff output generator."
                                    : "The first discussion usually reveals the weak spots in workflow, quality control, and how generated output is handed off."}
                            </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">
                                {locale === "id" ? "Titik masuk umum" : "Common entry point"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-white/68">
                                {locale === "id"
                                    ? "Biasanya tim masuk lewat kebutuhan campaign aktif, workflow aset berulang, atau produksi draft yang sedang macet."
                                    : "Teams usually enter through an active campaign need, a repeated asset workflow, or a draft-production bottleneck."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function AIGeneratorLanding({
    copy,
    locale,
    theme,
    cardIcons,
    systemIcons,
}: LandingProps) {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection copy={copy} theme={theme} locale={locale} />
                <UseCasesSection copy={copy} cardIcons={cardIcons} locale={locale} />
                <SystemSection copy={copy} systemIcons={systemIcons} locale={locale} />
                <WorkflowSection copy={copy} theme={theme} />
                <ProofBand />
                <HowWeWork />
                <OutputsSection copy={copy} locale={locale} />
                <CTASection copy={copy} locale={locale} theme={theme} />
            </main>
            <Footer />
        </>
    );
}
