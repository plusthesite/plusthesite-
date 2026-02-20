"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
    { icon: "🎬", title: "Text to Video", desc: "Describe your scene in words and get a professional video in minutes. AI handles scripting, visuals, and transitions automatically.", color: "primary" as const },
    { icon: "🧑‍💼", title: "AI Avatars", desc: "Lifelike digital presenters that speak any language. Perfect for training videos, product demos, and personalized content.", color: "secondary" as const },
    { icon: "✂️", title: "Smart Editing", desc: "AI-powered cuts, transitions, and color grading. Turn raw footage into polished content with a single click.", color: "tertiary" as const },
    { icon: "📝", title: "Auto Subtitles", desc: "Accurate captions in 50+ languages with perfect timing. Boost accessibility and engagement across all platforms.", color: "primary" as const },
    { icon: "🎵", title: "Background Music", desc: "AI-curated soundtracks that match your video's mood. Royalty-free music generated to perfectly complement your content.", color: "secondary" as const },
    { icon: "📱", title: "Multi-Format Export", desc: "One video, every platform. Auto-resize for YouTube, TikTok, Instagram Reels, and LinkedIn — all at once.", color: "tertiary" as const },
];
const stats = [
    { value: "2M+", label: "Videos Created" },
    { value: "50+", label: "Languages" },
    { value: "< 3min", label: "Avg Generation" },
    { value: "4K HDR", label: "Max Quality" },
];
const testimonials = [
    { quote: "We produce 20 product videos a week now — something that used to take our entire team a month.", name: "Carlos Mendez", role: "Head of Content, ShopVid", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format" },
    { quote: "The AI avatar feature lets us create training videos in 12 languages without hiring a single voice actor.", name: "Anisa Rahma", role: "L&D Manager, EduTech Asia", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format" },
    { quote: "Auto-subtitles with 98% accuracy. We no longer need to manually caption our YouTube and TikTok content.", name: "Tom Barrett", role: "Creator, BarrettMedia", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format" },
];
const colorMap = { primary: "bg-primary/10 text-primary", secondary: "bg-secondary/10 text-secondary", tertiary: "bg-tertiary/10 text-tertiary" };

function HeroSection() {
    const ref = useScrollReveal();
    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04]" />
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-purple-500/8 rounded-full blur-[100px]" />
            <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32 lg:py-40">
                <div className="max-w-3xl">
                    <span className="fade-up inline-flex items-center gap-2 rounded-full bg-tertiary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tertiary mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" /> AI Video Generator
                    </span>
                    <h1 className="fade-up fade-up-delay-1 text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-5xl lg:text-6xl leading-[1.1]">
                        AI Video That<br /><span className="gradient-text">Works While You Sleep</span>
                    </h1>
                    <p className="fade-up fade-up-delay-2 mt-6 text-lg leading-relaxed text-[#475569] dark:text-[#94A3B8] max-w-xl">
                        Text-to-Video generation for seamless integration and engaging multimedia content. Create professional videos in minutes, not days.
                    </p>
                    <div className="fade-up fade-up-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
                        <a href="/studio" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                            Create Your First Video <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
                    <span className="fade-up inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">Capabilities</span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">Video Production<br />Reimagined</h2>
                    <p className="fade-up fade-up-delay-2 mt-4 text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">From script to final cut — AI handles every step of the video creation process.</p>
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
        <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
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
                    <span className="fade-up inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">Testimonials</span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl">Creators Love It</h2>
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
                <h2 className="fade-up text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">Create Professional<br /><span className="gradient-text">Videos in Minutes</span></h2>
                <p className="fade-up fade-up-delay-1 mt-6 text-lg text-[#475569] dark:text-[#94A3B8]">No camera, no crew, no editing skills required. Just your ideas and AI.</p>
                <div className="fade-up fade-up-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/studio" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">Start Creating</a>
                    <a href="/#pricing" className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-4 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">See Pricing</a>
                </div>
            </div>
        </section>
    );
}

export default function AIVideoGeneratorPage() {
    return (<><Navbar /><main><HeroSection /><FeaturesSection /><StatsSection /><TestimonialsSection /><CTASection /></main><Footer /></>);
}
