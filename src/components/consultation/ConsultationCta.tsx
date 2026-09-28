import Link from "next/link";
import { consultationContent } from "@/lib/consultationContent";

interface Props {
    locale: "id" | "en";
}

export default function ConsultationCta({ locale }: Props) {
    const c = consultationContent[locale].cta;
    return (
        <section className="bg-slate-50 py-16 text-slate-950 dark:bg-[#0B1120] dark:text-white">
            <div className="mx-auto max-w-5xl rounded-[1.5rem] border border-slate-200 px-8 py-12 text-center dark:border-white/10">
                <h2 className="text-2xl font-semibold tracking-tight">{c.headline}</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{c.sub}</p>
                <Link
                    href={`mailto:timespace@plus.com`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#0c74eb] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a5dbc]"
                >
                    {c.cta}
                </Link>
            </div>
        </section>
    );
}
