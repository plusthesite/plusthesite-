"use client";

import { useMemo, useState } from "react";
import { renderTemplate, TEMPLATES } from "@/lib/templates";

export function QuickMessage({
  name,
  phone,
  email,
  company,
  service,
  locale,
}: {
  name: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  service: string | null;
  locale: "en" | "id";
}) {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].templateId);
  const template =
    TEMPLATES.find((item) => item.templateId === templateId) ?? TEMPLATES[0];

  const rendered = useMemo(
    () => renderTemplate(template, { name, company, service, locale }),
    [template, name, company, service, locale],
  );

  const [body, setBody] = useState(rendered.body);
  const [lastTemplateId, setLastTemplateId] = useState(templateId);
  if (lastTemplateId !== templateId) {
    setLastTemplateId(templateId);
    setBody(rendered.body);
  }

  const whatsappDigits = phone?.replace(/[^\d]/g, "");
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(body)}`
    : null;
  const mailHref = email
    ? `mailto:${email}?subject=${encodeURIComponent(rendered.subject)}&body=${encodeURIComponent(body)}`
    : null;

  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Quick message
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Pick a template, personalize fast, then send or copy.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {TEMPLATES.map((item) => (
          <button
            key={item.templateId}
            onClick={() => setTemplateId(item.templateId)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              item.templateId === templateId
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={6}
        className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 transition-all focus:border-sky-400 focus:bg-white focus:outline-none"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            WhatsApp
          </a>
        ) : (
          <span className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">
            No phone
          </span>
        )}
        {mailHref ? (
          <a
            href={mailHref}
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
          >
            Email
          </a>
        ) : (
          <span className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">
            No email
          </span>
        )}
        <button
          onClick={() => {
            navigator.clipboard?.writeText(body);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
