import { consultationContent } from "@/lib/consultationContent";

interface Props {
    locale: "id" | "en";
}

export default function ConsultationProblems({ locale }: Props) {
    const c = consultationContent[locale].problems;
    return (
        <section className="bg-white py-16 text-slate-950 dark:bg-[#0B1120] dark:text-white">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <h2 className="text-2xl font-semibold tracking-tight">{c.title}</h2>
                <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{c.intro}</p>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {c.items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-[1.25rem] border border-slate-200 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[0.03]"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-[#0c74eb] dark:bg-sky-400/10 dark:text-sky-300">
                                <span className="text-xs font-bold">{item.id}</span>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
