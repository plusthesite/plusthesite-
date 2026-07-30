"use client";

import Link from "next/link";
import {
    ArrowRight,
    Bot,
    BrainCircuit,
    Brush,
    Check,
    Layers3,
    Megaphone,
    MonitorSmartphone,
    Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProofBand } from "@/components/ProofBand";
import { HowWeWork } from "@/components/HowWeWork";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/i18n/I18nProvider";

type Locale = "en" | "id";

type PageCopy = {
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        primaryCta: string;
        secondaryCta: string;
        note: string;
        chips: string[];
    };
    offer: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: { title: string; body: string }[];
    };
    system: {
        eyebrow: string;
        title: string;
        subtitle: string;
        pillars: { title: string; body: string }[];
    };
    process: {
        eyebrow: string;
        title: string;
        subtitle: string;
        steps: { step: string; title: string; body: string }[];
    };
    deliverables: {
        eyebrow: string;
        title: string;
        items: string[];
    };
    cta: {
        title: string;
        subtitle: string;
        primary: string;
        secondary: string;
    };
};

const COPY: Record<Locale, PageCopy> = {
    en: {
        hero: {
            badge: "Digital agency for brands that need sharper momentum",
            title: "Strategy, content, and launch systems that make your brand feel current again.",
            subtitle:
                "We help teams clean up their message, tighten their visuals, and turn scattered marketing into a more consistent growth machine.",
            primaryCta: "Book a discovery call",
            secondaryCta: "See what we build",
            note: "Good for lean teams, founders, and operators who need speed without random execution.",
            chips: ["Brand strategy", "Campaign systems", "AI-assisted content", "Web refresh"],
        },
        offer: {
            eyebrow: "What we actually do",
            title: "A digital agency built for teams stuck between rebranding, launching, and daily growth work.",
            subtitle:
                "Not just design files. Not just ads. We connect positioning, creative, and operational follow-through so the work keeps moving after launch day.",
            items: [
                {
                    title: "Positioning and messaging",
                    body: "Clarify what you sell, who it is for, and how the story should sound across pages, campaigns, and sales touchpoints.",
                },
                {
                    title: "Visual systems that stay usable",
                    body: "Refresh the identity, layouts, motion, and asset direction so the brand looks sharper without becoming harder to maintain.",
                },
                {
                    title: "Campaign support with structure",
                    body: "Plan launches, seasonal pushes, promo angles, and content sequences with cleaner decision-making behind them.",
                },
                {
                    title: "AI-enhanced production",
                    body: "Use AI where it speeds up ideation, copy drafting, and workflow handoff, while keeping human taste on the final output.",
                },
            ],
        },
        system: {
            eyebrow: "How the work is shaped",
            title: "The agency layer is not one big deliverable. It is a tighter operating system for your growth work.",
            subtitle:
                "We design for teams that need cleaner coordination between brand, content, product, and execution.",
            pillars: [
                {
                    title: "Brand clarity first",
                    body: "Before making more assets, we align the market story, offer framing, and the tone customers should keep hearing.",
                },
                {
                    title: "Execution that can survive real ops",
                    body: "Landing pages, content themes, and campaign assets are built to be reused by your actual team, not admired once and forgotten.",
                },
                {
                    title: "AI where it removes drag",
                    body: "We use automation and AI support to reduce iteration loops, prep better briefs, and keep handoffs less chaotic.",
                },
            ],
        },
        process: {
            eyebrow: "Process",
            title: "A simple three-part rhythm so decisions happen faster.",
            subtitle:
                "The goal is not more deliverables. The goal is less confusion around what to launch, what to say, and what gets maintained next.",
            steps: [
                {
                    step: "01",
                    title: "Audit the friction",
                    body: "We review the current pages, messaging, social output, and growth bottlenecks to find where the brand feels old, messy, or inconsistent.",
                },
                {
                    step: "02",
                    title: "Refine the system",
                    body: "We shape the positioning, page direction, visual tone, and campaign structure into something the team can actually operate.",
                },
                {
                    step: "03",
                    title: "Ship the next layer",
                    body: "We turn the strategy into launch-ready assets, page updates, content directions, and clearer next actions for your team.",
                },
            ],
        },
        deliverables: {
            eyebrow: "Common outputs",
            title: "Typical deliverables we help teams move forward with",
            items: [
                "Brand messaging framework",
                "Landing page rewrite and redesign",
                "Campaign concept and promo direction",
                "Content themes and social rollout",
                "Creative briefs for internal teams",
                "AI workflow suggestions for faster production",
            ],
        },
        cta: {
            title: "If your brand feels active but not aligned, this is usually the fix.",
            subtitle:
                "We can help you tighten the story, rebuild the launch surface, and make the next marketing push feel deliberate again.",
            primary: "Start the conversation",
            secondary: "View pricing",
        },
    },
    id: {
        hero: {
            badge: "Digital agency untuk brand yang butuh momentum lebih tajam",
            title: "Strategi, konten, dan sistem launch yang bikin brand terasa relevan lagi.",
            subtitle:
                "Kami bantu tim merapikan pesan, mempertajam visual, dan mengubah marketing yang tercecer jadi mesin growth yang lebih konsisten.",
            primaryCta: "Jadwalkan discovery call",
            secondaryCta: "Lihat yang kami bangun",
            note: "Cocok untuk tim lean, founder, dan operator yang butuh gerak cepat tanpa eksekusi acak.",
            chips: ["Strategi brand", "Sistem campaign", "Konten berbantu AI", "Refresh website"],
        },
        offer: {
            eyebrow: "Apa yang benar-benar kami kerjakan",
            title: "Digital agency untuk tim yang nyangkut di antara rebranding, launching, dan growth harian.",
            subtitle:
                "Bukan cuma file desain. Bukan cuma ads. Kami menyambungkan positioning, creative, dan tindak lanjut operasional supaya kerjaan tetap jalan setelah launch.",
            items: [
                {
                    title: "Positioning dan messaging",
                    body: "Memperjelas apa yang Anda jual, untuk siapa, dan bagaimana cerita brand harus terdengar di page, campaign, dan touchpoint sales.",
                },
                {
                    title: "Sistem visual yang tetap usable",
                    body: "Menyegarkan identitas, layout, motion, dan arah aset supaya brand terlihat lebih tajam tanpa jadi susah dirawat.",
                },
                {
                    title: "Support campaign yang lebih terstruktur",
                    body: "Merencanakan launch, seasonal push, promo angle, dan rangkaian konten dengan keputusan yang lebih rapi di belakangnya.",
                },
                {
                    title: "Produksi berbantu AI",
                    body: "Memakai AI saat memang mempercepat ideasi, drafting copy, dan handoff workflow, sambil menjaga taste manusia di hasil akhir.",
                },
            ],
        },
        system: {
            eyebrow: "Cara kerja dibentuk",
            title: "Lapisan agency bukan satu deliverable besar. Ini sistem kerja growth yang lebih rapi.",
            subtitle:
                "Kami mendesain untuk tim yang butuh koordinasi lebih bersih antara brand, konten, produk, dan eksekusi.",
            pillars: [
                {
                    title: "Kejelasan brand dulu",
                    body: "Sebelum bikin aset baru, kami selaraskan cerita pasar, framing offer, dan tone yang harus terus didengar customer.",
                },
                {
                    title: "Eksekusi yang tahan dipakai tim nyata",
                    body: "Landing page, tema konten, dan aset campaign dibangun supaya bisa dipakai ulang tim Anda, bukan cuma dikagumi sekali lalu dilupakan.",
                },
                {
                    title: "AI dipakai saat mengurangi friksi",
                    body: "Kami memakai automation dan AI support untuk memangkas loop revisi, menyiapkan brief lebih baik, dan membuat handoff tidak kacau.",
                },
            ],
        },
        process: {
            eyebrow: "Proses",
            title: "Ritme tiga bagian yang sederhana supaya keputusan lebih cepat jadi.",
            subtitle:
                "Targetnya bukan deliverable lebih banyak. Targetnya lebih sedikit kebingungan soal apa yang diluncurkan, apa yang dikatakan, dan apa yang dirawat berikutnya.",
            steps: [
                {
                    step: "01",
                    title: "Audit titik macet",
                    body: "Kami review page sekarang, messaging, output sosial, dan bottleneck growth untuk melihat bagian mana yang terasa usang, berantakan, atau tidak konsisten.",
                },
                {
                    step: "02",
                    title: "Rapikan sistemnya",
                    body: "Kami bentuk positioning, arah page, tone visual, dan struktur campaign menjadi sesuatu yang benar-benar bisa dijalankan tim.",
                },
                {
                    step: "03",
                    title: "Kirim lapisan berikutnya",
                    body: "Strategi kami ubah menjadi aset siap launch, update page, arah konten, dan next action yang lebih jelas untuk tim Anda.",
                },
            ],
        },
        deliverables: {
            eyebrow: "Output yang umum",
            title: "Deliverable yang biasanya kami bantu gerakkan",
            items: [
                "Framework messaging brand",
                "Rewrite dan redesign landing page",
                "Konsep campaign dan arah promo",
                "Tema konten dan rollout sosial",
                "Creative brief untuk tim internal",
                "Saran workflow AI untuk produksi lebih cepat",
            ],
        },
        cta: {
            title: "Kalau brand terasa aktif tapi belum selaras, biasanya ini titik benahnya.",
            subtitle:
                "Kami bisa bantu merapikan cerita, membangun ulang permukaan launch, dan membuat dorongan marketing berikutnya terasa lebih sengaja.",
            primary: "Mulai percakapannya",
            secondary: "Lihat pricing",
        },
    },
};

