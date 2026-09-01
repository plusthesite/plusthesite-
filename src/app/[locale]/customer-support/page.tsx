"use client";

import Link from "next/link";
import {
    ArrowRight,
    BookOpenText,
    Bot,
    Check,
    Clock3,
    Headphones,
    MessageSquareReply,
    MessagesSquare,
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
    friction: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: { title: string; body: string }[];
    };
    model: {
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
            badge: "Customer support designed for response quality and calmer operations",
            title: "Support workflows that reply faster, escalate cleaner, and reduce the strain on your team.",
            subtitle:
                "We help businesses organize support across chat, operators, and knowledge flows so customers get clearer answers and the internal team stops firefighting every hour.",
            primaryCta: "Talk about support ops",
            secondaryCta: "See support flow",
            note: "Useful for brands, service teams, and operators who need consistency without sounding robotic.",
            chips: ["First response flow", "Escalation logic", "Knowledge support", "AI-assisted replies"],
        },
        friction: {
            eyebrow: "What usually breaks",
            title: "Support starts falling apart when message volume rises, context disappears, and escalation stays manual.",
            subtitle:
                "The biggest problem is rarely one bad agent. It is a weak system that makes fast, useful, and consistent support hard to sustain.",
            items: [
                {
                    title: "Response quality becomes uneven",
                    body: "Different operators answer with different standards, which makes the customer experience feel inconsistent and harder to trust.",
                },
                {
                    title: "Urgent cases do not stand out early enough",
                    body: "When every message looks the same, complaints, payment issues, and sensitive requests get delayed longer than they should.",
                },
                {
                    title: "Knowledge lives in too many places",
                    body: "Policies, pricing, product notes, and exceptions become hard to retrieve quickly, especially when the team is under pressure.",
                },
                {
                    title: "Escalation drains the team",
                    body: "Without cleaner handoff notes and routing rules, senior operators keep re-reading the same context before they can act.",
                },
            ],
        },
        model: {
            eyebrow: "Support model",
            title: "The workflow combines response discipline, better routing, and smarter use of support knowledge.",
            subtitle:
                "The system is meant to help operators move faster while still sounding calm, human, and aligned with the business.",
            pillars: [
                {
                    title: "Guide first-response quality",
                    body: "Set clearer answer patterns for common questions, support tone, and when to ask the next useful question instead of sending generic text.",
                },
                {
                    title: "Route by urgency and intent",
                    body: "Separate routine questions from edge cases, payment issues, and trust-heavy conversations so the right person sees them sooner.",
                },
                {
                    title: "Use AI as support, not disguise",
                    body: "AI can prepare drafts, classify messages, and assist retrieval while human operators stay in control of sensitive moments.",
                },
            ],
        },
        process: {
            eyebrow: "Workflow",
            title: "A cleaner path from incoming message to final resolution.",
            subtitle:
                "The goal is to shorten the time between receiving a message and making the right next move, without turning support into a script factory.",
            steps: [
                {
                    step: "01",
                    title: "Classify and triage",
                    body: "Messages are grouped by intent, urgency, and ownership so the team can stop treating every ticket like the same kind of problem.",
                },
                {
                    step: "02",
                    title: "Reply with context",
                    body: "Operators or AI-assisted drafts pull from knowledge, account context, and prior conversation history to give tighter answers.",
                },
                {
                    step: "03",
                    title: "Escalate without losing time",
                    body: "When a case needs deeper handling, the handoff carries the right notes and decision trail so the next operator can act immediately.",
                },
            ],
        },
        layers: {
            eyebrow: "Typical support layers",
            title: "What teams usually want inside the support setup",
            items: [
                "FAQ and support reply framework",
                "Urgency and escalation rules",
                "Operator handoff structure",
                "Knowledge retrieval support",
                "AI-assisted draft replies",
                "Basic visibility into support patterns",
            ],
        },
        cta: {
            title: "If support feels busy all day but still leaves customers waiting, this is usually the real bottleneck.",
            subtitle:
                "We can help you shape a support flow that is faster to run, easier to manage, and more consistent under pressure.",
            primary: "Start the support discussion",
            secondary: "View pricing",
        },
    },
    id: {
        hero: {
            badge: "Customer support yang dibentuk untuk kualitas respons dan operasi yang lebih tenang",
            title: "Workflow support yang membalas lebih cepat, mengeskalasi lebih rapi, dan mengurangi beban tim Anda.",
            subtitle:
                "Kami bantu bisnis merapikan support di chat, operator, dan alur knowledge supaya pelanggan mendapat jawaban lebih jelas dan tim internal berhenti terus-menerus memadamkan api.",
            primaryCta: "Bahas support ops",
            secondaryCta: "Lihat alur support",
            note: "Cocok untuk brand, tim layanan, dan operator yang butuh konsistensi tanpa terdengar robotik.",
            chips: ["First response flow", "Logika eskalasi", "Dukungan knowledge", "Balasan berbantu AI"],
        },
        friction: {
            eyebrow: "Yang biasanya rusak",
            title: "Support mulai berantakan saat volume pesan naik, konteks hilang, dan eskalasi tetap manual.",
            subtitle:
                "Masalah terbesarnya jarang satu agent yang buruk. Biasanya sistemnya lemah, jadi support yang cepat, berguna, dan konsisten sulit dipertahankan.",
            items: [
                {
                    title: "Kualitas respons jadi tidak rata",
                    body: "Operator berbeda menjawab dengan standar berbeda, sehingga pengalaman pelanggan terasa tidak konsisten dan makin sulit dipercaya.",
                },
                {
                    title: "Kasus mendesak tidak menonjol cukup cepat",
                    body: "Saat semua pesan terlihat sama, komplain, masalah pembayaran, dan permintaan sensitif jadi terlambat ditangani.",
                },
                {
                    title: "Knowledge tinggal di terlalu banyak tempat",
                    body: "Kebijakan, harga, catatan produk, dan pengecualian jadi sulit diambil cepat, apalagi saat tim sedang ditekan volume.",
                },
                {
                    title: "Eskalasi menguras tim",
                    body: "Tanpa catatan handoff dan aturan routing yang lebih rapi, operator senior harus membaca ulang konteks yang sama sebelum bisa bergerak.",
                },
            ],
        },
        model: {
            eyebrow: "Model support",
            title: "Workflow ini menggabungkan disiplin respons, routing yang lebih baik, dan pemakaian knowledge support yang lebih cerdas.",
            subtitle:
                "Sistemnya ditujukan untuk membantu operator bergerak lebih cepat sambil tetap terdengar tenang, manusiawi, dan selaras dengan bisnis.",
            pillars: [
                {
                    title: "Arahkan kualitas respons pertama",
                    body: "Tetapkan pola jawaban yang lebih jelas untuk pertanyaan umum, tone support, dan kapan harus mengajukan pertanyaan berikutnya ketimbang mengirim teks generik.",
                },
                {
                    title: "Routing berdasarkan urgensi dan intent",
                    body: "Pisahkan pertanyaan rutin dari edge case, masalah pembayaran, dan percakapan yang butuh trust tinggi supaya orang yang tepat melihatnya lebih cepat.",
                },
                {
                    title: "Gunakan AI sebagai pendukung, bukan penyamaran",
                    body: "AI bisa menyiapkan draft, mengklasifikasikan pesan, dan membantu retrieval sementara operator manusia tetap memegang momen sensitif.",
                },
            ],
        },
        process: {
            eyebrow: "Workflow",
            title: "Jalur yang lebih bersih dari pesan masuk sampai resolusi akhir.",
            subtitle:
                "Tujuannya memendekkan waktu antara pesan diterima dan langkah benar berikutnya, tanpa mengubah support menjadi pabrik script.",
            steps: [
                {
                    step: "01",
                    title: "Klasifikasi dan triage",
                    body: "Pesan dikelompokkan berdasarkan intent, urgensi, dan ownership supaya tim berhenti memperlakukan semua tiket sebagai masalah yang sama.",
                },
                {
                    step: "02",
                    title: "Balas dengan konteks",
                    body: "Operator atau draft berbantu AI mengambil dari knowledge, konteks akun, dan histori percakapan sebelumnya untuk memberi jawaban yang lebih rapat.",
                },
                {
                    step: "03",
                    title: "Eskalasi tanpa buang waktu",
                    body: "Saat kasus butuh penanganan lebih dalam, handoff membawa catatan dan jejak keputusan yang tepat supaya operator berikutnya bisa langsung bergerak.",
                },
            ],
        },
        layers: {
            eyebrow: "Lapisan support umum",
            title: "Yang biasanya tim butuhkan di dalam setup support",
            items: [
                "Framework FAQ dan balasan support",
                "Aturan urgensi dan eskalasi",
                "Struktur handoff antar operator",
                "Dukungan retrieval knowledge",
                "Draft balasan berbantu AI",
                "Visibilitas dasar ke pola support",
            ],
        },
        cta: {
            title: "Kalau support terasa sibuk sepanjang hari tapi pelanggan tetap menunggu, biasanya ini bottleneck aslinya.",
            subtitle:
                "Kami bisa bantu membentuk alur support yang lebih cepat dijalankan, lebih mudah dikelola, dan lebih konsisten saat tekanan naik.",
            primary: "Mulai diskusi support",
            secondary: "Lihat pricing",
        },
    },
};

