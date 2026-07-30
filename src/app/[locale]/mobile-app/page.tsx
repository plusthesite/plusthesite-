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
            badge: "Mobile app development coming soon",
            title: "A cleaner mobile app offering is on the way, shaped around product clarity, launch readiness, and maintainable growth.",
            subtitle:
                "We are preparing the mobile app line to focus on product framing, production discipline, and launch systems instead of just shipping screens fast.",
            primaryCta: "Join the waitlist",
            secondaryCta: "See the rollout direction",
            note: "This service line is being prepared carefully so the offer is tighter before we fully open delivery.",
            chips: ["Product framing", "App workflow", "Launch planning", "Future-ready systems"],
        },
        readiness: {
            eyebrow: "Why wait",
            title: "We would rather open this service properly than launch a vague offer too early.",
            subtitle:
                "The goal is to make the mobile app line feel more serious from day one, with better scope discipline and clearer product thinking.",
            items: [
                {
                    title: "Stronger product framing",
                    body: "We want the service to start with sharper thinking about use case, user flow, and the business action the app should support.",
                },
                {
                    title: "Better production readiness",
                    body: "Architecture, release planning, handoff logic, and lifecycle support should be considered before the service is sold wide.",
                },
                {
                    title: "Less generic delivery",
                    body: "The point is to avoid the usual promise of beautiful apps without enough structure behind how the product will survive launch.",
                },
            ],
        },
        approach: {
            eyebrow: "Planned approach",
            title: "The future app offering is being shaped around product sense, operator usefulness, and real release discipline.",
            subtitle:
                "We are building this service to help businesses move from idea to usable mobile product with better clarity across the whole delivery path.",
            pillars: [
                {
                    title: "Start from product logic",
                    body: "We plan to frame the jobs, user path, and business outcomes first so the app is anchored in clearer decisions from the start.",
                },
                {
                    title: "Design for maintainable growth",
                    body: "The app should be easier to evolve after launch, not just impressive during the first handoff presentation.",
                },
                {
                    title: "Support launch and iteration",
                    body: "Release prep, post-launch adjustments, and feedback loops should be part of the service story from the beginning.",
                },
            ],
        },
        rollout: {
            eyebrow: "Rollout direction",
            title: "The service line is being prepared in three layers.",
            subtitle:
                "This helps us avoid opening too broad a promise before the offer has the right depth behind it.",
            steps: [
                {
                    step: "01",
                    title: "Clarify the offer",
                    body: "Define the right fit, delivery scope, and product categories this service should actually handle well.",
                },
                {
                    step: "02",
                    title: "Tighten the workflow",
                    body: "Prepare the design, engineering, QA, and launch path so delivery feels deliberate instead of improvised.",
                },
                {
                    step: "03",
                    title: "Open with a stronger system",
                    body: "Launch the service line when the process, positioning, and customer path are ready to hold real projects cleanly.",
                },
            ],
        },
        layers: {
            eyebrow: "What it is being built for",
            title: "Areas the future mobile app offering is expected to cover",
            items: [
                "Product framing and user flow direction",
                "App interface and interaction design",
                "Delivery planning across release milestones",
                "Feature structure and launch sequencing",
                "Post-launch iteration support",
                "Longer-term operational readiness",
            ],
        },
        cta: {
            title: "If you want early access when this service opens, we can keep you in the loop.",
            subtitle:
                "Reach out with your product idea or rollout timing, and we can point you to the right current service or note your interest for the mobile app launch.",
            primary: "Notify me",
            secondary: "Explore active services",
        },
    },
    id: {
        hero: {
            badge: "Pengembangan aplikasi mobile segera hadir",
            title: "Lini mobile app yang lebih rapi sedang disiapkan, dengan fokus pada kejelasan produk, kesiapan launch, dan growth yang tetap terawat.",
            subtitle:
                "Kami sedang menyiapkan lini mobile app agar fokus pada framing produk, disiplin produksi, dan sistem launch, bukan sekadar cepat mengirim screen.",
            primaryCta: "Masuk waitlist",
            secondaryCta: "Lihat arah rollout",
            note: "Layanan ini sedang disiapkan dengan hati-hati supaya offer-nya lebih rapat sebelum delivery dibuka penuh.",
            chips: ["Framing produk", "Workflow app", "Perencanaan launch", "Sistem siap berkembang"],
        },
        readiness: {
            eyebrow: "Kenapa menunggu",
            title: "Kami lebih memilih membuka layanan ini dengan benar daripada buru-buru menjual offer yang masih kabur.",
            subtitle:
                "Targetnya membuat lini mobile app terasa lebih serius sejak hari pertama, dengan disiplin scope dan pemikiran produk yang lebih jelas.",
            items: [
                {
                    title: "Framing produk yang lebih kuat",
                    body: "Kami ingin layanan ini dimulai dari pemikiran yang lebih tajam soal use case, alur pengguna, dan aksi bisnis yang harus didukung aplikasi.",
                },
                {
                    title: "Kesiapan produksi yang lebih baik",
                    body: "Arsitektur, rencana rilis, logika handoff, dan dukungan lifecycle perlu dipikirkan sebelum layanan ini dijual lebih luas.",
                },
                {
                    title: "Delivery yang tidak generik",
                    body: "Targetnya menghindari janji aplikasi cantik tanpa struktur yang cukup kuat untuk membuat produknya tahan setelah launch.",
                },
            ],
        },
        approach: {
            eyebrow: "Pendekatan yang disiapkan",
            title: "Offer app ke depan sedang dibentuk di sekitar sense produk, kegunaan operasional, dan disiplin rilis yang nyata.",
            subtitle:
                "Kami membangun layanan ini untuk membantu bisnis bergerak dari ide ke produk mobile yang benar-benar usable dengan kejelasan lebih baik di sepanjang jalurnya.",
            pillars: [
                {
                    title: "Mulai dari logika produk",
                    body: "Kami berencana membingkai jobs, alur pengguna, dan hasil bisnis lebih dulu supaya app berangkat dari keputusan yang lebih jelas.",
                },
                {
                    title: "Desain untuk growth yang tetap terawat",
                    body: "App-nya harus lebih mudah dikembangkan setelah launch, bukan cuma terlihat mengesankan saat presentasi handoff pertama.",
                },
                {
                    title: "Dukung launch dan iterasi",
                    body: "Persiapan rilis, penyesuaian pasca-launch, dan feedback loop perlu menjadi bagian dari cerita layanan ini sejak awal.",
                },
            ],
        },
        rollout: {
            eyebrow: "Arah rollout",
            title: "Lini layanan ini sedang disiapkan dalam tiga lapisan.",
            subtitle:
                "Ini membantu kami menghindari janji yang terlalu lebar sebelum offer-nya punya kedalaman yang tepat di belakangnya.",
            steps: [
                {
                    step: "01",
                    title: "Perjelas offer-nya",
                    body: "Tentukan kecocokan yang tepat, scope delivery, dan kategori produk yang memang ingin layanan ini tangani dengan baik.",
                },
                {
                    step: "02",
                    title: "Rapatkan workflow-nya",
                    body: "Siapkan jalur desain, engineering, QA, dan launch supaya delivery terasa sengaja dibentuk, bukan dadakan.",
                },
                {
                    step: "03",
                    title: "Buka dengan sistem yang lebih kuat",
                    body: "Luncurkan lini layanan ini saat proses, positioning, dan jalur customer sudah siap memegang proyek nyata dengan rapi.",
                },
            ],
        },
        layers: {
            eyebrow: "Untuk apa ini sedang dibangun",
            title: "Area yang direncanakan akan dicakup oleh offer mobile app ini",
            items: [
                "Framing produk dan arah user flow",
                "Desain antarmuka dan interaksi aplikasi",
                "Perencanaan delivery lintas milestone rilis",
                "Struktur fitur dan sequencing launch",
                "Dukungan iterasi pasca-launch",
                "Kesiapan operasional jangka lebih panjang",
            ],
        },
        cta: {
            title: "Kalau Anda ingin akses awal saat layanan ini dibuka, kami bisa menjaga Anda tetap di loop.",
            subtitle:
                "Hubungi kami dengan ide produk atau timing rollout Anda, dan kami bisa arahkan ke layanan aktif yang tepat atau mencatat minat Anda untuk launch mobile app nanti.",
            primary: "Beri tahu saya",
            secondary: "Lihat layanan aktif",
        },
    },
};

