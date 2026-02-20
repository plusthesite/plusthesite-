"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ── Data ── */

const features = [
    {
        icon: "📱",
        title: "Cross-Platform",
        desc: "Build once, deploy everywhere. Native performance on iOS and Android from a single codebase using React Native and Flutter.",
        color: "primary" as const,
    },
    {
        icon: "🔔",
        title: "Smart Notifications",
        desc: "AI-driven push notifications that reach users at the perfect moment. Boost engagement with personalized, timely alerts.",
        color: "secondary" as const,
    },
    {
        icon: "📶",
        title: "Offline-First",
        desc: "Full functionality even without connection. Automatic sync when back online — your users never miss a beat.",
        color: "tertiary" as const,
    },
    {
        icon: "⚡",
        title: "Lightning Fast",
        desc: "60fps animations, instant load times, and smooth transitions. Performance that users can feel on every interaction.",
        color: "primary" as const,
    },
    {
        icon: "🔒",
        title: "Enterprise Security",
        desc: "End-to-end encryption, biometric auth, and compliance-ready architecture. Your data stays protected at every layer.",
        color: "secondary" as const,
    },
    {
        icon: "📈",
        title: "Built-in Analytics",
        desc: "Track user behavior, retention funnels, and feature adoption. Make data-driven decisions to grow your app.",
        color: "tertiary" as const,
    },
];

const stats = [
    { value: "200+", label: "Apps Delivered" },
    { value: "5M+", label: "Downloads" },
    { value: "4.8★", label: "Avg Store Rating" },
    { value: "12", label: "Countries Served" },
];

const testimonials = [
    {
        quote: "PLUS built our app in record time. The cross-platform approach saved us months of development and thousands in costs.",
        name: "David Park",
        role: "CTO, FitTrack",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format",
    },
    {
        quote: "The offline-first architecture was exactly what we needed for our field service app. Our technicians love it.",
        name: "Rina Sari",
        role: "Product Manager, FieldPro",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format",
    },
    {
        quote: "From 3.2 to 4.8 stars on the App Store after the redesign. The performance improvements were night and day.",
        name: "Jason Lee",
        role: "Founder, QuickBite",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format",
    },
];

const colorMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
};

/* ── Sections ── */

function HeroSection() {
    const ref = useScrollReveal();
    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04]" />
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-pink-500/8 rounded-full blur-[100px]" />
            <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32 lg:py-40">
                <div className="max-w-3xl">
                    <span className="fade-up inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                        Mobile App
                    </span>
                    <h1 className="fade-up fade-up-delay-1 text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-5xl lg:text-6xl leading-[1.1]">
                        Mobile-First<br />
                        <span className="gradient-text">Experiences</span>
                    </h1>
                    <p className="fade-up fade-up-delay-2 mt-6 text-lg leading-relaxed text-[#475569] dark:text-[#94A3B8] max-w-xl">
                        Beautiful, performant mobile apps that users love. From concept to App Store — we handle the entire journey.
                    </p>
                    <div className="fade-up fade-up-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
                        <a href="/#pricing" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                            Start Your Project
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </a>
                        <a href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">
                            View Portfolio
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    const ref = useScrollReveal();
    return (
        <section className="py-24 lg:py-32 bg-background">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="fade-up inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                        Capabilities
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                        Everything for<br />Modern Mobile Apps
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-4 text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                        Enterprise-grade features with startup speed. Build apps that scale from day one.
                    </p>
                </div>
                <div className="fade-up fade-up-delay-3 mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, i) => (
                        <div key={i} className="group rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorMap[f.color]} text-2xl transition-transform group-hover:scale-110`}>
                                {f.icon}
                            </span>
                            <h3 className="mt-5 text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">{f.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatsSection() {
    const ref = useScrollReveal();
    return (
        <section className="py-20 bg-gradient-to-r from-secondary to-primary">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="fade-up grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((s, i) => (
                        <div key={i}>
                            <p className="text-4xl font-bold tracking-tight">{s.value}</p>
                            <p className="mt-2 text-sm font-medium text-white/70">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    const ref = useScrollReveal();
    return (
        <section className="py-24 lg:py-32 bg-section-alt">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="fade-up inline-block rounded-full bg-tertiary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tertiary">
                        Success Stories
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl">
                        Built for Real Businesses
                    </h2>
                </div>
                <div className="fade-up fade-up-delay-2 mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] p-8 transition-all hover:shadow-lg">
                            <p className="text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1] italic">&ldquo;{t.quote}&rdquo;</p>
                            <div className="mt-6 flex items-center gap-3">
                                <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full object-cover h-10 w-10" unoptimized />
                                <div>
                                    <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">{t.name}</p>
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    const ref = useScrollReveal();
    return (
        <section className="py-24 lg:py-32 bg-background">
            <div ref={ref} className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                <h2 className="fade-up text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                    Ready to Build Your<br /><span className="gradient-text">Dream App?</span>
                </h2>
                <p className="fade-up fade-up-delay-1 mt-6 text-lg text-[#475569] dark:text-[#94A3B8]">
                    From idea to App Store — let&apos;s bring your mobile vision to life.
                </p>
                <div className="fade-up fade-up-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/#pricing" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                        Get a Quote
                    </a>
                    <a href="/#contact" className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-4 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">
                        Schedule a Call
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ── Page ── */

export default function MobileAppPage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <StatsSection />
                <TestimonialsSection />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
