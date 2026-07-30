"use client";

import Link from "next/link";
import {
    ArrowRight,
    Check,
    Gamepad2,
    Layers2,
    Radar,
    Rocket,
    Swords,
    Trophy,
    Users,
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
    capabilities: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: { title: string; body: string }[];
    };
    genres: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: { title: string; body: string }[];
    };
    production: {
        eyebrow: string;
        title: string;
        subtitle: string;
        steps: { step: string; title: string; body: string }[];
    };
    systems: {
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
            badge: "Mobile game development for studios and ambitious new IPs",
            title: "Build mobile games with stronger production discipline, cleaner launch logic, and live-ops headroom.",
            subtitle:
                "We help teams shape the core loop, production pipeline, backend decisions, and post-launch systems so the game is easier to ship and easier to grow.",
            primaryCta: "Talk about your game",
            secondaryCta: "See production scope",
            note: "Best fit for founders, publishers, and teams that need a serious partner from concept through live release.",
            chips: ["Core loop design", "Unity pipeline", "Backend planning", "Live ops support"],
        },
        capabilities: {
            eyebrow: "Capabilities",
            title: "A game studio partner that thinks beyond launch day.",
            subtitle:
                "We work on the things that usually break momentum: unclear scope, weak retention structure, rushed production, and missing live-ops planning.",
            items: [
                {
                    title: "Gameplay and progression design",
                    body: "Shape the session loop, reward rhythm, onboarding beats, and longer-term progression so the game feels easier to understand and keep playing.",
                },
                {
                    title: "Production-ready client development",
                    body: "Build mobile gameplay systems, UI flows, content structures, and device-aware performance decisions with maintainable project structure.",
                },
                {
                    title: "Backend and multiplayer planning",
                    body: "Design the service layer for player state, matchmaking, economy events, and operational tooling before the game scales into chaos.",
                },
                {
                    title: "Launch and live-ops support",
                    body: "Prepare update rhythms, event frameworks, balancing loops, and content release patterns so the game can keep moving after release.",
                },
            ],
        },
        genres: {
            eyebrow: "Where we help",
            title: "Useful across competitive, casual, and progression-heavy game formats.",
            subtitle:
                "We adapt the production and systems approach around the genre instead of forcing one pipeline into every game.",
            items: [
                {
                    title: "Competitive and multiplayer",
                    body: "Clean session flow, responsive controls, ranking logic, and backend decisions that support fair play and repeat sessions.",
                },
                {
                    title: "Casual and puzzle loops",
                    body: "Accessible onboarding, content pacing, event cadence, and monetization surfaces that do not crush the player experience.",
                },
                {
                    title: "Midcore progression systems",
                    body: "Economy design, daily loops, unlock logic, and retention structure that can survive real content expansion over time.",
                },
            ],
        },
        production: {
            eyebrow: "Production rhythm",
            title: "A tighter path from game concept to live environment.",
            subtitle:
                "The process is designed to reduce expensive guessing and make technical decisions earlier, while they are still cheap to fix.",
            steps: [
                {
                    step: "01",
                    title: "Frame the game properly",
                    body: "We clarify the core fantasy, target audience, production scope, monetization direction, and the systems that actually matter first.",
                },
                {
                    step: "02",
                    title: "Build the playable foundation",
                    body: "We move through prototype, system architecture, core gameplay, UI, and service planning with cleaner alignment between design and engineering.",
                },
                {
                    step: "03",
                    title: "Prepare for operating the game",
                    body: "We set up launch-readiness, content planning, balancing workflows, and live-ops support so release is not the point where the structure collapses.",
                },
            ],
        },
        systems: {
            eyebrow: "Common production layers",
            title: "Areas we usually support inside a mobile game build",
            items: [
                "Core loop and retention review",
                "Unity-based feature implementation",
                "Economy and progression planning",
                "Backend event and data structure planning",
                "Content pipeline for updates and events",
                "Live-ops workflow and release preparation",
            ],
        },
        cta: {
            title: "If the game idea is clear but the production path still feels fuzzy, this is where we help.",
            subtitle:
                "We can help your team tighten the plan, build the right foundation, and prepare the game for a more stable launch cycle.",
            primary: "Start the discussion",
            secondary: "See pricing",
        },
    },
    id: {
        hero: {
            badge: "Pengembangan game mobile untuk studio dan IP baru yang ambisius",
            title: "Bangun game mobile dengan disiplin produksi yang lebih kuat, logika launch yang lebih rapi, dan ruang live-ops yang matang.",
            subtitle:
                "Kami bantu tim membentuk core loop, pipeline produksi, keputusan backend, dan sistem pasca-rilis supaya game lebih mudah dikirim dan lebih mudah ditumbuhkan.",
            primaryCta: "Bahas game Anda",
            secondaryCta: "Lihat cakupan produksi",
            note: "Paling cocok untuk founder, publisher, dan tim yang butuh partner serius dari konsep sampai live release.",
            chips: ["Desain core loop", "Pipeline Unity", "Perencanaan backend", "Support live ops"],
        },
        capabilities: {
            eyebrow: "Kapabilitas",
            title: "Partner studio game yang berpikir lebih jauh dari hari peluncuran.",
            subtitle:
                "Kami mengerjakan bagian yang biasanya bikin momentum pecah: scope yang kabur, struktur retensi lemah, produksi terburu-buru, dan live-ops yang tidak disiapkan.",
            items: [
                {
                    title: "Desain gameplay dan progression",
                    body: "Membentuk loop sesi, ritme reward, alur onboarding, dan progression jangka lebih panjang supaya game mudah dipahami dan enak terus dimainkan.",
                },
                {
                    title: "Client development yang siap produksi",
                    body: "Membangun sistem gameplay mobile, alur UI, struktur konten, dan keputusan performa lintas device dengan struktur proyek yang tetap terawat.",
                },
                {
                    title: "Perencanaan backend dan multiplayer",
                    body: "Merancang layer layanan untuk state pemain, matchmaking, event ekonomi, dan tooling operasional sebelum game tumbuh jadi kacau.",
                },
                {
                    title: "Support launch dan live ops",
                    body: "Menyiapkan ritme update, framework event, loop balancing, dan pola rilis konten supaya game terus bergerak setelah release.",
                },
            ],
        },
        genres: {
            eyebrow: "Area bantuan",
            title: "Relevan untuk format kompetitif, kasual, maupun game dengan progression berat.",
            subtitle:
                "Kami menyesuaikan pendekatan produksi dan sistem berdasarkan genre, bukan memaksa satu pipeline untuk semua game.",
            items: [
                {
                    title: "Kompetitif dan multiplayer",
                    body: "Alur sesi yang bersih, kontrol responsif, logika ranking, dan keputusan backend yang mendukung fair play serta repeat session.",
                },
                {
                    title: "Loop casual dan puzzle",
                    body: "Onboarding yang mudah diikuti, pacing konten, ritme event, dan surface monetisasi yang tidak merusak pengalaman pemain.",
                },
                {
                    title: "Sistem progression midcore",
                    body: "Desain ekonomi, daily loop, logika unlock, dan struktur retensi yang tahan saat konten berkembang dari waktu ke waktu.",
                },
            ],
        },
        production: {
            eyebrow: "Ritme produksi",
            title: "Jalur yang lebih rapat dari konsep game ke lingkungan live.",
            subtitle:
                "Prosesnya dirancang untuk mengurangi tebak-tebakan mahal dan mendorong keputusan teknis lebih awal, saat perbaikannya masih murah.",
            steps: [
                {
                    step: "01",
                    title: "Bingkai gamenya dulu",
                    body: "Kami memperjelas fantasi inti, target pemain, scope produksi, arah monetisasi, dan sistem yang memang paling penting terlebih dahulu.",
                },
                {
                    step: "02",
                    title: "Bangun fondasi playable",
                    body: "Kami bergerak lewat prototype, arsitektur sistem, gameplay inti, UI, dan service planning dengan alignment lebih bersih antara desain dan engineering.",
                },
                {
                    step: "03",
                    title: "Siapkan operasional game",
                    body: "Kami menyiapkan launch-readiness, perencanaan konten, workflow balancing, dan support live-ops supaya struktur game tidak runtuh saat rilis.",
                },
            ],
        },
        systems: {
            eyebrow: "Lapisan produksi umum",
            title: "Area yang biasanya kami bantu di dalam build game mobile",
            items: [
                "Review core loop dan retensi",
                "Implementasi fitur berbasis Unity",
                "Perencanaan ekonomi dan progression",
                "Perencanaan struktur data dan event backend",
                "Pipeline konten untuk update dan event",
                "Workflow live-ops dan persiapan rilis",
            ],
        },
        cta: {
            title: "Kalau ide gamenya sudah jelas tapi jalur produksinya masih kabur, di sinilah kami masuk.",
            subtitle:
                "Kami bisa bantu tim Anda merapikan rencana, membangun fondasi yang tepat, dan menyiapkan game untuk siklus launch yang lebih stabil.",
            primary: "Mulai diskusinya",
            secondary: "Lihat pricing",
        },
    },
};

