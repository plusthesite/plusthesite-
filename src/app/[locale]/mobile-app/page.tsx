"use client";

import Link from "next/link";
import {
    ArrowRight,
    BellRing,
    Check,
    Layers3,
    LayoutTemplate,
    Rocket,
    Sparkles,
    Workflow,
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
    readiness: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: { title: string; body: string }[];
    };
    approach: {
        eyebrow: string;
        title: string;
        subtitle: string;
        pillars: { title: string; body: string }[];
    };
    rollout: {
        eyebrow: string;
        title: string;
        subtitle: string;
        steps: { step: string; title: string; body: string }[];
    };
    layers: {
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
            badge: "Cross-platform mobile app delivery",
            title: "Launch mobile apps that feel clear, premium, and ready for real growth from day one.",
            subtitle:
                "plus. designs and ships mobile products with sharper product framing, cleaner UX, and launch discipline across iOS and Android.",
            primaryCta: "Start your app brief",
            secondaryCta: "See delivery flow",
            note: "Best fit for brands that need a real product partner, not just a stack of screens.",
            chips: ["Product framing", "Cross-platform build", "Launch planning", "Post-launch iteration"],
        },
        readiness: {
            eyebrow: "What you get",
            title: "We build mobile apps around business goals, user flow clarity, and launch readiness.",
            subtitle:
                "The service is structured to move from product definition to shipped release without the usual drift between design, engineering, and launch.",
            items: [
                {
                    title: "Sharper product framing",
                    body: "We start from the use case, user path, and business action the app should support so features stay anchored to real outcomes.",
                },
                {
                    title: "Production-ready delivery",
                    body: "Architecture, release planning, QA rhythm, and handoff logic are handled as part of the build, not left until the end.",
                },
                {
                    title: "Cleaner post-launch runway",
                    body: "We design the app to keep evolving after release, with clearer sequencing for future features, fixes, and growth experiments.",
                },
            ],
        },
        approach: {
            eyebrow: "How we build",
            title: "The mobile app workflow balances product sense, fast execution, and maintainable engineering.",
            subtitle:
                "Every phase is built to reduce rework, keep stakeholders aligned, and ship a product that still feels usable after launch week.",
            pillars: [
                {
                    title: "Start from product logic",
                    body: "We frame the jobs, user path, and business outcomes first so the app starts from real decisions, not random feature lists.",
                },
                {
                    title: "Design for maintainable growth",
                    body: "The system is shaped so the app is easier to expand after launch, not just polished for the first demo.",
                },
                {
                    title: "Support launch and iteration",
                    body: "Release prep, analytics handoff, and early iteration are treated as part of delivery from the start.",
                },
            ],
        },
        rollout: {
            eyebrow: "Delivery flow",
            title: "Each app project moves through three deliberate stages.",
            subtitle:
                "This keeps product decisions, build quality, and launch timing connected instead of turning into three separate tracks.",
            steps: [
                {
                    step: "01",
                    title: "Frame the product",
                    body: "Define the right scope, user flow, feature priority, and release target before production expands.",
                },
                {
                    step: "02",
                    title: "Build with discipline",
                    body: "Move through design, engineering, QA, and feedback loops with a cleaner path from concept to working app.",
                },
                {
                    step: "03",
                    title: "Launch and refine",
                    body: "Ship the product with release support, post-launch fixes, and a clearer runway for the next growth cycle.",
                },
            ],
        },
        layers: {
            eyebrow: "What we cover",
            title: "Core layers inside the mobile app offering",
            items: [
                "Product framing and feature prioritization",
                "App interface and interaction design",
                "Cross-platform engineering for iOS and Android",
                "QA, release planning, and handoff structure",
                "Launch sequencing and adoption support",
                "Post-launch iteration and roadmap continuity",
            ],
        },
        cta: {
            title: "If your app idea needs a sharper path from concept to launch, let's map it properly.",
            subtitle:
                "Share your product brief, launch timing, or feature priorities and we can shape the right build path for your team.",
            primary: "Talk to the app team",
            secondary: "View pricing",
        },
    },
    id: {
        hero: {
            badge: "Delivery aplikasi mobile cross-platform",
            title: "Luncurkan aplikasi mobile yang terasa jelas, premium, dan siap tumbuh sejak hari pertama.",
            subtitle:
                "plus. mendesain dan membangun produk mobile dengan framing produk yang lebih tajam, UX yang rapi, dan disiplin launch untuk iOS dan Android.",
            primaryCta: "Mulai brief app Anda",
            secondaryCta: "Lihat alur delivery",
            note: "Paling cocok untuk brand yang butuh partner produk sungguhan, bukan sekadar tukang kirim screen.",
            chips: ["Framing produk", "Build cross-platform", "Perencanaan launch", "Iterasi pasca-launch"],
        },
        readiness: {
            eyebrow: "Yang Anda dapat",
            title: "Kami membangun aplikasi mobile di sekitar tujuan bisnis, kejelasan user flow, dan kesiapan launch.",
            subtitle:
                "Layanan ini disusun untuk bergerak dari definisi produk sampai rilis tanpa drift biasa antara desain, engineering, dan launch.",
            items: [
                {
                    title: "Framing produk lebih tajam",
                    body: "Kami mulai dari use case, alur pengguna, dan aksi bisnis yang harus didukung supaya fitur tetap menempel ke hasil nyata.",
                },
                {
                    title: "Delivery yang siap produksi",
                    body: "Arsitektur, rencana rilis, ritme QA, dan logika handoff ditangani sebagai bagian dari build, bukan ditunda ke akhir.",
                },
                {
                    title: "Runway pasca-launch lebih bersih",
                    body: "App dirancang agar lebih gampang dikembangkan setelah rilis, dengan sequencing yang lebih jelas untuk fitur, perbaikan, dan eksperimen growth.",
                },
            ],
        },
        approach: {
            eyebrow: "Cara kami membangun",
            title: "Workflow mobile app menyeimbangkan sense produk, eksekusi cepat, dan engineering yang tetap terawat.",
            subtitle:
                "Setiap fase dibentuk untuk mengurangi rework, menjaga stakeholder tetap sinkron, dan mengirim produk yang tetap usable setelah minggu launch.",
            pillars: [
                {
                    title: "Mulai dari logika produk",
                    body: "Kami membingkai jobs, alur pengguna, dan hasil bisnis lebih dulu supaya app berangkat dari keputusan nyata, bukan daftar fitur acak.",
                },
                {
                    title: "Desain untuk growth yang tetap terawat",
                    body: "Sistemnya dibentuk agar app lebih mudah dikembangkan setelah launch, bukan cuma rapi saat demo pertama.",
                },
                {
                    title: "Dukung launch dan iterasi",
                    body: "Persiapan rilis, handoff analytics, dan iterasi awal diperlakukan sebagai bagian dari delivery sejak awal.",
                },
            ],
        },
        rollout: {
            eyebrow: "Alur delivery",
            title: "Setiap proyek app bergerak lewat tiga tahap yang sengaja dibentuk.",
            subtitle:
                "Ini menjaga keputusan produk, kualitas build, dan timing launch tetap nyambung, bukan pecah jadi tiga jalur terpisah.",
            steps: [
                {
                    step: "01",
                    title: "Frame produknya",
                    body: "Tentukan scope yang tepat, user flow, prioritas fitur, dan target rilis sebelum produksi melebar.",
                },
                {
                    step: "02",
                    title: "Build dengan disiplin",
                    body: "Jalankan desain, engineering, QA, dan feedback loop dengan jalur yang lebih bersih dari konsep sampai app berjalan.",
                },
                {
                    step: "03",
                    title: "Launch lalu rapikan",
                    body: "Rilis produk dengan dukungan launch, perbaikan awal pasca-rilis, dan runway yang lebih jelas untuk siklus growth berikutnya.",
                },
            ],
        },
        layers: {
            eyebrow: "Yang kami cover",
            title: "Lapisan inti di dalam offer mobile app",
            items: [
                "Framing produk dan prioritas fitur",
                "Desain antarmuka dan interaksi aplikasi",
                "Engineering cross-platform untuk iOS dan Android",
                "QA, perencanaan rilis, dan struktur handoff",
                "Sequencing launch dan dukungan adopsi",
                "Iterasi pasca-launch dan kontinuitas roadmap",
            ],
        },
        cta: {
            title: "Kalau ide app Anda butuh jalur yang lebih tajam dari konsep ke launch, mari petakan dengan benar.",
            subtitle:
                "Kirim brief produk, timing launch, atau prioritas fitur Anda, lalu kami bantu bentuk jalur build yang paling pas untuk tim Anda.",
            primary: "Bicara dengan tim app",
            secondary: "Lihat harga",
        },
    },
};

