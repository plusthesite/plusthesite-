"use client";

import { useMemo, useState } from "react";
import { TEMPLATES, renderTemplate } from "@/lib/templates";

export function QuickMessage({
    name, phone, email, company, service, locale,
}: {
    name: string | null;
    phone: string | null;
    email: string | null;
    company: string | null;
    service: string | null;
    locale: "en" | "id";
}) {
    const [tplId, setTplId] = useState(TEMPLATES[0].templateId);
    const tpl = TEMPLATES.find((t) => t.templateId === tplId) ?? TEMPLATES[0];

    const rendered = useMemo(
        () => renderTemplate(tpl, { name, company, service, locale }),
        [tpl, name, company, service, locale]
    );
    const [body, setBody] = useState(rendered.body);

    // Reset the editable body whenever the template changes.
    const [lastTpl, setLastTpl] = useState(tplId);
    if (lastTpl !== tplId) { setLastTpl(tplId); setBody(rendered.body); }

    const waDigits = phone?.replace(/[^\d]/g, "");
    const waHref = waDigits ? `https://wa.me/${waDigits}?text=${encodeURIComponent(body)}` : null;
    const mailHref = email ? `mailto:${email}?subject=${encodeURIComponent(rendered.subject)}&body=${encodeURIComponent(body)}` : null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Quick message</h2>

            <div className="mt-3 flex flex-wrap gap-1.5">
                {TEMPLATES.map((t) => (
                    <button
                        key={t.templateId}
                        onClick={() => setTplId(t.templateId)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${t.templateId === tplId ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />

            <div className="mt-3 flex flex-wrap gap-2">
                {waHref ? (
                    <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.497A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.239 0-4.332-.726-6.033-1.96l-.422-.312-2.644.887.886-2.637-.322-.434A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                        WhatsApp
                    </a>
                ) : (
                    <span className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">No phone</span>
                )}
                {mailHref ? (
                    <a href={mailHref} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Email
                    </a>
                ) : (
                    <span className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">No email</span>
                )}
                <button
                    onClick={() => { navigator.clipboard?.writeText(body); }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy
                </button>
            </div>
        </div>
    );
}
