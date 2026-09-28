import Link from "next/link";
import { consultationContent } from "@/lib/consultationContent";

interface Props {
    locale: "id" | "en";
}

export default function ConsultationHero({ locale }: Props) {
    const c = consultationContent[locale].hero;
    return (
        <section className="bg-slate-50 py-20 text-slate-950 dark:bg-[#0B1120] dark:text-white">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <p className="text-xs uppercase tracking-widest text-sky-700 dark:text-sky-300">
                    {c.eyebrow}
                </p>
                <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                    {c.headline}
                </h1>
                <p className="mt-6 text-balance text-lg leading-7 text-slate-600 dark:text-slate-300">
                    {c.subhead}
                </p>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{c.trust}</p>
                <Link
                    href="#consultation-form"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#0c74eb] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0a5dbc]"
                >
                    {c.cta}
                </Link>
            </div>
        </section>
    );
}
