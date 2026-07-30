"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useT, useLocale } from "@/i18n/I18nProvider";
import { SERVICES, ACTIVE_SERVICES, serviceName } from "@/lib/services";

function getInitialService() {
    if (typeof window === "undefined") return "";
    const slug = new URLSearchParams(window.location.search).get("service");
    return slug && SERVICES.some((item) => item.slug === slug) ? slug : "";
}

export default function ContactUsPage() {
    const t = useT();
    const locale = useLocale();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [phone, setPhone] = useState("");
    const [service, setService] = useState(getInitialService);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatus("error");
            setErrorMessage(t.contact.requiredFields);
            return;
        }

        setStatus("loading");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, company, phone, service, message, locale }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setName("");
                setEmail("");
                setCompany("");
                setPhone("");
                setService("");
                setMessage("");
            } else {
                setStatus("error");
                setErrorMessage(data.error || t.contact.submitError);
            }
        } catch {
            setStatus("error");
            setErrorMessage(t.contact.networkError);
        }
    };

    const fieldClassName =
        "mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:bg-slate-900";

    return (
        <>
            <Navbar />
            <main className="relative overflow-hidden bg-[#f5f4ef] pb-16 pt-28 dark:bg-slate-950 lg:pt-36">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.10),_transparent_20%)]" />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
                        <div className="max-w-2xl">
                            <Link
                                href={`/${locale}`}
                                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 transition-colors hover:text-sky-900 dark:text-sky-300 dark:hover:text-white"
                            >
                                <svg
                                    className="h-3 w-3 rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                                {t.contact.backToHome}
                            </Link>

                            <h1 className="mt-7 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl dark:text-white">
                                {t.contact.title}{" "}
                                <span className="text-sky-700 dark:text-sky-300">
                                    {t.contact.titleHighlight}
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
                                {t.contact.subtitle}
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white dark:bg-white/10">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                                        Response flow
                                    </p>
                                    <p className="mt-4 text-lg font-semibold">
                                        {locale === "id"
                                            ? "Masuk ke tim yang tepat lebih cepat."
                                            : "Get routed to the right team faster."}
                                    </p>
                                </div>

                                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                        Good for
                                    </p>
                                    <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                                        {locale === "id"
                                            ? "Scope baru, penawaran, atau exploratory call."
                                            : "New scopes, proposals, or exploratory calls."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-slate-900/85">
                            {status === "success" ? (
                                <div className="py-10 text-center">
                                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                        <svg
                                            className="h-7 w-7"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                                        {t.contact.successTitle}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        {t.contact.successMessage}
                                    </p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-8 rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                                    >
                                        {t.contact.sendAnother}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    {status === "error" ? (
                                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-800/30 dark:bg-rose-950/20 dark:text-rose-400">
                                            <strong>{t.contact.errorLabel} </strong>
                                            {errorMessage}
                                        </div>
                                    ) : null}

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            >
                                                {t.contact.nameLabel} <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                disabled={status === "loading"}
                                                value={name}
                                                onChange={(event) => setName(event.target.value)}
                                                className={fieldClassName}
                                                placeholder={t.contact.namePlaceholder}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            >
                                                {t.contact.emailLabel} <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                disabled={status === "loading"}
                                                value={email}
                                                onChange={(event) => setEmail(event.target.value)}
                                                className={fieldClassName}
                                                placeholder={t.contact.emailPlaceholder}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="company"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                        >
                                            {t.contact.companyLabel}{" "}
                                            <span className="font-normal text-slate-400">
                                                ({t.contact.optional})
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            disabled={status === "loading"}
                                            value={company}
                                            onChange={(event) => setCompany(event.target.value)}
                                            className={fieldClassName}
                                            placeholder={t.contact.companyPlaceholder}
                                        />
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="service"
                                                className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            >
                                                {t.contact.serviceLabel}
                                            </label>
                                            <select
                                                id="service"
                                                disabled={status === "loading"}
                                                value={service}
                                                onChange={(event) => setService(event.target.value)}
                                                className={fieldClassName}
                                            >
                                                <option value="">{t.contact.serviceGeneral}</option>
                                                {ACTIVE_SERVICES.map((item) => (
                                                    <option key={item.slug} value={item.slug}>
                                                        {serviceName(item.slug, locale)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            >
                                                {t.contact.phoneLabel}{" "}
                                                <span className="font-normal text-slate-400">
                                                    ({t.contact.optional})
                                                </span>
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                disabled={status === "loading"}
                                                value={phone}
                                                onChange={(event) => setPhone(event.target.value)}
                                                className={fieldClassName}
                                                placeholder={t.contact.phonePlaceholder}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                        >
                                            {t.contact.messageLabel} <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={5}
                                            disabled={status === "loading"}
                                            value={message}
                                            onChange={(event) => setMessage(event.target.value)}
                                            className={`${fieldClassName} rounded-[1.5rem]`}
                                            placeholder={t.contact.messagePlaceholder}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <svg
                                                    className="h-5 w-5 animate-spin text-white dark:text-slate-950"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                {t.contact.sending}
                                            </>
                                        ) : (
                                            t.contact.submitButton
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
