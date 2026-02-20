"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
    { icon: "🎵", title: "Text to Music", desc: "Describe the mood, genre, and instruments — AI composes a full track in seconds. From lo-fi beats to orchestral scores.", color: "primary" as const },
    { icon: "🎸", title: "Genre Mastery", desc: "Pop, rock, jazz, EDM, classical, hip-hop — 50+ genres with authentic style. Mix genres for unique hybrid sounds.", color: "secondary" as const },
    { icon: "🎛️", title: "Smart Mixing", desc: "AI-powered mastering and mixing. Professional-quality audio output ready for streaming, ads, or video production.", color: "tertiary" as const },
    { icon: "🎤", title: "Vocal Synthesis", desc: "Generate realistic vocals and harmonies in multiple languages. Perfect for demos, prototypes, and content creation.", color: "primary" as const },
    { icon: "🔁", title: "Stem Separation", desc: "Split any track into vocals, drums, bass, and melody. Remix, sample, and create derivative works effortlessly.", color: "secondary" as const },
    { icon: "🔌", title: "API Integration", desc: "Text-to-Music generation API for seamless integration into your apps, games, and content creation workflows.", color: "tertiary" as const },
];
const stats = [
    { value: "1M+", label: "Tracks Generated" },
    { value: "50+", label: "Genres" },
    { value: "< 10s", label: "Generation Time" },
    { value: "HQ WAV", label: "Output Quality" },
];
const testimonials = [
    { quote: "We replaced our entire stock music library. Every video now gets a custom soundtrack that perfectly matches the mood.", name: "Jake Morrison", role: "Video Producer, StoryLab", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80&auto=format" },
    { quote: "As an indie game dev, custom music was always out of budget. Now I generate unique soundtracks for every level.", name: "Dewi Lestari", role: "Indie Dev, PixelForge", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80&auto=format" },
    { quote: "The API integration was seamless. Our podcast platform now auto-generates intro music for every new show.", name: "Ryan Kim", role: "CTO, PodcastPro", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80&auto=format" },
];
const colorMap = { primary: "bg-primary/10 text-primary", secondary: "bg-secondary/10 text-secondary", tertiary: "bg-tertiary/10 text-tertiary" };

function HeroSection() {
    const ref = useScrollReveal();
    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04]" />
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-500/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-violet-500/8 rounded-full blur-[100px]" />
            <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32 lg:py-40">
                <div className="max-w-3xl">
                    <span className="fade-up inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> AI Music Generator
                    </span>
                    <h1 className="fade-up fade-up-delay-1 text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-5xl lg:text-6xl leading-[1.1]">
                        Create Music<br /><span className="gradient-text">From Words</span>
                    </h1>
                    <p className="fade-up fade-up-delay-2 mt-6 text-lg leading-relaxed text-[#475569] dark:text-[#94A3B8] max-w-xl">
                        Create music generated using text. Text-to-Music generation API for seamless integration and engaging audio content creation.
                    </p>
                    <div className="fade-up fade-up-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
                        <a href="/studio" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                            Generate Music Free <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </a>
                        <a href="/#pricing" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">View Pricing</a>
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
                    <span className="fade-up inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">Capabilities</span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">Music Creation<br />Without Limits</h2>
                    <p className="fade-up fade-up-delay-2 mt-4 text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">Professional-quality music at your fingertips, no instruments or training required.</p>
                </div>
                <div className="fade-up fade-up-delay-3 mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, i) => (
                        <div key={i} className="group rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorMap[f.color]} text-2xl transition-transform group-hover:scale-110`}>{f.icon}</span>
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
        <section className="py-20 bg-gradient-to-r from-pink-500 to-violet-600">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="fade-up grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((s, i) => (<div key={i}><p className="text-4xl font-bold tracking-tight">{s.value}</p><p className="mt-2 text-sm font-medium text-white/70">{s.label}</p></div>))}
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
                    <span className="fade-up inline-block rounded-full bg-tertiary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tertiary">Testimonials</span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl">Music Makers Love It</h2>
                </div>
                <div className="fade-up fade-up-delay-2 mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1120] p-8 transition-all hover:shadow-lg">
                            <p className="text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1] italic">&ldquo;{t.quote}&rdquo;</p>
                            <div className="mt-6 flex items-center gap-3">
                                <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full object-cover h-10 w-10" unoptimized />
                                <div><p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">{t.name}</p><p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.role}</p></div>
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
                <h2 className="fade-up text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">Start Making<br /><span className="gradient-text">Music Today</span></h2>
                <p className="fade-up fade-up-delay-1 mt-6 text-lg text-[#475569] dark:text-[#94A3B8]">No musical training needed. Describe your vision, let AI compose the rest.</p>
                <div className="fade-up fade-up-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/studio" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">Open Music Studio</a>
                    <a href="/#pricing" className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-4 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">See Pricing</a>
                </div>
            </div>
        </section>
    );
}

export default function AIMusicGeneratorPage() {
    return (<><Navbar /><main><HeroSection /><FeaturesSection /><StatsSection /><TestimonialsSection /><CTASection /></main><Footer /></>);
}
