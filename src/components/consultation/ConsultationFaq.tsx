import { consultationContent } from "@/lib/consultationContent";

interface Props {
    locale: "id" | "en";
}

export default function ConsultationFaq({ locale }: Props) {
    const c = consultationContent[locale].faq;
    return (
        <section className="bg-white py-16 text-slate-950 dark:bg-[#0B1120] dark:text-white">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <h2 className="text-2xl font-semibold tracking-tight">{c.title}</h2>
                <div className="mt-8 space-y-3">
                    {c.items.map((item, i) => (
                        <details
                            key={i}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm open:bg-[#0c74eb] open:text-white open:shadow dark:border-white/10 dark:bg-white/[0.04]"
                        >
                            <summary className="flex cursor-pointer items-center gap-3 font-medium">
                                <span className="rounded-full bg-sky-100 text-[#0c74eb] dark:bg-sky-400/10 dark:text-sky-300">
                                    {i + 1}
                                </span>
                                {item.q}
                            </summary>
                            <p className="mt-2 leading-6 opacity-90">{item.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