const OFFER_ICONS = [BrainCircuit, Brush, Megaphone, Bot];
const PILLAR_ICONS = [Layers3, MonitorSmartphone, Sparkles];

function HeroSection() {
    const locale = useLocale();
    const copy = COPY[locale].hero;
    const summaryCards = [
        {
            label: locale === "id" ? "Growth view" : "Growth view",
            value:
                locale === "id"
                    ? "Brand, campaign, dan launch surface bergerak dalam satu ritme."
                    : "Brand, campaign, and launch surfaces move in one rhythm.",
        },
        {
            label: locale === "id" ? "Best fit" : "Best fit",
            value:
                locale === "id"
                    ? "Tim lean yang butuh arah lebih tajam tanpa menambah kekacauan eksekusi."
                    : "Lean teams that need sharper direction without adding execution chaos.",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[#07111f] pb-24 pt-28 text-white sm:pb-28 lg:pb-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(68,211,255,0.22),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(255,128,98,0.18),_transparent_24%),linear-gradient(180deg,_#07111f_0%,_#0b1830_45%,_#f8f4ec_45%,_#f8f4ec_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-[#5de2c2]" />
                            {copy.badge}
                        </div>

                        <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                            {copy.title}
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                            {copy.subtitle}
                        </p>

                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="mailto:plusthesite@gmail.com?subject=Digital%20Agency%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f7efe2] px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                            >
                                {copy.primaryCta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href="#offer"
                                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white/88 transition hover:border-white/28 hover:bg-white/10"
                            >
                                {copy.secondaryCta}
                            </a>
                        </div>

                        <p className="mt-5 text-sm text-white/56">{copy.note}</p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {copy.chips.map((chip) => (
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
                                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur"
                                >
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/52">
                                        {card.label}
                                    </p>
                                    <p className="mt-4 text-sm font-semibold leading-7 text-white/86">
                                        {card.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-[#54c4ff]/18 blur-3xl" />
                        <div className="absolute -right-8 bottom-10 h-40 w-40 rounded-full bg-[#ff9a6c]/20 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {locale === "id" ? "plus. growth system" : "plus. growth system"}
                                    </p>
                                    <p className="mt-1 text-xs text-white/54">
                                        {locale === "id"
                                            ? "brand, page, content, and launch logic"
                                            : "brand, page, content, and launch logic"}
                                    </p>
                                </div>
                                <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                    {locale === "id" ? "Active" : "Active"}
                                </span>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                                        {locale === "id" ? "Current pain" : "Current pain"}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-white/78">
                                        {locale === "id"
                                            ? "Brand terasa ramai tapi tidak tajam, offer tidak cukup jelas, kualitas page tidak rata, dan campaign masih terlalu bergantung pada tambal sulam menit terakhir."
                                            : "Brand feels busy, offers are unclear, page quality is uneven, and campaigns depend on last-minute manual fixes."}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-[#f7efe2] p-4 text-slate-900">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                        {locale === "id" ? "What we improve" : "What we improve"}
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm leading-6">
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                                            {locale === "id"
                                                ? "Satu cerita pasar yang lebih tajam di site dan campaign."
                                                : "One sharper market story across site and campaign."}
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                                            {locale === "id"
                                                ? "Permukaan launch yang lebih rapi dengan konsistensi visual yang lebih kuat."
                                                : "Cleaner launch surfaces with stronger visual consistency."}
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                                            {locale === "id"
                                                ? "Produksi konten dan promo yang lebih cepat dengan lebih sedikit tebak-tebakan."
                                                : "Faster content and promo production with less guesswork."}
                                        </li>
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

function OfferSection() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const copy = COPY[locale].offer;

    return (
        <section id="offer" className="bg-[#f8f4ec] py-24 text-slate-950 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div className="max-w-3xl">
                        <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {copy.eyebrow}
                        </p>
                        <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                            {copy.title}
                        </h2>
                        <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                            {copy.subtitle}
                        </p>
                    </div>

                    <div className="fade-up fade-up-delay-3 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-950 p-5 text-white">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                                    {locale === "id" ? "Core tension" : "Core tension"}
                                </p>
                                <p className="mt-4 text-sm leading-7 text-white/78">
                                    {locale === "id"
                                        ? "Masalahnya sering bukan kurang output. Masalahnya adalah positioning, visual, dan campaign berjalan tanpa sistem yang sama."
                                        : "The problem is often not a lack of output. It is that positioning, visuals, and campaigns move without the same system."}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {locale === "id" ? "Repair goal" : "Repair goal"}
                                </p>
                                <p className="mt-4 text-sm leading-7 text-slate-600">
                                    {locale === "id"
                                        ? "Membuat brand terasa lebih jelas, lebih sengaja, dan lebih mudah dijalankan oleh tim sehari-hari."
                                        : "Make the brand feel clearer, more deliberate, and easier for the day-to-day team to operate."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 md:grid-cols-2">
                    {copy.items.map((item, index) => {
                        const Icon = OFFER_ICONS[index];
                        return (
                            <article
                                key={item.title}
                                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function SystemSection() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const copy = COPY[locale].system;

    return (
        <section className="bg-white py-24 lg:py-28">
            <div ref={ref} className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                <div>
                    <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {copy.eyebrow}
                    </p>
                    <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                        {copy.title}
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                        {copy.subtitle}
                    </p>

                    <div className="fade-up fade-up-delay-3 mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {locale === "id" ? "Design stance" : "Design stance"}
                        </p>
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                            {locale === "id"
                                ? "Targetnya bukan sekadar campaign yang terlihat sibuk. Targetnya adalah sistem growth yang lebih mudah diarahkan, dipakai ulang, dan dijalankan tim."
                                : "The goal is not just campaigns that look busy. It is a growth system that is easier to direct, reuse, and operate as a team."}
                        </p>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-3 grid gap-5">
                    {copy.pillars.map((pillar, index) => {
                        const Icon = PILLAR_ICONS[index];
                        return (
                            <div
                                key={pillar.title}
                                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(15,23,42,0.06)] sm:p-7"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-950">{pillar.title}</h3>
                                        <p className="mt-2 text-sm leading-7 text-slate-600">{pillar.body}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ProcessSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].process;

    return (
        <section className="bg-slate-950 py-24 text-white lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                        {copy.eyebrow}
                    </p>
                    <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                        {copy.title}
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-white/66 sm:text-lg">
                        {copy.subtitle}
                    </p>
                </div>

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 lg:grid-cols-3">
                    {copy.steps.map((step) => (
                        <article
                            key={step.step}
                            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur"
                        >
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7cd8ff]">
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

function DeliverablesSection() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const copy = COPY[locale].deliverables;

    return (
        <section className="bg-[#f8f4ec] py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                    <div>
                        <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {copy.eyebrow}
                        </p>
                        <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                            {copy.title}
                        </h2>

                        <div className="fade-up fade-up-delay-2 mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                {locale === "id" ? "Typical bundle" : "Typical bundle"}
                            </p>
                            <p className="mt-4 text-sm leading-7 text-slate-600">
                                {locale === "id"
                                    ? "Sebagian besar tim tidak membutuhkan seluruh lapisan agency sekaligus. Biasanya kami mulai dari cerita, permukaan launch, lalu konten dan campaign yang paling dekat ke hasil."
                                    : "Most teams do not need every agency layer at once. We usually begin with the story, the launch surface, then the content and campaigns closest to outcomes."}
                            </p>
                        </div>
                    </div>

                    <div className="fade-up fade-up-delay-2 grid gap-4 sm:grid-cols-2">
                        {copy.items.map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-3 rounded-[1.4rem] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
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

function CTASection() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const copy = COPY[locale].cta;

    return (
        <section className="bg-white py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="fade-up overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                                plus. digital agency
                            </p>
                            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                                {copy.title}
                            </h2>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                                {copy.subtitle}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                            <Link
                                href="mailto:plusthesite@gmail.com?subject=Digital%20Agency%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f7efe2] px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                            >
                                {copy.primary}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href={`/${locale}#pricing`}
                                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white/86 transition hover:border-white/28 hover:bg-white/10"
                            >
                                {copy.secondary}
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-7 text-white/72">
                            {locale === "id"
                                ? "Diskusi awal biasanya cukup untuk melihat apakah masalah terbesarnya ada di positioning, kualitas page, atau ritme campaign yang tidak sinkron."
                                : "An initial discussion is usually enough to see whether the main issue sits in positioning, page quality, or an unsynced campaign rhythm."}
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-7 text-white/72">
                            {locale === "id"
                                ? "Kalau tim Anda sudah bergerak aktif, kami bisa masuk lewat lapisan yang paling mengganggu momentum: story, launch surface, atau content system."
                                : "If your team is already active, we can enter through the layer hurting momentum most: story, launch surface, or the content system."}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function DigitalAgencyPage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <OfferSection />
                <SystemSection />
                <ProcessSection />
                <ProofBand />
                <HowWeWork />
                <DeliverablesSection />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
