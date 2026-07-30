"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Bot,
    Brain,
    Check,
    Clock3,
    Headphones,
    MessageSquareQuote,
    SearchCheck,
    ShieldCheck,
    Sparkles,
    WandSparkles,
    Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        proof: string;
        pills: string[];
        assistant: string;
        status: string;
        inputPlaceholder: string;
    };
    metrics: { value: string; label: string }[];
    features: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: { title: string; body: string }[];
    };
    workflow: {
        title: string;
        subtitle: string;
        steps: { title: string; body: string }[];
    };
    pricing: {
        eyebrow: string;
        title: string;
        subtitle: string;
        plans: {
            name: string;
            price: string;
            period: string;
            highlight?: boolean;
            features: string[];
        }[];
        cta: string;
    };
    testimonials: {
        title: string;
        items: { quote: string; role: string; name: string }[];
    };
    faq: {
        title: string;
        items: { q: string; a: string }[];
    };
    cta: {
        title: string;
        subtitle: string;
        primary: string;
        secondary: string;
    };
    chat: string[];
};

const COPY: Record<Locale, PageCopy> = {
    en: {
        hero: {
            badge: "AI chatbot for faster customer replies",
            title: "A business chatbot that feels helpful, fast, and always on-brand.",
            subtitle:
                "Handle first-response support, qualify leads, and guide buyers into your next best offer without making your team live inside WhatsApp all day.",
            primaryCta: "Open AI Studio",
            secondaryCta: "See capabilities",
            proof: "Used by lean teams that need speed without losing tone.",
            pills: [
                "Lead qualification",
                "24/7 auto-replies",
                "WhatsApp-friendly tone",
                "Campaign handoff",
            ],
            assistant: "plus. AI Assistant",
            status: "Online now",
            inputPlaceholder: "Ask about pricing, delivery, promos, or support...",
        },
        metrics: [
            { value: "< 30 sec", label: "first response" },
            { value: "24/7", label: "always available" },
            { value: "1 workspace", label: "reply to campaign flow" },
        ],
        features: {
            eyebrow: "Capabilities",
            title: "Built for the messy reality of modern customer conversations.",
            subtitle:
                "Not just canned replies. The system connects customer chat, campaign context, and operator handoff in one cleaner workflow.",
            items: [
                {
                    title: "Instant brand-safe replies",
                    body: "Answer FAQs, product questions, and support prompts with a tone that stays consistent with your business.",
                },
                {
                    title: "Lead capture with context",
                    body: "Turn every conversation into structured lead notes, urgency signals, and next-step recommendations for your team.",
                },
                {
                    title: "Creative handoff to Studio",
                    body: "When buyers ask for promos, launches, or bundles, continue directly into content planning and asset generation.",
                },
                {
                    title: "Escalation that feels human",
                    body: "Route edge cases to a real operator with cleaner notes, recent intent, and suggested response framing.",
                },
            ],
        },
        workflow: {
            title: "From incoming chat to campaign action in three moves.",
            subtitle:
                "The chatbot should not stop at support. It should help the team decide what to do next.",
            steps: [
                {
                    title: "Reply instantly",
                    body: "Open with product facts, service answers, and qualifying questions that sound calm and specific.",
                },
                {
                    title: "Read buying intent",
                    body: "Spot when someone is browsing, comparing, ready to order, or needs a real person.",
                },
                {
                    title: "Trigger the next workflow",
                    body: "Move the conversation into a lead, a promo concept, a follow-up task, or a human handoff.",
                },
            ],
        },
        pricing: {
            eyebrow: "Pricing",
            title: "Start simple, then scale the workflow when volume grows.",
            subtitle:
                "Choose a plan based on how often your team needs the AI to reply, qualify, and coordinate with Studio.",
            plans: [
                {
                    name: "Starter",
                    price: "$25",
                    period: "/month",
                    features: [
                        "1,000 AI replies per month",
                        "Basic FAQ and lead capture",
                        "Simple brand tone setup",
                        "Email support",
                    ],
                },
                {
                    name: "Premium",
                    price: "$50",
                    period: "/month",
                    highlight: true,
                    features: [
                        "Unlimited AI replies",
                        "Advanced lead qualification",
                        "Studio workflow handoff",
                        "Priority support 24/7",
                    ],
                },
            ],
            cta: "Choose plan",
        },
        testimonials: {
            title: "Teams use it when fast response time starts affecting revenue.",
            items: [
                {
                    quote: "We cut dead-air in customer chat and stopped losing warm leads overnight.",
                    role: "Growth Lead, retail brand",
                    name: "Maya",
                },
                {
                    quote: "The best part is not the auto-reply. It is the cleaner context handoff to our sales team.",
                    role: "Sales Ops, service business",
                    name: "Ryan",
                },
                {
                    quote: "Our operator tone stayed human, but the response speed finally became consistent.",
                    role: "Founder, F&B business",
                    name: "Claire",
                },
            ],
        },
        faq: {
            title: "Common questions before teams switch their support flow.",
            items: [
                {
                    q: "Can this replace our support team completely?",
                    a: "No. It handles repetitive first-response work, qualification, and routing. Human operators still matter for edge cases and trust-heavy moments.",
                },
                {
                    q: "Does it work for WhatsApp-style conversations?",
                    a: "Yes. The reply style is designed to feel concise, natural, and useful in messaging-first environments.",
                },
                {
                    q: "Can it help with marketing, not just support?",
                    a: "Yes. The same workflow can push useful conversation signals into planning promos, content ideas, and follow-up campaigns.",
                },
            ],
        },
        cta: {
            title: "Ready to turn scattered customer chat into cleaner business action?",
            subtitle:
                "Launch inside plus. AI Studio and move from reply automation to lead growth in one system.",
            primary: "Launch AI Studio",
            secondary: "Back to home",
        },
        chat: [
            "Hi, I am plus. AI Assistant. What can I help you with today?",
            "Do you have a promo package for new cafe openings?",
            "Yes. We can help with chatbot setup, promo copy, and launch visuals. Are you opening this month or next month?",
            "This month. I also need replies for WhatsApp inquiries.",
            "Perfect. I can route this into a launch workflow and prepare a follow-up brief for your team.",
        ],
    },
    id: {
        hero: {
            badge: "AI chatbot untuk balasan pelanggan yang lebih cepat",
            title: "Chatbot bisnis yang terasa membantu, cepat, dan tetap sesuai brand.",
            subtitle:
                "Balas pertanyaan awal, kualifikasi lead, dan arahkan calon pembeli ke penawaran terbaik berikutnya tanpa membuat tim Anda hidup di WhatsApp seharian.",
            primaryCta: "Masuk AI Studio",
            secondaryCta: "Lihat kemampuan",
            proof: "Dipakai tim kecil yang butuh cepat tanpa kehilangan rasa personal.",
            pills: [
                "Kualifikasi lead",
                "Auto-reply 24/7",
                "Tone ramah WhatsApp",
                "Handoff ke campaign",
            ],
            assistant: "plus. AI Assistant",
            status: "Sedang online",
            inputPlaceholder: "Tanya soal harga, pengiriman, promo, atau bantuan...",
        },
        metrics: [
            { value: "< 30 detik", label: "respon pertama" },
            { value: "24/7", label: "selalu aktif" },
            { value: "1 workspace", label: "dari chat ke campaign" },
        ],
        features: {
            eyebrow: "Kemampuan",
            title: "Dibuat untuk realita percakapan pelanggan yang sering berantakan.",
            subtitle:
                "Bukan sekadar balasan template. Sistem ini menghubungkan chat pelanggan, konteks campaign, dan handoff operator dalam alur yang lebih rapi.",
            items: [
                {
                    title: "Balasan instan yang tetap aman buat brand",
                    body: "Jawab FAQ, pertanyaan produk, dan support dengan tone yang konsisten sesuai bisnis Anda.",
                },
                {
                    title: "Tangkap lead lengkap dengan konteks",
                    body: "Ubah setiap percakapan menjadi catatan lead, sinyal urgensi, dan saran next step untuk tim.",
                },
                {
                    title: "Nyambung ke Studio untuk kebutuhan kreatif",
                    body: "Saat pembeli bertanya soal promo, peluncuran, atau bundling, alur bisa langsung lanjut ke planning dan pembuatan aset.",
                },
                {
                    title: "Eskalasi ke manusia yang tetap terasa mulus",
                    body: "Kasus khusus bisa diarahkan ke operator dengan ringkasan intent, catatan terbaru, dan framing balasan yang sudah siap.",
                },
            ],
        },
        workflow: {
            title: "Dari chat masuk ke aksi campaign dalam tiga langkah.",
            subtitle:
                "Chatbot tidak berhenti di support. Ia membantu tim memutuskan tindakan berikutnya.",
            steps: [
                {
                    title: "Balas cepat",
                    body: "Buka percakapan dengan fakta produk, jawaban layanan, dan pertanyaan kualifikasi yang tetap natural.",
                },
                {
                    title: "Baca intent beli",
                    body: "Bedakan siapa yang baru browsing, sedang membandingkan, siap order, atau butuh manusia.",
                },
                {
                    title: "Picu workflow berikutnya",
                    body: "Lanjutkan percakapan menjadi lead, ide promo, tugas follow-up, atau handoff ke operator.",
                },
            ],
        },
        pricing: {
            eyebrow: "Harga",
            title: "Mulai sederhana, lalu naikkan workflow saat volume bertambah.",
            subtitle:
                "Pilih paket berdasarkan seberapa sering tim Anda butuh AI untuk membalas, mengkualifikasi, dan terhubung ke Studio.",
            plans: [
                {
                    name: "Starter",
                    price: "$25",
                    period: "/bulan",
                    features: [
                        "1.000 balasan AI per bulan",
                        "FAQ dan lead capture dasar",
                        "Setup tone brand sederhana",
                        "Dukungan email",
                    ],
                },
                {
                    name: "Premium",
                    price: "$50",
                    period: "/bulan",
                    highlight: true,
                    features: [
                        "Balasan AI tanpa batas",
                        "Kualifikasi lead lanjutan",
                        "Handoff workflow ke Studio",
                        "Dukungan prioritas 24/7",
                    ],
                },
            ],
            cta: "Pilih paket",
        },
        testimonials: {
            title: "Dipakai tim yang sadar kecepatan respon mulai berpengaruh ke omzet.",
            items: [
                {
                    quote: "Kami berhenti kehilangan lead hangat cuma karena chat pertama telat dibalas.",
                    role: "Growth Lead, brand retail",
                    name: "Maya",
                },
                {
                    quote: "Nilai terbesarnya bukan auto-reply, tapi handoff konteks yang jauh lebih rapi ke tim sales.",
                    role: "Sales Ops, bisnis jasa",
                    name: "Ryan",
                },
                {
                    quote: "Tone operator tetap terasa manusia, tapi kecepatan balas akhirnya konsisten.",
                    role: "Founder, bisnis F&B",
                    name: "Claire",
                },
            ],
        },
        faq: {
            title: "Pertanyaan umum sebelum tim mengganti alur support mereka.",
            items: [
                {
                    q: "Apakah ini bisa menggantikan tim support sepenuhnya?",
                    a: "Tidak. Sistem ini paling efektif untuk balasan awal yang repetitif, kualifikasi, dan routing. Operator manusia tetap penting untuk kasus khusus dan momen yang butuh kepercayaan tinggi.",
                },
                {
                    q: "Apakah cocok untuk percakapan gaya WhatsApp?",
                    a: "Ya. Gaya balasannya dirancang singkat, natural, dan terasa pas untuk lingkungan chat yang serba cepat.",
                },
                {
                    q: "Apakah bisa membantu marketing juga, bukan cuma support?",
                    a: "Bisa. Sinyal percakapan yang masuk bisa dipakai lagi untuk planning promo, ide konten, dan campaign follow-up.",
                },
            ],
        },
        cta: {
            title: "Siap mengubah chat pelanggan yang tercecer jadi aksi bisnis yang lebih rapi?",
            subtitle:
                "Masuk ke plus. AI Studio dan lanjutkan dari automasi balasan ke pertumbuhan lead dalam satu sistem.",
            primary: "Luncurkan AI Studio",
            secondary: "Kembali ke beranda",
        },
        chat: [
            "Halo, saya plus. AI Assistant. Ada yang bisa saya bantu hari ini?",
            "Ada paket promo untuk pembukaan cafe baru?",
            "Ada. Kami bisa bantu setup chatbot, copy promo, dan visual peluncuran. Bukanya bulan ini atau bulan depan?",
            "Bulan ini. Saya juga butuh balasan untuk inquiry WhatsApp.",
            "Cocok. Saya bisa arahkan ini ke workflow launch dan siapkan brief follow-up untuk tim Anda.",
        ],
    },
};

