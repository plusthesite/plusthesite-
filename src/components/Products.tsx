"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Zap } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/i18n/I18nProvider";
import { studioUrl } from "@/lib/studio";

const unsplash = (id: string) =>
    `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

export default function Products() {
    const ref = useScrollReveal();
    const locale = useLocale();
    const isID = locale === "id";
    const trackRef = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const syncEdges = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setAtStart(el.scrollLeft <= 8);
        setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 8);
    }, []);

    // One "page" is one regular card plus the gap, read off the DOM so the
    // arrows stay in step with the responsive card width.
    const step = (direction: -1 | 1) => {
        const el = trackRef.current;
        if (!el) return;
        const card = el.children[1] as HTMLElement | undefined;
        const distance = card ? card.offsetWidth + 20 : el.clientWidth;
        el.scrollBy({ left: direction * distance, behavior: "smooth" });
    };

    const landingMail = `mailto:official@plusthe.site?subject=${encodeURIComponent(
        isID ? "Pesan 1 Day Ready Business Landing Page" : "1 Day Ready Business Landing Page order"
    )}`;

    const featuredPoints = isID
        ? [
              "Satu halaman, rapi di HP dan desktop",
              "Copy yang menjelaskan bisnis Anda dalam 5 detik",
              "Tombol WhatsApp, email, dan form leads siap pakai",
              "Live dalam 1 hari kerja setelah materi lengkap",
          ]
        : [
              "One page, sharp on phone and desktop",
              "Copy that explains your business in 5 seconds",
              "WhatsApp, email, and lead form buttons ready to go",
              "Live within 1 business day once your materials are in",
          ];

    const cards = [
        {
            href: `/${locale}/chat-bot`,
            title: "AI Chat Bot",
            image: unsplash("1611746872915-64382b5c76da"),
            alt: isID ? "Aplikasi chat di layar ponsel" : "Chat apps on a phone screen",
            description: isID
                ? "Balas setiap pelanggan dalam hitungan detik di WhatsApp dan website, 24 jam sehari."
                : "Answer every customer in seconds on WhatsApp and the website, around the clock.",
        },
        {
            href: studioUrl(locale),
            title: "plus. Studio",
            image: unsplash("1626785774573-4b799315345d"),
            alt: isID ? "Antarmuka plus. Studio" : "plus. Studio interface",
            description: isID
                ? "Ruang kerja AI untuk brief, konten, dan aset kampanye dalam satu alur tim."
                : "An AI workspace for briefs, content, and campaign assets in one team flow.",
        },
        {
            href: `/${locale}/crm`,
            title: "CRM",
            image: unsplash("1460925895917-afdab827c52f"),
            alt: isID ? "Dasbor analitik penjualan di laptop" : "Sales analytics dashboard on a laptop",
            description: isID
                ? "Semua prospek, follow-up, dan angka penjualan di satu dasbor."
                : "Every lead, follow-up, and sales number on one dashboard.",
        },
        {
            href: `/${locale}/digital-agency`,
            title: "Digital Agency",
            image: unsplash("1561070791-2526d30994b5"),
            alt: isID ? "Palet warna dan sketsa desain brand" : "Color swatches and brand design sketches",
            description: isID
                ? "Branding, konten, dan kampanye yang membuat brand Anda mudah diingat."
                : "Branding, content, and campaigns that make your brand easy to remember.",
        },
        {
            href: `/${locale}/mobile-app`,
            title: "Mobile App",
            image: unsplash("1531403009284-440f080d1e12"),
            alt: isID ? "Wireframe aplikasi mobile di papan" : "Mobile app wireframes on a board",
            description: isID
                ? "Aplikasi Android dan iOS, dari wireframe sampai rilis di store."
                : "Android and iOS apps, from wireframe to store release.",
        },
        {
            href: `/${locale}/customer-support`,
            title: "Customer Support",
            image: unsplash("1534536281715-e28d76689b4d"),
            alt: isID ? "Telepon klasik di atas meja" : "Classic telephone on a desk",
            description: isID
                ? "Tim dan sistem support yang menjaga pelanggan tetap puas."
                : "Support people and systems that keep customers happy.",
        },
        {
            href: `/${locale}/mobile-game`,
            title: "Mobile Game",
            image: unsplash("1550745165-9bc0b252726f"),
            alt: isID ? "Konsol dan perangkat game retro" : "Retro game consoles and gear",
            description: isID
                ? "Game mobile untuk brand activation atau produk mandiri."
                : "Mobile games for brand activation or as a standalone product.",
        },
    ];

    return (
        <section
            id="products"
            className="scroll-mt-20 bg-[#f5f5f5] pb-16 pt-16 text-slate-950 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28 dark:bg-slate-900 dark:text-white"
        >
            <div ref={ref} className="mx-auto w-full max-w-[1440px]">
                <div className="fade-up mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-xs dark:bg-white dark:text-slate-950">
                        2
                    </span>
                    <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-[13px] dark:border-white/20">
                        {isID ? "Pilihan produk" : "Our products"}
                    </span>
                </div>

                <div className="mb-10 flex flex-col gap-6 px-5 sm:mb-12 sm:px-8 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:px-12">
                    <div className="max-w-3xl">
                        <h2 className="fade-up fade-up-delay-1 text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[clamp(2.5rem,5vw,4.2rem)]">
                            {isID ? "Pilih yang bisnis Anda butuhkan hari ini." : "Pick what your business needs today."}
                        </h2>
                        <p className="fade-up fade-up-delay-2 mt-5 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                            {isID
                                ? "Mulai dari landing page yang siap dalam sehari, lalu tambah chatbot, CRM, atau aplikasi saat bisnis Anda tumbuh. Harga kami bahas langsung sesuai kebutuhan."
                                : "Start with a landing page that's ready in a day, then add a chatbot, CRM, or app as you grow. Pricing is worked out with you, based on what you need."}
                        </p>
                    </div>

                    <div className="fade-up fade-up-delay-2 hidden gap-2 lg:flex">
                        <button
                            type="button"
                            onClick={() => step(-1)}
                            disabled={atStart}
                            aria-label={isID ? "Produk sebelumnya" : "Previous products"}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 transition-colors hover:bg-slate-900 hover:text-white disabled:pointer-events-none disabled:opacity-30 dark:border-white/20 dark:hover:bg-white dark:hover:text-slate-950"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => step(1)}
                            disabled={atEnd}
                            aria-label={isID ? "Produk berikutnya" : "Next products"}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 transition-colors hover:bg-slate-900 hover:text-white disabled:pointer-events-none disabled:opacity-30 dark:border-white/20 dark:hover:bg-white dark:hover:text-slate-950"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Every card shares one image height so the rail reads as a
                    single row; only the featured card is wider. */}
                <div
                    ref={trackRef}
                    onScroll={syncEdges}
                    className="fade-up fade-up-delay-3 rail-track flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-4 sm:scroll-px-8 sm:px-8 lg:scroll-px-12 lg:px-12"
                >
                    <article className="relative min-h-[460px] w-[88%] shrink-0 snap-start overflow-hidden rounded-2xl bg-slate-950 text-white sm:h-[440px] sm:w-[620px] lg:w-[680px]">
                        <Image
                            src={unsplash("1547658719-da2b51169166")}
                            alt={isID ? "Desain landing page di layar monitor" : "Landing page design on a monitor"}
                            fill
                            sizes="(max-width: 640px) 88vw, 680px"
                            className="object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />

                        <div className="relative flex h-full min-h-[460px] flex-col justify-end p-6 sm:min-h-0 sm:p-8">
                            <span className="mb-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0c74eb] px-3 py-1 text-xs font-semibold">
                                <Zap className="h-3.5 w-3.5" />
                                {isID ? "Produk unggulan" : "Featured product"}
                            </span>

                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                                1 Day Ready Business Landing Page
                            </p>
                            <h3 className="mt-2 text-[1.65rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2rem]">
                                {isID ? "Brief hari ini, website bisnis Anda live besok." : "Brief us today, your business site is live tomorrow."}
                            </h3>
                            <p className="mt-3 hidden max-w-lg text-sm leading-6 text-white/75 sm:block">
                                {isID
                                    ? "Calon pelanggan mencari Anda di Google sebelum menghubungi. Beri mereka satu halaman yang meyakinkan dan langsung mengarah ke chat dengan Anda."
                                    : "Customers look you up before they reach out. Give them one convincing page that leads straight to a conversation with you."}
                            </p>

                            <ul className="mt-4 grid gap-1.5 text-[13px] text-white/85 sm:grid-cols-2 sm:gap-x-5">
                                {featuredPoints.map((point) => (
                                    <li key={point} className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300" />
                                        {point}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={landingMail}
                                className="group mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-medium text-slate-950 transition-colors hover:bg-sky-100"
                            >
                                {isID ? "Pesan landing page" : "Order your landing page"}
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0c74eb] transition-transform duration-500 group-hover:-rotate-45">
                                    <ArrowRight className="h-3.5 w-3.5 text-white" />
                                </span>
                            </a>
                        </div>
                    </article>

                    {cards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="group flex w-[72%] shrink-0 snap-start flex-col sm:w-[300px] lg:w-[320px]"
                        >
                            <div className="relative h-[300px] overflow-hidden rounded-2xl bg-slate-200 sm:h-[320px] dark:bg-slate-800">
                                <Image
                                    src={card.image}
                                    alt={card.alt}
                                    fill
                                    sizes="(max-width: 640px) 72vw, 320px"
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
                                />
                                <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:-rotate-45">
                                    <ArrowUpRight className="h-4 w-4" />
                                </span>
                            </div>
                            <p className="mt-4 text-[15px] font-semibold text-slate-900 dark:text-white">
                                {card.title}
                            </p>
                            <p className="mt-1 text-[13px] leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                {card.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