const READINESS_ICONS = [BellRing, Workflow, Sparkles];
const APPROACH_ICONS = [Layers3, LayoutTemplate, Rocket];

function HeroSection() {
    const copy = COPY[useLocale()].hero;

    return (
        <section className="relative overflow-hidden bg-[#171127] pb-24 pt-28 text-white sm:pb-28 lg:pb-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_rgba(196,122,255,0.2),_transparent_30%),radial-gradient(circle_at_82%_18%,_rgba(103,214,255,0.18),_transparent_26%),linear-gradient(180deg,_#171127_0%,_#231a38_46%,_#f7f4fb_46%,_#f7f4fb_100%)]" />
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
                                href="mailto:plusthesite@gmail.com?subject=Mobile%20App%20Waitlist"
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
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-violet-300/18 blur-3xl" />
                        <div className="absolute -right-8 bottom-12 h-40 w-40 rounded-full bg-cyan-300/18 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">service readiness</p>
                                    <p className="mt-1 text-xs text-white/54">product, delivery, release, lifecycle</p>
                                </div>
                                <span className="rounded-full bg-amber-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                                    Coming soon
                                </span>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/42">Why pause first</p>
                                    <p className="mt-2 text-sm leading-6 text-white/78">
                                        The offer needs stronger product thinking and delivery structure before we turn it into a wide-open promise.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-[#f4ecff] p-4 text-slate-900">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What is being prepared</p>
                                    <ul className="mt-3 space-y-2 text-sm leading-6">
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-violet-700" />
                                            Clearer scope and product fit
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-violet-700" />
                                            Better launch and iteration planning
                                        </li>
                                        <li className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 text-violet-700" />
                                            A more serious customer path from idea to release
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

    return (
        <section id="readiness" className="bg-[#f7f4fb] py-24 lg:py-28">
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

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 md:grid-cols-3">
                    {copy.items.map((item, index) => {
                        const Icon = READINESS_ICONS[index];
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

function ApproachSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].approach;

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
                        const Icon = APPROACH_ICONS[index];
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
                                href="mailto:plusthesite@gmail.com?subject=Mobile%20App%20Waitlist"
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
