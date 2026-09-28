import { consultationContent } from "@/lib/consultationContent";

interface Props {
    locale: "id" | "en";
}

export default function ConsultationAgenda({ locale }: Props) {
    const c = consultationContent[locale].agenda;
    return (
        <section className="bg-slate-50 py-16 text-slate-950 dark:bg-[#0B1120] dark:text-white">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <h2 className="text-2xl font-semibold tracking-tight">{c.title}</h2>
                <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{c.intro}</p>

                {/* Desktop: table */}
                <div className="mt-10 hidden overflow-x-auto lg:block">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    {locale === "id" ? "Langkah" : "Step"}
                                </th>
                                <th className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    {locale === "id" ? "Apa yang terjadi" : "What happens"}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                            {c.items.map((item) => (
                                <tr key={item.step}>
                                    <td className="py-4 text-sm font-medium text-slate-900 dark:text-white">
                                        {item.step}
                                    </td>
                                    <td className="py-4">
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {item.title}
                                        </span>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                            {item.desc}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile: native accordion */}
                <div className="mt-6 space-y-3 lg:hidden">
                    {c.items.map((item) => (
                        <details
                            key={item.step}
                            className="rounded-xl border border-slate-200 bg-white open:bg-[#0c74eb] open:text-white dark:border-white/10 dark:bg-white/[0.04] open:dark:bg-[#0c74eb]"
                        >
                            <summary className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[#0c74eb] dark:bg-sky-400/10 dark:text-sky-300 open:bg-white open:text-[#0c74eb]">
                                    {item.step}
                                </span>
                                {item.title}
                            </summary>
                            <p className="px-4 pb-3 text-sm leading-6 opacity-90">
                                {item.desc}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
