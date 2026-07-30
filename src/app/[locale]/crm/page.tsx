"use client";

import Link from "next/link";
import {
    ArrowRight,
    BadgeDollarSign,
    Check,
    ClipboardList,
    Filter,
    KanbanSquare,
    MailCheck,
    UserRoundSearch,
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
    problems: {
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
    workflow: {
        eyebrow: string;
        title: string;
        subtitle: string;
        steps: { step: string; title: string; body: string }[];
    };
    outputs: {
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
            badge: "CRM for teams that want cleaner revenue operations",
            title: "One place to track leads, follow-ups, deal health, and next actions without the usual sales mess.",
            subtitle:
                "We help teams replace scattered spreadsheets, forgotten chats, and weak pipeline visibility with a CRM workflow that is easier to trust every day.",
            primaryCta: "Discuss your CRM flow",
            secondaryCta: "See how it works",
            note: "Useful for founders, sales operators, and growing teams that need more control without heavyweight process.",
            chips: ["Lead capture", "Pipeline visibility", "Follow-up flow", "Revenue ops"],
        },
        problems: {
            eyebrow: "What it fixes",
            title: "Most CRM problems are not about missing features. They come from weak discipline, broken visibility, and scattered follow-up.",
            subtitle:
                "The system is shaped around the real friction teams keep hitting when deals move across chat, forms, email, and operator handoff.",
            items: [
                {
                    title: "Lead context stops disappearing",
                    body: "Every inquiry can carry source, intent, urgency, and next-step notes so the team is not guessing what happened before.",
                },
                {
                    title: "The pipeline becomes readable",
                    body: "Stages, deal health, stalled opportunities, and ownership stay visible enough for operators to actually manage the flow.",
                },
                {
                    title: "Follow-up becomes a system",
                    body: "Instead of relying on memory, the CRM helps the team run reminders, status checks, and handoff actions with less drop-off.",
                },
                {
                    title: "Sales and marketing stop drifting apart",
                    body: "Leads, campaign sources, and conversion outcomes stay connected so the business can see what is working and what is noisy.",
                },
            ],
        },
        system: {
            eyebrow: "System design",
            title: "Built around lead movement, operator clarity, and the next best action.",
            subtitle:
                "The point is not to make a giant dashboard. The point is to help the team know who needs attention, what is blocked, and what should happen next.",
            pillars: [
                {
                    title: "Capture cleaner lead signals",
                    body: "Forms, chat, source channels, and qualification fields are shaped to make the first record useful, not just stored.",
                },
                {
                    title: "Make pipeline health visible",
                    body: "We keep stage logic, ownership, priorities, and aging signals readable enough for day-to-day operational decisions.",
                },
                {
                    title: "Trigger useful follow-up actions",
                    body: "Notifications, reminders, and workflows help the team move faster without losing the human judgment that actually closes deals.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "A simple path from inquiry to active deal management.",
            subtitle:
                "This is designed to reduce the operational drag between receiving a lead and knowing whether it is alive, stuck, or ready to close.",
            steps: [
                {
                    step: "01",
                    title: "Collect and qualify",
                    body: "The lead enters with source, intent, owner, and enough context to tell whether the opportunity is worth moving now.",
                },
                {
                    step: "02",
                    title: "Manage the pipeline",
                    body: "Operators can review stage movement, next tasks, stale deals, and team load without piecing the story together manually.",
                },
                {
                    step: "03",
                    title: "Close the loop",
                    body: "Follow-ups, deal outcomes, and conversion signals feed back into the operating picture so future decisions get sharper.",
                },
            ],
        },
        outputs: {
            eyebrow: "Common layers",
            title: "What teams usually want inside the CRM setup",
            items: [
                "Lead intake and qualification structure",
                "Pipeline stages and opportunity tracking",
                "Task, reminder, and follow-up logic",
                "Source tracking for campaign attribution",
                "Operator-friendly deal views",
                "Basic analytics for pipeline movement",
            ],
        },
        cta: {
            title: "If your pipeline exists but nobody fully trusts it, this is usually the repair point.",
            subtitle:
                "We can help you build a CRM flow that feels lighter to run, clearer to read, and more reliable when deals start stacking up.",
            primary: "Start the CRM discussion",
            secondary: "View pricing",
        },
    },
    id: {
        hero: {
            badge: "CRM untuk tim yang ingin revenue operations lebih rapi",
            title: "Satu tempat untuk melacak lead, follow-up, kesehatan deal, dan next action tanpa kekacauan sales yang biasa.",
            subtitle:
                "Kami bantu tim mengganti spreadsheet yang tercecer, chat yang kelupaan, dan visibilitas pipeline yang lemah dengan workflow CRM yang lebih mudah dipercaya setiap hari.",
            primaryCta: "Bahas alur CRM Anda",
            secondaryCta: "Lihat cara kerjanya",
            note: "Cocok untuk founder, operator sales, dan tim bertumbuh yang butuh kontrol lebih tanpa proses yang terlalu berat.",
            chips: ["Lead capture", "Visibilitas pipeline", "Alur follow-up", "Revenue ops"],
        },
        problems: {
            eyebrow: "Yang dibenahi",
            title: "Masalah CRM biasanya bukan soal kurang fitur. Biasanya soal disiplin lemah, visibilitas pecah, dan follow-up yang tercecer.",
            subtitle:
                "Sistem ini dibentuk dari friksi nyata yang sering muncul saat deal berpindah di antara chat, form, email, dan handoff operator.",
            items: [
                {
                    title: "Konteks lead tidak lagi hilang",
                    body: "Setiap inquiry bisa membawa source, intent, urgency, dan catatan next step supaya tim tidak menebak-nebak apa yang sudah terjadi.",
                },
                {
                    title: "Pipeline jadi terbaca",
                    body: "Stage, kesehatan deal, peluang yang macet, dan ownership tetap terlihat sehingga operator benar-benar bisa mengelola alurnya.",
                },
                {
                    title: "Follow-up jadi sistem",
                    body: "Alih-alih mengandalkan ingatan, CRM membantu tim menjalankan reminder, cek status, dan tindakan handoff dengan drop-off yang lebih kecil.",
                },
                {
                    title: "Sales dan marketing berhenti jalan sendiri-sendiri",
                    body: "Lead, source campaign, dan hasil konversi tetap terhubung supaya bisnis bisa melihat mana yang bekerja dan mana yang cuma ramai.",
                },
            ],
        },
        system: {
            eyebrow: "Desain sistem",
            title: "Dibangun di sekitar pergerakan lead, kejelasan operator, dan next best action.",
            subtitle:
                "Targetnya bukan membuat dashboard raksasa. Targetnya membantu tim tahu siapa yang perlu perhatian, apa yang macet, dan apa yang harus terjadi berikutnya.",
            pillars: [
                {
                    title: "Tangkap sinyal lead lebih bersih",
                    body: "Form, chat, source channel, dan field kualifikasi dibentuk supaya record pertama langsung berguna, bukan cuma tersimpan.",
                },
                {
                    title: "Buat kesehatan pipeline terlihat",
                    body: "Kami menjaga logika stage, ownership, prioritas, dan aging signal tetap terbaca untuk keputusan operasional harian.",
                },
                {
                    title: "Picu tindakan follow-up yang berguna",
                    body: "Notifikasi, reminder, dan workflow membantu tim bergerak lebih cepat tanpa menghilangkan penilaian manusia yang benar-benar menutup deal.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "Jalur sederhana dari inquiry ke pengelolaan deal aktif.",
            subtitle:
                "Ini dirancang untuk mengurangi beban operasional antara lead masuk dan keputusan apakah ia hidup, macet, atau siap ditutup.",
            steps: [
                {
                    step: "01",
                    title: "Kumpulkan dan kualifikasi",
                    body: "Lead masuk dengan source, intent, owner, dan konteks yang cukup untuk melihat apakah peluang ini memang layak digerakkan sekarang.",
                },
                {
                    step: "02",
                    title: "Kelola pipeline",
                    body: "Operator bisa meninjau perpindahan stage, tugas berikutnya, deal yang mulai stale, dan beban tim tanpa menyusun ceritanya manual.",
                },
                {
                    step: "03",
                    title: "Tutup loop-nya",
                    body: "Follow-up, outcome deal, dan sinyal konversi masuk lagi ke gambaran operasional supaya keputusan berikutnya makin tajam.",
                },
            ],
        },
        outputs: {
            eyebrow: "Lapisan umum",
            title: "Hal yang biasanya tim butuhkan di dalam setup CRM",
            items: [
                "Struktur intake dan kualifikasi lead",
                "Stage pipeline dan tracking opportunity",
                "Logika task, reminder, dan follow-up",
                "Pelacakan source untuk atribusi campaign",
                "Deal view yang ramah operator",
                "Analitik dasar untuk pergerakan pipeline",
            ],
        },
        cta: {
            title: "Kalau pipeline Anda ada tapi belum benar-benar dipercaya tim, biasanya ini titik perbaikannya.",
            subtitle:
                "Kami bisa bantu membangun alur CRM yang lebih ringan dijalankan, lebih jelas dibaca, dan lebih andal saat deal mulai menumpuk.",
            primary: "Mulai diskusi CRM",
            secondary: "Lihat pricing",
        },
    },
};

const PROBLEM_ICONS = [UserRoundSearch, KanbanSquare, MailCheck, BadgeDollarSign];
const PILLAR_ICONS = [ClipboardList, Filter, Workflow];

function HeroSection() {
    const copy = COPY[useLocale()].hero;

    return (
        <section className="relative overflow-hidden bg-[#071b1b] pb-24 pt-28 text-white sm:pb-28 lg:pb-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_rgba(39,212,168,0.22),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(44,182,255,0.18),_transparent_26%),linear-gradient(180deg,_#071b1b_0%,_#0d2a29_46%,_#f2f7f6_46%,_#f2f7f6_100%)]" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-emerald-300" />
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
                                href="mailto:plusthesite@gmail.com?subject=CRM%20Platform%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f1f6ea] px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                            >
                                {copy.primaryCta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href="#problems"
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
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-emerald-300/18 blur-3xl" />
                        <div className="absolute -right-8 bottom-12 h-40 w-40 rounded-full bg-cyan-300/18 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">pipeline control</p>
                                    <p className="mt-1 text-xs text-white/54">lead, owner, next action, close signal</p>
                                </div>
                                <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                    Synced
                                </span>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/42">What teams lose today</p>
                                    <p className="mt-2 text-sm leading-6 text-white/78">
                                        Deal notes disappear in chat, follow-ups depend on memory, and nobody is sure which lead is quietly dying.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-[#f1f6ea] p-4 text-slate-900">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What improves</p>
                                    <ul className="mt-3 space-y-2 text-sm leading-6">
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                                            Lead source, owner, and urgency stay visible.
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                                            Stalled deals become easier to catch early.
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                                            Follow-up moves from memory into workflow.
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

function ProblemsSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].problems;

    return (
        <section id="problems" className="bg-[#f2f7f6] py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
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

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 md:grid-cols-2">
                    {copy.items.map((item, index) => {
                        const Icon = PROBLEM_ICONS[index];
                        return (
                            <article
                                key={item.title}
                                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
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

function SystemSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].system;

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
                </div>

                <div className="fade-up fade-up-delay-3 grid gap-5">
                    {copy.pillars.map((pillar, index) => {
                        const Icon = PILLAR_ICONS[index];
                        return (
                            <div
                                key={pillar.title}
                                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 sm:p-7"
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

function WorkflowSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].workflow;

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
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
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

function OutputsSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].outputs;

    return (
        <section className="bg-[#f2f7f6] py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                    <div>
                        <p className="fade-up text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {copy.eyebrow}
                        </p>
                        <h2 className="fade-up fade-up-delay-1 mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                            {copy.title}
                        </h2>
                    </div>

                    <div className="fade-up fade-up-delay-2 grid gap-4 sm:grid-cols-2">
                        {copy.items.map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-3 rounded-[1.4rem] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700"
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
                                plus. crm platform
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
                                href="mailto:plusthesite@gmail.com?subject=CRM%20Platform%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f1f6ea] px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
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
                </div>
            </div>
        </section>
    );
}

export default function CRMPage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <ProblemsSection />
                <SystemSection />
                <WorkflowSection />
                <ProofBand />
                <HowWeWork />
                <OutputsSection />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