const READINESS_ICONS = [BellRing, Workflow, Sparkles];
const APPROACH_ICONS = [Layers3, LayoutTemplate, Rocket];

function HeroSection() {
    const locale = useLocale();
    const copy = COPY[locale].hero;
    const summaryCards = [
        {
            label: locale === "id" ? "Delivery view" : "Delivery view",
            value:
                locale === "id"
                    ? "Framing produk, build, dan launch stay connected."
                    : "Product framing, build, and launch stay connected.",
        },
        {
            label: locale === "id" ? "Best fit" : "Best fit",
            value:
                locale === "id"
                    ? "Brand dan tim produk yang butuh partner eksekusi, bukan sekadar vendor screen."
                    : "Brands and product teams that need an execution partner, not just a screen vendor.",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[#171127] pb-24 pt-28 text-white sm:pb-28 lg:pb-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_rgba(196,122,255,0.2),_transparent_30%),radial-gradient(circle_at_82%_18%,_rgba(103,214,255,0.18),_transparent_26%),linear-gradient(180deg,_#171127_0%,_#231a38_100%)]" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-violet-300" />
                            {copy.badge}
                        </div>
                        <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                            {copy.title}
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                            {copy.subtitle}
                        </p>
                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="mailto:plusthesite@gmail.com?subject=Mobile%20App%20Project%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4ecff] px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                            >
                                {copy.primaryCta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href="#readiness"
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
                        <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-violet-300/18 blur-3xl" />
                        <div className="absolute -right-8 bottom-12 h-40 w-40 rounded-full bg-cyan-300/18 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {locale === "id" ? "cakupan delivery" : "delivery scope"}
                                    </p>
                                    <p className="mt-1 text-xs text-white/54">
                                        {locale === "id" ? "produk, build, rilis, iterasi" : "product, build, release, iteration"}
                                    </p>
                                </div>
                                <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                                    {locale === "id" ? "Layanan aktif" : "Active offer"}
                                </span>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                                        {locale === "id" ? "Masalah yang diselesaikan" : "What this line solves"}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-white/78">
                                        {locale === "id"
                                            ? "Kejelasan produk yang lebih baik, delivery cross-platform yang lebih rapi, dan jalur lebih ketat dari ide ke launch."
                                            : "Better product clarity, cleaner cross-platform delivery, and a tighter path from idea to launch."}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-[#f4ecff] p-4 text-slate-900">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                        {locale === "id" ? "Yang termasuk" : "What is included"}
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm leading-6">
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-violet-700" />
                                            {locale === "id" ? "Framing produk dan mapping user flow" : "Product framing and user flow mapping"}
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-violet-700" />
                                            {locale === "id"
                                                ? "Build cross-platform dengan QA dan perencanaan rilis"
                                                : "Cross-platform build with QA and release planning"}
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-violet-700" />
                                            {locale === "id"
                                                ? "Dukungan launch plus runway iterasi awal"
                                                : "Launch support plus early iteration runway"}
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

function ReadinessSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].readiness;
    const locale = useLocale();

    return (
        <section id="readiness" className="bg-[#f7f4fb] py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div className="max-w-3xl">
                        <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {copy.eyebrow}
                        </p>
                        <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                            {copy.title}
                        </h2>
                        <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                            {copy.subtitle}
                        </p>
                    </div>

                    <div className="fade-up fade-up-delay-3 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-950 p-5 text-white">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
                                    {locale === "id" ? "Core tension" : "Core tension"}
                                </p>
                                <p className="mt-4 text-sm leading-7 text-white/78">
                                    {locale === "id"
                                        ? "Masalahnya jarang cuma engineering. Biasanya problem framing, sequencing fitur, dan launch readiness tidak cukup nyambung."
                                        : "The problem is rarely just engineering. It is usually that product framing, feature sequencing, and launch readiness do not stay connected enough."}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {locale === "id" ? "Repair goal" : "Repair goal"}
                                </p>
                                <p className="mt-4 text-sm leading-7 text-slate-600">
                                    {locale === "id"
                                        ? "Membuat jalur dari konsep ke app live terasa lebih jelas, lebih ringan dikelola, dan lebih siap tumbuh."
                                        : "Make the path from concept to a live app clearer, easier to manage, and more ready to grow."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 md:grid-cols-3">
                    {copy.items.map((item, index) => {
                        const Icon = READINESS_ICONS[index];
                        return (
                            <article
                                key={item.title}
                                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ApproachSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].approach;
    const locale = useLocale();

    return (
        <section className="bg-white py-24 lg:py-28">
            <div ref={ref} className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
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
                                ? "Targetnya bukan app yang hanya bagus saat demo. Targetnya adalah produk yang cukup jelas untuk diadopsi, dirilis, dan dilanjutkan setelah launch."
                                : "The goal is not an app that only looks good in a demo. The goal is a product that is clear enough to adopt, release, and continue after launch."}
                        </p>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-3 grid gap-5">
                    {copy.pillars.map((pillar, index) => {
                        const Icon = APPROACH_ICONS[index];
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

function RolloutSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].rollout;

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
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">
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

function LayersSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].layers;
    const locale = useLocale();

    return (
        <section className="bg-[#f7f4fb] py-24 lg:py-28">
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
                                    ? "Sebagian besar tim tidak perlu semua lapisan app sekaligus. Biasanya kami mulai dari framing, build core, dan launch sequence yang paling kritis."
                                    : "Most teams do not need every app layer at once. We usually begin with the framing, core build, and launch sequence that matter most."}
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
                                plus. mobile app
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
                                href="mailto:plusthesite@gmail.com?subject=Mobile%20App%20Project%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4ecff] px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
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
                                ? "Diskusi awal biasanya cukup untuk melihat apakah problem utamanya ada di framing produk, sequencing fitur, atau jalur launch."
                                : "An initial discussion is usually enough to see whether the main issue sits in product framing, feature sequencing, or the launch path."}
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-7 text-white/72">
                            {locale === "id"
                                ? "Kalau tim Anda sudah punya brief dasar, kami bisa langsung masuk ke scope build, user flow, dan release readiness."
                                : "If your team already has a base brief, we can move directly into build scope, user flow, and release readiness."}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function MobileAppPage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <ReadinessSection />
                <ApproachSection />
                <RolloutSection />
                <ProofBand />
                <HowWeWork />
                <LayersSection />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
