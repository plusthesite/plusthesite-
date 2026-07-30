"use client";

import Link from "next/link";
import {
    ArrowRight,
    Bot,
    Cloud,
    ImagePlus,
    Lightbulb,
    Megaphone,
    Music4,
    PenTool,
    Video,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale, useT } from "@/i18n/I18nProvider";

const toolIcons = [ImagePlus, PenTool, Bot, Video, Music4];
const toolAccents = [
    "bg-pink-100 text-pink-700 dark:bg-pink-400/10 dark:text-pink-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    "bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
    "bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
] as const;
const serviceIcons = [Cloud, Megaphone, Lightbulb];

export default function AIFeatures() {
    const ref = useScrollReveal();
    const t = useT();
    const locale = useLocale();
    const f = t.aiFeatures.items;
    const s = t.aiFeatures.services;

    const aiFeatures = [
        { title: f.image.title, description: f.image.description, href: `/${locale}/ai-image-generator` },
        { title: f.text.title, description: f.text.description, href: `/${locale}/ai-text-generator` },
        { title: f.chat.title, description: f.chat.description, href: `/${locale}/chat-bot` },
        { title: f.video.title, description: f.video.description, href: `/${locale}/ai-video-generator` },
        { title: f.music.title, description: f.music.description, href: `/${locale}/ai-music-generator` },
    ];

    const services = [
        { title: s.cloud.title, description: s.cloud.description },
        { title: s.marketing.title, description: s.marketing.description },
        { title: s.innovative.title, description: s.innovative.description },
    ];

    return (
        <section id="features" className="bg-[#f7f5ef] py-24 text-slate-950 lg:py-32 dark:bg-slate-950 dark:text-white">
            <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
                    <div className="max-w-2xl">
                        <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">
                            {t.aiFeatures.tag}
                        </p>
                        <h2 className="fade-up fade-up-delay-1 mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-white">
                            {t.aiFeatures.title}
                        </h2>
                        <p className="fade-up fade-up-delay-2 mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
                            {t.aiFeatures.description}
                        </p>
                    </div>

                    <div className="fade-up fade-up-delay-2 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-950 p-5 text-white dark:bg-white/10">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-200">
                                    AI stack
                                </p>
                                <p className="mt-4 text-3xl font-semibold tracking-tight">5 tools</p>
                                <p className="mt-2 text-sm leading-6 text-white/72">
                                    Image, text, chat, video, and music tools arranged as one connected creative layer.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-white/5">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Good fit
                                </p>
                                <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                                    Teams that need more output without more chaos.
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    Built for operators who need repeatable creative speed, not novelty for its own sake.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fade-up fade-up-delay-3 mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                    {aiFeatures.map((feature, index) => {
                        const Icon = toolIcons[index];
                        const accent = toolAccents[index];

                        return (
                            <Link
                                key={feature.title}
                                href={feature.href}
                                className="group flex min-h-[250px] flex-col rounded-[1.6rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04]"
                            >
                                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-10 text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {feature.description}
                                </p>
                                <div className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-slate-950 dark:text-white">
                                    <span>{locale === "id" ? "Lihat detail" : "See details"}</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-24">
                    <div className="max-w-3xl">
                        <p className="fade-up text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                            {t.aiFeatures.servicesTag}
                        </p>
                        <h3 className="fade-up fade-up-delay-1 mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                            {t.aiFeatures.servicesTitle}
                        </h3>
                    </div>

                    <div className="fade-up fade-up-delay-2 mt-12 grid gap-5 md:grid-cols-3">
                        {services.map((service, index) => {
                            const Icon = serviceIcons[index];

                            return (
                                <div
                                    key={service.title}
                                    className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/[0.04]"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <h4 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
                                        {service.title}
                                    </h4>
                                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                        {service.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