const featureIcons = [Bot, Brain, WandSparkles, Headphones] as const;
const workflowIcons = [Clock3, SearchCheck, Zap] as const;

function ScrollStyles() {
    return (
        <style jsx global>{`
            .fade-up {
                opacity: 0;
                transform: translateY(24px);
                filter: blur(8px);
                transition:
                    opacity 800ms cubic-bezier(0.22, 1, 0.36, 1),
                    transform 800ms cubic-bezier(0.22, 1, 0.36, 1),
                    filter 800ms cubic-bezier(0.22, 1, 0.36, 1);
            }

            .fade-up.visible {
                opacity: 1;
                transform: translateY(0);
                filter: blur(0);
            }

            .fade-up-delay-1 {
                transition-delay: 80ms;
            }

            .fade-up-delay-2 {
                transition-delay: 160ms;
            }

            .fade-up-delay-3 {
                transition-delay: 240ms;
            }
        `}</style>
    );
}

function ChatDemo({
    messages,
    assistant,
    status,
    placeholder,
}: {
    messages: string[];
    assistant: string;
    status: string;
    placeholder: string;
}) {
    const [visibleMessages, setVisibleMessages] = useState(0);
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timers = messages.map((_, index) =>
            setTimeout(() => setVisibleMessages(index + 1), index * 1300)
        );
        return () => timers.forEach(clearTimeout);
    }, [messages]);

    useEffect(() => {
        const el = messagesRef.current;
        if (el) {
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }
    }, [visibleMessages]);

    return (
        <div className="rounded-[2rem] bg-black/5 p-2 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
            <div className="rounded-[calc(2rem-0.5rem)] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950 dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-3 border-b border-slate-200/80 px-5 py-4 dark:border-slate-800">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                        <Bot size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {assistant}
                        </p>
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {status}
                        </p>
                    </div>
                </div>

                <div
                    ref={messagesRef}
                    className="h-80 space-y-3 overflow-y-auto bg-slate-50/70 px-4 py-4 dark:bg-slate-950/70"
                >
                    {messages.slice(0, visibleMessages).map((message, index) => {
                        const user = index % 2 === 1;
                        return (
                            <div
                                key={`${message}-${index}`}
                                className={`flex ${user ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        user
                                            ? "rounded-br-md bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                            : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    }`}
                                >
                                    {message}
                                </div>
                            </div>
                        );
                    })}

                    {visibleMessages < messages.length && visibleMessages > 0 && (
                        <div className="flex justify-start">
                            <div className="flex gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                                {[0, 1, 2].map((item) => (
                                    <span
                                        key={item}
                                        className="h-2 w-2 rounded-full bg-slate-400"
                                        style={{ animation: `pulse 1s ${item * 0.12}s infinite` }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-200/80 px-4 py-3 dark:border-slate-800">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                        <input
                            type="text"
                            placeholder={placeholder}
                            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-100"
                            readOnly
                        />
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeroSection({ copy }: { copy: PageCopy }) {
    const ref = useScrollReveal();
    const locale = useLocale();

    return (
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eff6ff_45%,_#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#020617_100%)]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[5%] top-[8%] h-[24rem] w-[24rem] rounded-full bg-sky-500/10 blur-[120px]" />
                <div className="absolute right-[6%] top-[20%] h-[20rem] w-[20rem] rounded-full bg-cyan-400/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-[0.035]" />
            </div>

            <div
                ref={ref}
                className="relative mx-auto grid min-h-[100dvh] max-w-7xl gap-14 px-6 pb-16 pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8"
            >
                <div className="flex flex-col justify-center">
                    <span className="fade-up inline-flex w-max items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        <Sparkles size={14} className="text-sky-600 dark:text-cyan-300" />
                        {copy.hero.badge}
                    </span>

                    <h1 className="fade-up fade-up-delay-1 mt-7 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.06em] text-slate-950 md:text-6xl xl:text-7xl dark:text-white">
                        {copy.hero.title}
                    </h1>

                    <p className="fade-up fade-up-delay-2 mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
                        {copy.hero.subtitle}
                    </p>

                    <div className="fade-up fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={`/${locale}/studio`}
                            className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-sky-700 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100"
                        >
                            {copy.hero.primaryCta}
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 dark:bg-slate-900/10">
                                <ArrowRight size={16} />
                            </span>
                        </Link>
                        <a
                            href="#capabilities"
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-7 py-4 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-white active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            {copy.hero.secondaryCta}
                        </a>
                    </div>

                    <div className="fade-up fade-up-delay-3 mt-8 flex flex-wrap gap-2">
                        {copy.hero.pills.map((pill) => (
                            <span
                                key={pill}
                                className="rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                            >
                                {pill}
                            </span>
                        ))}
                    </div>

                    <div className="fade-up fade-up-delay-3 mt-10 rounded-[2rem] bg-black/5 p-1.5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
                        <div className="rounded-[calc(2rem-0.375rem)] bg-white px-5 py-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:bg-slate-950">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {copy.hero.proof}
                            </p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {copy.metrics.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                                            {metric.value}
                                        </p>
                                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                            {metric.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="fade-up fade-up-delay-2 w-full">
                        <ChatDemo
                            messages={copy.chat}
                            assistant={copy.hero.assistant}
                            status={copy.hero.status}
                            placeholder={copy.hero.inputPlaceholder}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection({ copy }: { copy: PageCopy }) {
    const ref = useScrollReveal();

    return (
        <section id="capabilities" className="bg-slate-50/70 py-24 dark:bg-slate-950">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-3xl">
                    <span className="fade-up inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
                        <BadgeCheck size={14} />
                        {copy.features.eyebrow}
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-6 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                        {copy.features.title}
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                        {copy.features.subtitle}
                    </p>
                </div>

                <div className="fade-up fade-up-delay-3 mt-16 grid gap-6 lg:grid-cols-12">
                    {copy.features.items.map((item, index) => {
                        const Icon = featureIcons[index];
                        const span =
                            index === 0
                                ? "lg:col-span-7"
                                : index === 1
                                  ? "lg:col-span-5"
                                  : index === 2
                                    ? "lg:col-span-5"
                                    : "lg:col-span-7";
                        return (
                            <div
                                key={item.title}
                                className={`rounded-[2rem] bg-black/5 p-1.5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10 ${span}`}
                            >
                                <div className="h-full rounded-[calc(2rem-0.375rem)] border border-white/60 bg-white p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-slate-950">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
                                        <Icon size={20} strokeWidth={1.75} />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        {item.body}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function WorkflowSection({ copy }: { copy: PageCopy }) {
    const ref = useScrollReveal();

    return (
        <section className="bg-white py-24 dark:bg-slate-950">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <h2 className="fade-up max-w-xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                            {copy.workflow.title}
                        </h2>
                        <p className="fade-up fade-up-delay-1 mt-4 max-w-lg text-base leading-8 text-slate-600 dark:text-slate-300">
                            {copy.workflow.subtitle}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {copy.workflow.steps.map((step, index) => {
                            const Icon = workflowIcons[index];
                            return (
                                <div
                                    key={step.title}
                                    className={`fade-up rounded-[2rem] bg-black/5 p-1.5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10 fade-up-delay-${Math.min(index + 1, 3)}`}
                                >
                                    <div className="rounded-[calc(2rem-0.375rem)] border border-white/70 bg-white px-6 py-6 dark:border-white/10 dark:bg-slate-950">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                                <Icon size={20} strokeWidth={1.75} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                    Step 0{index + 1}
                                                </p>
                                                <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                                                    {step.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                                    {step.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function PricingSection({ copy }: { copy: PageCopy }) {
    const ref = useScrollReveal();
    const locale = useLocale();

    return (
        <section className="bg-slate-50/70 py-24 dark:bg-slate-900/30">
            <div ref={ref} className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="fade-up inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white dark:bg-white dark:text-slate-900">
                        <ShieldCheck size={14} />
                        {copy.pricing.eyebrow}
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-6 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                        {copy.pricing.title}
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                        {copy.pricing.subtitle}
                    </p>
                </div>

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-6 md:grid-cols-2">
                    {copy.pricing.plans.map((plan) => (
                        <div
                            key={plan.name}
                            className="rounded-[2rem] bg-black/5 p-1.5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
                        >
                            <div
                                className={`h-full rounded-[calc(2rem-0.375rem)] border px-7 py-8 ${
                                    plan.highlight
                                        ? "border-sky-500/30 bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                                        : "border-white/70 bg-white text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p
                                            className={`text-sm font-semibold uppercase tracking-[0.16em] ${
                                                plan.highlight
                                                    ? "text-sky-200 dark:text-sky-700"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            {plan.name}
                                        </p>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-5xl font-semibold tracking-tight">
                                                {plan.price}
                                            </span>
                                            <span
                                                className={`text-sm ${
                                                    plan.highlight
                                                        ? "text-slate-300 dark:text-slate-600"
                                                        : "text-slate-500 dark:text-slate-400"
                                                }`}
                                            >
                                                {plan.period}
                                            </span>
                                        </div>
                                    </div>
                                    {plan.highlight && (
                                        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white dark:bg-slate-900/10 dark:text-slate-900">
                                            Popular
                                        </span>
                                    )}
                                </div>

                                <ul className="mt-8 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className={`flex items-start gap-3 text-sm leading-7 ${
                                                plan.highlight
                                                    ? "text-slate-200 dark:text-slate-700"
                                                    : "text-slate-600 dark:text-slate-300"
                                            }`}
                                        >
                                            <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/15 text-sky-300 dark:text-sky-600">
                                                <Check size={12} strokeWidth={2.4} />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/${locale}/payment?name=${encodeURIComponent(
                                        plan.name
                                    )}&price=${encodeURIComponent(
                                        `${plan.price}${plan.period}`
                                    )}`}
                                    className={`mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] ${
                                        plan.highlight
                                            ? "bg-white text-slate-950 hover:bg-sky-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                                            : "bg-slate-950 text-white hover:bg-sky-700 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100"
                                    }`}
                                >
                                    {copy.pricing.cta}
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection({ copy }: { copy: PageCopy }) {
    const ref = useScrollReveal();

    return (
        <section className="bg-white py-24 dark:bg-slate-950">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="fade-up max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                    {copy.testimonials.title}
                </h2>

                <div className="fade-up fade-up-delay-2 mt-14 grid gap-6 lg:grid-cols-3">
                    {copy.testimonials.items.map((item) => (
                        <div
                            key={item.name}
                            className="rounded-[2rem] bg-black/5 p-1.5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
                        >
                            <div className="h-full rounded-[calc(2rem-0.375rem)] border border-white/70 bg-white p-7 dark:border-white/10 dark:bg-slate-950">
                                <MessageSquareQuote
                                    size={28}
                                    className="text-sky-600 dark:text-sky-300"
                                    strokeWidth={1.75}
                                />
                                <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
                                    &ldquo;{item.quote}&rdquo;
                                </p>
                                <div className="mt-8">
                                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                                        {item.name}
                                    </p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQSection({ copy }: { copy: PageCopy }) {
    const ref = useScrollReveal();
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="bg-slate-50/70 py-24 dark:bg-slate-900/30">
            <div ref={ref} className="mx-auto max-w-4xl px-6 lg:px-8">
                <h2 className="fade-up text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                    {copy.faq.title}
                </h2>

                <div className="fade-up fade-up-delay-2 mt-12 space-y-3">
                    {copy.faq.items.map((item, index) => (
                        <div
                            key={item.q}
                            className="rounded-[1.5rem] bg-black/5 p-1 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
                        >
                            <div className="rounded-[calc(1.5rem-0.25rem)] border border-white/70 bg-white dark:border-white/10 dark:bg-slate-950">
                                <button
                                    onClick={() =>
                                        setOpenIdx(openIdx === index ? null : index)
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                                >
                                    <span className="text-sm font-semibold text-slate-950 dark:text-white">
                                        {item.q}
                                    </span>
                                    <span className="text-slate-400">
                                        {openIdx === index ? "-" : "+"}
                                    </span>
                                </button>
                                {openIdx === index && (
                                    <p className="px-6 pb-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        {item.a}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection({ copy }: { copy: PageCopy }) {
    const ref = useScrollReveal();
    const locale = useLocale();

    return (
        <section className="bg-white py-24 dark:bg-slate-950">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="fade-up rounded-[2.5rem] bg-black/5 p-2 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
                    <div className="relative overflow-hidden rounded-[calc(2.5rem-0.5rem)] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_25%),linear-gradient(180deg,_#eff6ff_0%,_#ffffff_100%)] px-8 py-16 text-center dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] sm:px-14">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/15 blur-[90px]" />
                        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/15 blur-[90px]" />

                        <div className="relative z-10 mx-auto max-w-3xl">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                                Conversion-ready support flow
                            </p>
                            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                                {copy.cta.title}
                            </h2>
                            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                                {copy.cta.subtitle}
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href={`/${locale}/studio`}
                                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-sky-700 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-sky-100"
                                >
                                    {copy.cta.primary}
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 dark:bg-slate-900/10">
                                        <ArrowRight size={16} />
                                    </span>
                                </Link>
                                <Link
                                    href={`/${locale}`}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-7 py-4 text-sm font-semibold text-slate-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-white active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                                >
                                    {copy.cta.secondary}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function ChatBotPage() {
    const locale = useLocale();
    const copy = COPY[locale];

    return (
        <>
            <ScrollStyles />
            <Navbar />
            <main>
                <HeroSection copy={copy} />
                <FeaturesSection copy={copy} />
                <WorkflowSection copy={copy} />
                <PricingSection copy={copy} />
                <TestimonialsSection copy={copy} />
                <FAQSection copy={copy} />
                <CTASection copy={copy} />
            </main>
            <Footer />
        </>
    );
}