const FRICTION_ICONS = [MessageSquareReply, Clock3, BookOpenText, Headphones];
const MODEL_ICONS = [MessagesSquare, Workflow, Bot];

function HeroSection() {
    const locale = useLocale();
    const copy = COPY[locale].hero;
    const summaryCards = [
        {
            label: locale === "id" ? "Response mode" : "Response mode",
            value:
                locale === "id"
                    ? "Triage, knowledge, dan handoff bergerak dalam satu alur."
                    : "Triage, knowledge, and handoff move inside one flow.",
        },
        {
            label: locale === "id" ? "Best fit" : "Best fit",
            value:
                locale === "id"
                    ? "Brand dan service team yang ingin support tetap tenang saat volume naik."
                    : "Brands and service teams that want support to stay calm as volume rises.",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[#11161f] pb-24 pt-28 text-white sm:pb-28 lg:pb-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,_rgba(110,170,255,0.18),_transparent_28%),radial-gradient(circle_at_82%_16%,_rgba(86,215,201,0.18),_transparent_26%),linear-gradient(180deg,_#11161f_0%,_#1b2330_100%)]" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-cyan-300" />
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
                                href="mailto:plusthesite@gmail.com?subject=Customer%20Support%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#edf4ff] px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                            >
                                {copy.primaryCta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href="#friction"
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
                        <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-cyan-300/18 blur-3xl" />
                        <div className="absolute -right-8 bottom-12 h-40 w-40 rounded-full bg-teal-300/18 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {locale === "id" ? "support routing" : "support routing"}
                                    </p>
                                    <p className="mt-1 text-xs text-white/54">
                                        {locale === "id"
                                            ? "triage, knowledge, handoff, resolution"
                                            : "triage, knowledge, handoff, resolution"}
                                    </p>
                                </div>
                                <span className="rounded-full bg-cyan-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                                    {locale === "id" ? "Stable" : "Stable"}
                                </span>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                                        {locale === "id" ? "Current support pain" : "Current support pain"}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-white/78">
                                        {locale === "id"
                                            ? "Volume naik, konteks tenggelam, dan operator senior terlalu sering menyelamatkan percakapan yang seharusnya sudah diroute lebih baik sejak awal."
                                            : "Volume rises, context gets buried, and senior staff spend too much time rescuing conversations that should have been routed better."}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-[#edf4ff] p-4 text-slate-900">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                        {locale === "id" ? "What improves" : "What improves"}
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm leading-6">
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-cyan-700" />
                                            {locale === "id"
                                                ? "First response lebih cepat dengan pola jawaban yang lebih jelas."
                                                : "Faster first response with clearer answer patterns."}
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-cyan-700" />
                                            {locale === "id"
                                                ? "Sinyal yang lebih jelas untuk kasus urgent dan trust-heavy."
                                                : "Better signal for urgent and trust-heavy cases."}
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-cyan-700" />
                                            {locale === "id"
                                                ? "Handoff operator lebih bersih dengan lebih sedikit baca ulang."
                                                : "Cleaner operator handoff with less rereading."}
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

function FrictionSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].friction;
    const locale = useLocale();

    return (
        <section id="friction" className="bg-[#f4f6fb] py-24 lg:py-28">
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
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                                    {locale === "id" ? "Core tension" : "Core tension"}
                                </p>
                                <p className="mt-4 text-sm leading-7 text-white/78">
                                    {locale === "id"
                                        ? "Masalahnya sering bukan kurang orang. Masalahnya adalah routing, knowledge, dan ownership tidak cukup jelas saat tekanan naik."
                                        : "The problem is often not a lack of people. It is that routing, knowledge, and ownership are not clear enough when pressure rises."}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {locale === "id" ? "Repair goal" : "Repair goal"}
                                </p>
                                <p className="mt-4 text-sm leading-7 text-slate-600">
                                    {locale === "id"
                                        ? "Membuat support lebih cepat dibaca, lebih mudah dioperasikan, dan lebih konsisten di bawah volume."
                                        : "Make support faster to read, easier to operate, and more consistent under volume."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 md:grid-cols-2">
                    {copy.items.map((item, index) => {
                        const Icon = FRICTION_ICONS[index];
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

function ModelSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].model;
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
                                ? "Targetnya bukan membuat support terasa otomatis. Targetnya adalah membuat operator lebih siap, lebih cepat, dan lebih konsisten saat menjawab."
                                : "The goal is not to make support feel automated. The goal is to make operators more prepared, faster, and more consistent when they respond."}
                        </p>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-3 grid gap-5">
                    {copy.pillars.map((pillar, index) => {
                        const Icon = MODEL_ICONS[index];
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
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
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
        <section className="bg-[#f4f6fb] py-24 lg:py-28">
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
                                    ? "Tidak semua tim membutuhkan seluruh lapisan support sekaligus. Biasanya kami mulai dari triage, knowledge, dan handoff yang paling membuat operasi berat."
                                    : "Not every team needs every support layer at once. We usually begin with the triage, knowledge, and handoff points that make operations feel heaviest."}
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
                                plus. customer support
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
                                href="mailto:plusthesite@gmail.com?subject=Customer%20Support%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#edf4ff] px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
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
                                ? "Diskusi awal biasanya cukup untuk menemukan pola support yang paling sering membuat tim lambat, bingung, atau bolak-balik."
                                : "An initial discussion is usually enough to find the support patterns that make the team slow, uncertain, or repeatedly backtrack."}
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-7 text-white/72">
                            {locale === "id"
                                ? "Kalau sistem dasar sudah ada, kami bisa masuk lewat quality guardrail, escalation logic, atau support knowledge flow."
                                : "If the basic system already exists, we can enter through quality guardrails, escalation logic, or the support knowledge flow."}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function CustomerSupportPage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <FrictionSection />
                <ModelSection />
                <ProcessSection />
                <ProofBand />
                <HowWeWork />
                <LayersSection />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
