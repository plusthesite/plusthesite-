"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useT, useLocale } from "@/i18n/I18nProvider";

type Status = "idle" | "sending" | "success" | "error" | "invalid";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
    const t = useT();
    const locale = useLocale();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const value = email.trim().toLowerCase();

        if (!EMAIL_RE.test(value)) {
            setStatus("invalid");
            return;
        }

        setStatus("sending");

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: value, locale }),
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const message =
        status === "success"
            ? t.newsletter.success
            : status === "error"
              ? t.newsletter.error
              : status === "invalid"
                ? t.newsletter.invalid
                : "";

    return (
        <div className="rounded-[2rem] border border-footer-border bg-[linear-gradient(135deg,_rgba(255,255,255,0.08)_0%,_rgba(255,255,255,0.03)_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-footer-muted">
                        Signal inbox
                    </p>
                    <p className="mt-3 text-xl font-semibold text-footer-text">
                        {t.newsletter.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-footer-muted">
                        {t.newsletter.subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-footer-muted">
                    <span className="rounded-full border border-footer-border/80 bg-white/5 px-3 py-1.5">
                        {locale === "id" ? "Insight produk" : "Product insights"}
                    </span>
                    <span className="rounded-full border border-footer-border/80 bg-white/5 px-3 py-1.5">
                        {locale === "id" ? "Update workflow" : "Workflow updates"}
                    </span>
                    <span className="rounded-full border border-footer-border/80 bg-white/5 px-3 py-1.5">
                        {locale === "id" ? "Ritme launching" : "Launch rhythm"}
                    </span>
                </div>
            </div>

            <form onSubmit={submit} className="mt-6 flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            if (status !== "idle") {
                                setStatus("idle");
                            }
                        }}
                        placeholder={t.newsletter.placeholder}
                        aria-label={t.newsletter.placeholder}
                        className="w-full rounded-full border border-footer-border bg-white/10 px-5 py-3.5 pr-12 text-sm text-footer-text placeholder-footer-muted outline-none transition-colors focus:border-footer-text"
                    />
                    {status === "success" ? (
                        <CheckCircle2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                    ) : null}
                </div>

                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-footer-text px-6 py-3.5 text-sm font-semibold text-footer-bg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                    <span>{status === "sending" ? t.newsletter.sending : t.newsletter.button}</span>
                    <ArrowRight className="h-4 w-4" />
                </button>
            </form>

            {message ? (
                <p
                    className={`mt-3 text-xs font-medium ${
                        status === "success" ? "text-emerald-400" : "text-rose-400"
                    }`}
                >
                    {message}
                </p>
            ) : null}
        </div>
    );
}
