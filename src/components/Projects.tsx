"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/i18n/I18nProvider";
import { studioUrl } from "@/lib/studio";

export default function Projects() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const isID = locale === "id";

    const cards = [
        {
            href: studioUrl(locale),
            title: "plus. Studio",
            image:
                "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80&auto=format",
            alt: isID ? "Antarmuka plus. Studio" : "plus. Studio interface",
            aspect: "aspect-[329/246]",
            surface: "bg-[#1a1d2e]",
            description: isID
                ? "Ruang kerja AI untuk brief, konten, dan aset kampanye, semua dalam satu alur tim."
                : "An AI workspace for briefs, content, and campaign assets, all in one team flow.",
            label: isID ? "Lihat detail" : "Learn more",
            width: "group-hover:w-[152px]",
            tone: "light" as const,
        },
        {
            href: `/${locale}/chat-bot`,
            title: "AI Chat Bot",
            image:
                "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&q=80&auto=format",
            alt: isID ? "Percakapan chatbot AI" : "AI chatbot conversation",
            aspect: "aspect-square",
            surface: "bg-[#6b6b6b]",
            description: isID
                ? "Balas setiap pelanggan dalam hitungan detik di WhatsApp dan website, 24 jam sehari."
                : "Answer every customer in seconds on WhatsApp and the website, around the clock.",
            label: isID ? "Lihat produk" : "View product",
            width: "group-hover:w-[164px]",
            tone: "dark" as const,
        },
    ];

    return (
        <section
            id="work"
            className="bg-[#f5f5f5] pb-16 pt-16 text-slate-950 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28 dark:bg-slate-900 dark:text-white"
        >
            <div ref={ref} className="mx-auto w-full max-w-[1440px]">
                <div className="fade-up mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-xs dark:bg-white dark:text-slate-950">
                        2
                    </span>
                    <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-[13px] dark:border-white/20">
                        {isID ? "Karya pilihan" : "Featured work"}
                    </span>
                </div>

                <h2 className="fade-up fade-up-delay-1 mb-10 px-5 text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] sm:mb-14 sm:px-8 sm:text-[clamp(2.5rem,5vw,4.2rem)] lg:mb-16 lg:px-12">
                    {isID ? "Karya kami" : "Our projects"}
                </h2>

                <div className="fade-up fade-up-delay-2 grid grid-cols-1 gap-5 px-5 sm:gap-6 sm:px-8 md:grid-cols-2 lg:gap-7 lg:px-12">
                    {cards.map((card) => (
                        <div key={card.title}>
                            <Link
                                href={card.href}
                                className={`group relative block ${card.aspect} ${card.surface} overflow-hidden rounded-2xl`}
                            >
                                <Image
                                    src={card.image}
                                    alt={card.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
                                />

                                <span
                                    className={`absolute bottom-4 left-4 flex h-9 w-9 items-center overflow-hidden rounded-full transition-all duration-300 ease-in-out ${card.width} ${
                                        card.tone === "light"
                                            ? "bg-white text-slate-900"
                                            : "bg-slate-900 text-white"
                                    }`}
                                >
                                    <span className="ml-4 whitespace-nowrap text-[13px] font-medium opacity-0 transition-opacity duration-300 delay-100 group-hover:opacity-100">
                                        {card.label}
                                    </span>
                                    <span className="absolute right-2 flex h-5 w-5 items-center justify-center">
                                        {card.tone === "light" ? (
                                            <Link2 className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                                        ) : (
                                            <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                                        )}
                                    </span>
                                </span>
                            </Link>

                            <p className="mt-4 text-[13px] leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                {card.description}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-[15px] dark:text-white">
                                {card.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
