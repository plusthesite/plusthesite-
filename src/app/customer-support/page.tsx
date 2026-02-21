"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/components/LanguageProvider";

/* ── Data (icons & colors only — text from translations) ── */

const featureIcons = ["🎧", "🎫", "💬", "📚", "📊", "🤖"];
const featureColors = ["primary", "secondary", "tertiary", "primary", "secondary", "tertiary"] as const;

const avatars = [
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80&auto=format",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&auto=format",
];

const colorMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
};

/* ── Page ── */

export default function CustomerSupportPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t: any = useTranslation();
    const p = t.customerSupportPage;
    const heroRef = useScrollReveal();
    const featRef = useScrollReveal();
    const statsRef = useScrollReveal();
    const testRef = useScrollReveal();
    const ctaRef = useScrollReveal();

    return (
        <>
            <Navbar />
            <main>
                {/* ── Hero ── */}
                <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04]" />
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/8 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-secondary/8 rounded-full blur-[100px]" />
                    <div ref={heroRef} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32 lg:py-40">
                        <div className="max-w-3xl">
                            <span className="fade-up inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                {p.heroBadge}
                            </span>
                            <h1 className="fade-up fade-up-delay-1 text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-5xl lg:text-6xl leading-[1.1]">
                                {p.heroHeading1}<br />
                                <span className="gradient-text">{p.heroHeading2}</span>
                            </h1>
                            <p className="fade-up fade-up-delay-2 mt-6 text-lg leading-relaxed text-[#475569] dark:text-[#94A3B8] max-w-xl">
                                {p.heroDesc}
                            </p>
                            <div className="fade-up fade-up-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
                                <a href="/#pricing" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                                    {p.heroCta1}
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </a>
                                <a href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">
                                    {p.heroCta2}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Features ── */}
                <section className="py-24 lg:py-32 bg-background">
                    <div ref={featRef} className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="fade-up inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">{p.featuresBadge}</span>
                            <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl whitespace-pre-line">{p.featuresHeading}</h2>
                            <p className="fade-up fade-up-delay-2 mt-4 text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">{p.featuresDesc}</p>
                        </div>
                        <div className="fade-up fade-up-delay-3 mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {p.features.map((f: { title: string; desc: string }, i: number) => (
                                <div key={i} className="group rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorMap[featureColors[i]]} text-2xl transition-transform group-hover:scale-110`}>{featureIcons[i]}</span>
                                    <h3 className="mt-5 text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">{f.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section className="py-20 bg-gradient-to-r from-primary to-secondary">
                    <div ref={statsRef} className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="fade-up grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                            {p.stats.map((s: { value: string; label: string }, i: number) => (
                                <div key={i}>
                                    <p className="text-4xl font-bold tracking-tight">{s.value}</p>
                                    <p className="mt-2 text-sm font-medium text-white/70">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ── */}
                <section className="py-24 lg:py-32 bg-section-alt">
                    <div ref={testRef} className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="fade-up inline-block rounded-full bg-tertiary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tertiary">{p.testimonialsBadge}</span>
                            <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl">{p.testimonialsHeading}</h2>
                        </div>
                        <div className="fade-up fade-up-delay-2 mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {p.testimonials.map((tm: { quote: string; name: string; role: string }, i: number) => (
                                <div key={i} className="rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] p-8 transition-all hover:shadow-lg">
                                    <p className="text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1] italic">&ldquo;{tm.quote}&rdquo;</p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <Image src={avatars[i]} alt={tm.name} width={40} height={40} className="rounded-full object-cover h-10 w-10" unoptimized />
                                        <div>
                                            <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">{tm.name}</p>
                                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{tm.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="py-24 lg:py-32 bg-background">
                    <div ref={ctaRef} className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                        <h2 className="fade-up text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                            {p.ctaHeading1}<br /><span className="gradient-text">{p.ctaHeading2}</span>
                        </h2>
                        <p className="fade-up fade-up-delay-1 mt-6 text-lg text-[#475569] dark:text-[#94A3B8]">{p.ctaDesc}</p>
                        <div className="fade-up fade-up-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="/#pricing" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">{p.ctaCta1}</a>
                            <a href="/#contact" className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-4 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">{p.ctaCta2}</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
