"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ── Data ── */

const features = [
    {
        icon: "🖼️",
        title: "Text to Image",
        desc: "Describe what you imagine and watch it come to life. Powered by OpenAI, Stable Diffusion, and Stability AI — 100+ models combined.",
        color: "primary" as const,
    },
    {
        icon: "🎨",
        title: "Style Transfer",
        desc: "Transform any image into different artistic styles — oil painting, watercolor, anime, photorealistic, and dozens more.",
        color: "secondary" as const,
    },
    {
        icon: "📐",
        title: "Smart Upscale",
        desc: "Enhance resolution up to 4x without losing quality. AI fills in missing details for crystal-clear results every time.",
        color: "tertiary" as const,
    },
    {
        icon: "🔄",
        title: "Batch Generation",
        desc: "Generate hundreds of variations in one click. Perfect for A/B testing ads, social media campaigns, and product mockups.",
        color: "primary" as const,
    },
    {
        icon: "🧹",
        title: "Background Removal",
        desc: "One-click background removal with AI precision. Perfect edges even on complex subjects like hair and transparent objects.",
        color: "secondary" as const,
    },
    {
        icon: "🔌",
        title: "API Access",
        desc: "Integrate image generation directly into your apps and workflows. RESTful API with SDKs for Python, Node.js, and more.",
        color: "tertiary" as const,
    },
];

const stats = [
    { value: "10M+", label: "Images Generated" },
    { value: "100+", label: "AI Models" },
    { value: "< 5s", label: "Generation Time" },
    { value: "4K", label: "Max Resolution" },
];

const testimonials = [
    {
        quote: "We replaced our entire stock photo subscription. The AI generates exactly what we need for every campaign — on brand, every time.",
        name: "Lisa Wang",
        role: "Creative Director, BrandLab",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80&auto=format",
    },
    {
        quote: "Batch generation saved our e-commerce team weeks of work. 500 product mockups in different styles, generated in minutes.",
        name: "Budi Santoso",
        role: "Marketing Lead, TokoDigital",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80&auto=format",
    },
    {
        quote: "The API integration was seamless. Our users can now generate custom thumbnails directly in our platform.",
        name: "Priya Sharma",
        role: "CTO, ContentFlow",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format",
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
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04]" />
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-rose-500/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-orange-500/8 rounded-full blur-[100px]" />
            <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32 lg:py-40">
                <div className="max-w-3xl">
                    <span className="fade-up inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        AI Image Generator
                    </span>
                    <h1 className="fade-up fade-up-delay-1 text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-5xl lg:text-6xl leading-[1.1]">
                        Imagine It,<br />
                        <span className="gradient-text">Create It</span>
                    </h1>
                    <p className="fade-up fade-up-delay-2 mt-6 text-lg leading-relaxed text-[#475569] dark:text-[#94A3B8] max-w-xl">
                        Create beautiful art with artificial intelligence. Three APIs integrated: OpenAI, Stable Diffusion, and Stability AI — 100+ models combined.
                    </p>
                    <div className="fade-up fade-up-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
                        <a href="/studio" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                            Try Generator Free
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </a>
                        <a href="/#pricing" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">
                            View Pricing
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
                    <span className="fade-up inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
                        Capabilities
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                        Create Without<br />Limits
                    </h2>
                    <p className="fade-up fade-up-delay-2 mt-4 text-base leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                        Professional-grade image tools powered by the world&apos;s best AI models.
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
        <section className="py-20 bg-gradient-to-r from-rose-500 to-orange-500">
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
                        Testimonials
                    </span>
                    <h2 className="fade-up fade-up-delay-1 mt-5 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl">
                        Creators Love It
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
                    Start Creating<br /><span className="gradient-text">Stunning Visuals</span>
                </h2>
                <p className="fade-up fade-up-delay-1 mt-6 text-lg text-[#475569] dark:text-[#94A3B8]">
                    No design skills needed. Just describe your vision and let AI do the rest.
                </p>
                <div className="fade-up fade-up-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/studio" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                        Open Generator
                    </a>
                    <a href="/#pricing" className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-4 text-sm font-semibold hover:scale-105 transition-all text-[#0F172A] dark:text-white">
                        See Pricing
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ── Page ── */

export default function AIImageGeneratorPage() {
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
