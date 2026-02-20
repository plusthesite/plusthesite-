"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ── Data ── */

const features = [
    {
        icon: "📊",
        title: "Sales Pipeline",
        desc: "Visual drag-and-drop pipeline management. Track deals from lead to close with real-time stage updates and probability scoring.",
        color: "primary" as const,
    },
    {
        icon: "👥",
        title: "Contact Management",
        desc: "360° customer profiles with interaction history, social data, and AI-enriched insights. Know every client like a close friend.",
        color: "secondary" as const,
    },
    {
        icon: "🤖",
        title: "AI Lead Scoring",
        desc: "Machine learning algorithms rank your leads by conversion probability. Focus your team on deals most likely to close.",
        color: "tertiary" as const,
    },
    {
        icon: "⚙️",
        title: "Workflow Automation",
        desc: "Automate follow-ups, task assignments, and data entry. Eliminate repetitive work so your team sells more.",
        color: "primary" as const,
    },
    {
        icon: "📧",
        title: "Email Integration",
        desc: "Two-way email sync with Gmail and Outlook. Track opens, clicks, and replies — all from within your CRM.",
        color: "secondary" as const,
    },
    {
        icon: "📈",
        title: "Revenue Analytics",
        desc: "Forecasting dashboards, win/loss analysis, and team performance metrics. Data-backed decisions for predictable growth.",
        color: "tertiary" as const,
    },
];

const stats = [
    { value: "35%", label: "More Closed Deals" },
    { value: "10K+", label: "Active Users" },
    { value: "2.5M", label: "Contacts Managed" },
    { value: "98%", label: "Customer Retention" },
];

const testimonials = [
    {
        quote: "Our sales cycle shortened by 40% after implementing PLUS CRM. The AI lead scoring alone was worth the switch.",
        name: "Michael Torres",
        role: "VP of Sales, CloudSync",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80&auto=format",
    },
    {
        quote: "Finally, a CRM that doesn't require a PhD to use. Our entire team was onboarded in less than a day.",
        name: "Dian Permata",
        role: "Sales Director, Indocommerce",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80&auto=format",
    },
    {
        quote: "The automation features save us 15 hours per week in manual data entry. That's time we spend actually selling.",
        name: "Alex Wijaya",
        role: "Founder, SalesBridge",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80&auto=format",
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
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04]" />
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-teal-500/8 rounded-full blur-[100px]" />
            <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32 lg:py-40">
                <div className="max-w-3xl">
                    <span className="fade-up inline-flex items-center gap-2 rounded-full bg-tertiary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tertiary mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
                        CRM Platform
                    </span>
                    <h1 className="fade-up fade-up-delay-1 text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-5xl lg:text-6xl leading-[1.1]">
                        Sell Smarter,<br />
                        <span className="gradient-text">Close Faster</span>
                    </h1>
                    <p className="fade-up fade-up-delay-2 mt-6 text-lg leading-relaxed text-[#475569] dark:text-[#94A3B8] max-w-xl">
                        AI-powered CRM that turns leads into loyal customers. Automate workflows, track every deal, and grow revenue predictably.
                    </p>
                    <div className="fade-up fade-up-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
                        <a href="/#pricing" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                            Start Free Trial
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </a>
                        <a href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">
                            Watch Demo
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
                        Features
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                        Your Complete<br />Sales Toolkit
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-4 text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                        From first contact to closed deal — manage every step of your sales journey in one platform.
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
        <section className="py-20 bg-gradient-to-r from-tertiary to-primary">
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
                    <span className="fade-up inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
                        Testimonials
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl">
                        Trusted by Sales Teams
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
                    Ready to Supercharge<br /><span className="gradient-text">Your Sales?</span>
                </h2>
                <p className="fade-up fade-up-delay-1 mt-6 text-lg text-[#475569] dark:text-[#94A3B8]">
                    Join 10,000+ businesses growing faster with PLUS CRM.
                </p>
                <div className="fade-up fade-up-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/#pricing" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                        Start Free Trial
                    </a>
                    <a href="/#contact" className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-4 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">
                        Contact Sales
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ── Page ── */

export default function CRMPage() {
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