const CAPABILITY_ICONS = [Gamepad2, Layers2, Users, Rocket];
const GENRE_ICONS = [Trophy, Radar, Swords];

function HeroSection() {
    const locale = useLocale();
    const copy = COPY[locale].hero;
    const summaryCards = [
        {
            label: locale === "id" ? "Pandangan produksi" : "Production view",
            body:
                locale === "id"
                    ? "Core loop, backend, dan live-ops dibentuk sebagai satu sistem yang saling nyambung."
                    : "Core loop, backend, and live-ops are shaped as one connected system.",
        },
        {
            label: locale === "id" ? "Paling cocok" : "Best fit",
            body:
                locale === "id"
                    ? "Untuk studio, founder, dan publisher yang butuh partner produksi game yang serius."
                    : "For studios, founders, and publishers that need a serious game production partner.",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[#040816] pb-24 pt-28 text-white sm:pb-28 lg:pb-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,_rgba(44,189,255,0.24),_transparent_28%),radial-gradient(circle_at_78%_20%,_rgba(162,93,255,0.22),_transparent_26%),radial-gradient(circle_at_50%_90%,_rgba(255,122,74,0.18),_transparent_30%)]" />
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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
                                href="mailto:plusthesite@gmail.com?subject=Mobile%20Game%20Development%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                            >
                                {copy.primaryCta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href="#capabilities"
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
                                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                                >
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/72">
                                        {card.label}
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-white/74">{card.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 top-4 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
                        <div className="absolute right-0 top-16 h-40 w-40 rounded-full bg-violet-500/24 blur-3xl" />
                        <div className="absolute bottom-4 left-12 h-28 w-28 rounded-full bg-orange-400/18 blur-3xl" />

                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {locale === "id" ? "papan produksi live" : "live production board"}
                                    </p>
                                    <p className="mt-1 text-xs text-white/54">
                                        {locale === "id" ? "dari prototype sampai content ops" : "from prototype to content ops"}
                                    </p>
                                </div>
                                <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                    {locale === "id" ? "Mode rilis" : "Release mode"}
                                </span>
                            </div>

                            <div className="mt-5 grid gap-4">
                                <div className="rounded-2xl border border-white/10 bg-[#0f1630] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
                                        {locale === "id" ? "Fondasi" : "Foundation"}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-white/78">
                                        {locale === "id"
                                            ? "Core loop, progression, skala konten, dan arsitektur service dibingkai lebih dulu sebelum implementasi mahal menyebar ke mana-mana."
                                            : "Core loop, progression, content scale, and service architecture are framed before expensive implementation spreads everywhere."}
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                                            {locale === "id" ? "Track build" : "Build tracks"}
                                        </p>
                                        <ul className="mt-3 space-y-2 text-sm text-white/74">
                                            <li className="flex gap-2">
                                                <Check className="mt-0.5 h-4 w-4 text-cyan-300" />
                                                {locale === "id" ? "Sistem gameplay client" : "Client gameplay systems"}
                                            </li>
                                            <li className="flex gap-2">
                                                <Check className="mt-0.5 h-4 w-4 text-cyan-300" />
                                                {locale === "id" ? "Surface UI dan ekonomi" : "UI and economy surfaces"}
                                            </li>
                                            <li className="flex gap-2">
                                                <Check className="mt-0.5 h-4 w-4 text-cyan-300" />
                                                {locale === "id" ? "Persiapan backend dan event" : "Backend and event prep"}
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                                            {locale === "id" ? "Lensa operasi" : "Operating lens"}
                                        </p>
                                        <ul className="mt-3 space-y-2 text-sm text-white/74">
                                            <li className="flex gap-2">
                                                <Check className="mt-0.5 h-4 w-4 text-violet-300" />
                                                {locale === "id" ? "Pacing retensi yang sensitif" : "Retention-sensitive pacing"}
                                            </li>
                                            <li className="flex gap-2">
                                                <Check className="mt-0.5 h-4 w-4 text-violet-300" />
                                                {locale === "id" ? "Perencanaan cadence konten" : "Content cadence planning"}
                                            </li>
                                            <li className="flex gap-2">
                                                <Check className="mt-0.5 h-4 w-4 text-violet-300" />
                                                {locale === "id" ? "Kesiapan event live" : "Live event readiness"}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CapabilitiesSection() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const copy = COPY[locale].capabilities;

    return (
        <section id="capabilities" className="bg-[#f4f6fb] py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
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

                    <div className="fade-up fade-up-delay-3 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    {locale === "id" ? "Tensi inti" : "Core tension"}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {locale === "id"
                                        ? "Masalahnya sering bukan kekurangan fitur, tapi arah produksi yang pecah antara gameplay, ekonomi, dan operasi setelah rilis."
                                        : "The problem is often not missing features, but a production path that splits gameplay, economy, and post-launch operations apart."}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    {locale === "id" ? "Target perbaikan" : "Repair goal"}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {locale === "id"
                                        ? "Membuat jalur produksi game terasa lebih terarah, lebih sinkron, dan lebih siap dipakai tumbuh setelah launch."
                                        : "Make the game production path feel more directed, more aligned, and more ready to keep growing after launch."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-4 mt-14 grid gap-5 md:grid-cols-2">
                    {copy.items.map((item, index) => {
                        const Icon = CAPABILITY_ICONS[index];
                        return (
                            <article
                                key={item.title}
                                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]"
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

function GenreSection() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const copy = COPY[locale].genres;

    return (
        <section className="bg-white py-24 lg:py-28">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
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

                        <div className="fade-up fade-up-delay-3 mt-8 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {locale === "id" ? "Sikap desain" : "Design stance"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {locale === "id"
                                    ? "Kami tidak memaksa satu pola monetisasi, retention, atau content cadence ke semua game. Bentuk sistemnya mengikuti genre dan tujuan produknya."
                                    : "We do not force one monetization, retention, or content cadence pattern into every game. The system shape follows the genre and product goal."}
                            </p>
                        </div>
                    </div>

                    <div className="fade-up fade-up-delay-4 grid gap-5">
                        {copy.items.map((item, index) => {
                            const Icon = GENRE_ICONS[index];
                            return (
                                <article
                                    key={item.title}
                                    className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,23,42,0.1)] sm:p-7"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                                            <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProductionSection() {
    const ref = useScrollReveal();
    const copy = COPY[useLocale()].production;

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

function SystemsSection() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const copy = COPY[locale].systems;

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

                        <div className="fade-up fade-up-delay-2 mt-8 rounded-[1.6rem] border border-slate-200 bg-white p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {locale === "id" ? "Bundle umum" : "Typical bundle"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {locale === "id"
                                    ? "Tidak semua tim butuh semua layer game sekaligus. Biasanya kami masuk dari area yang paling cepat membuka jalur produksi dan operasional."
                                    : "Not every team needs every game layer at once. We usually enter through the layer that opens the production and operating path fastest."}
                            </p>
                        </div>
                    </div>

                    <div className="fade-up fade-up-delay-3 grid gap-4 sm:grid-cols-2">
                        {copy.items.map((item) => (
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
                                plus. mobile game development
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
                                href="mailto:plusthesite@gmail.com?subject=Mobile%20Game%20Development%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
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

                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">
                                {locale === "id" ? "Apa yang dibuka lebih dulu" : "What gets surfaced first"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-white/68">
                                {locale === "id"
                                    ? "Diskusi awal biasanya langsung membuka problem di core loop, struktur produksi, dan live-ops yang paling berisiko kalau dibiarkan kabur."
                                    : "The first discussion usually surfaces the core loop, production structure, and live-ops problems that are riskiest to leave fuzzy."}
                            </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">
                                {locale === "id" ? "Titik masuk umum" : "Common entry point"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-white/68">
                                {locale === "id"
                                    ? "Tim bisa masuk lewat fondasi playable, struktur sistem, atau jalur rilis, tergantung bottleneck produksi yang paling terasa sekarang."
                                    : "Teams can enter through the playable foundation, system structure, or release path, depending on which production bottleneck is most active now."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function MobileGamePage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <CapabilitiesSection />
                <GenreSection />
                <ProductionSection />
                <ProofBand />
                <HowWeWork />
                <SystemsSection />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
