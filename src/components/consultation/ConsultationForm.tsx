"use client";

import { useState } from "react";
import { usePageAnalytics, useFormAnalytics } from "@/hooks/useAnalytics";
import { consultationContent } from "@/lib/consultationContent";
import { EMAIL_RE } from "@/server/validators/_fields";

interface Props {
    locale: "id" | "en";
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ConsultationForm({ locale }: Props) {
    const c = consultationContent[locale].form;
    const { trackSubmit } = useFormAnalytics();
    usePageAnalytics(
        typeof window !== "undefined" ? window.location.pathname : "",
        "consultation"
    );

    const [values, setValues] = useState({
        name: "",
        company: "",
        phone: "",
        email: "",
        need: "",
        budget: "none",
        message: "",
    });
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState("");

    const set = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setValues((v) => ({ ...v, [field]: e.target.value }));
    };

    const emailValid = EMAIL_RE.test(values.email);
    const requiredFilled =
        values.name.trim() && values.company.trim() && values.phone.trim() && values.email.trim() && values.need;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!emailValid) {
            setError(
                locale === "id" ? "Isi email yang valid." : "Please enter a valid email."
            );
            return;
        }
        if (!requiredFilled) {
            setError(
                locale === "id"
                    ? "Lengkapi semua field yang wajib, kecuali budget dan catatan."
                    : "Please fill in all required fields except budget and notes."
            );
            return;
        }

        setStatus("submitting");
        trackSubmit();
        try {
            const res = await fetch("/api/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name.trim(),
                    company: values.company.trim(),
                    phone: values.phone.trim(),
                    email: values.email.trim(),
                    need: values.need,
                    budget_range: values.budget === "none" ? undefined : values.budget,
                    message: values.message.trim() || undefined,
                    locale,
                    source: "landing-konsultasi",
                }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || "submit_failed");
            }
            setStatus("success");
        } catch (err: unknown) {
            setStatus("error");
            setError(
                err instanceof Error && err.message === "too_many_requests"
                    ? locale === "id"
                        ? "Terlalu banyak permintaan. Coba lagi dalam beberapa menit."
                        : "Too many requests. Please try again in a few minutes."
                    : locale === "id"
                      ? "Gagal mengirim. Coba lagi atau hubungi kami."
                      : "Failed to submit. Please try again or contact us."
            );
        }
    };

    if (status === "success") {
        return (
            <div
                id="consultation-form"
                className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[0.04]"
            >
                <svg
                    className="mx-auto h-10 w-10 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
                    {c.success.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {c.success.body}
                </p>
            </div>
        );
    }

    return (
        <form id="consultation-form" onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {c.fields.name.label} <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder={c.fields.name.placeholder}
                    value={values.name}
                    onChange={set("name")}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-[#0c74eb] focus:ring-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {c.fields.company.label} <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder={c.fields.company.placeholder}
                    value={values.company}
                    onChange={set("company")}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-[#0c74eb] focus:ring-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {c.fields.phone.label} <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
                        {c.fields.phone.prefix}
                    </span>
                    <input
                        type="tel"
                        inputMode="tel"
                        placeholder={c.fields.phone.placeholder}
                        value={values.phone}
                        onChange={set("phone")}
                        required
                        className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-[#0c74eb] focus:ring-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {c.fields.email.label} <span className="text-rose-500">*</span>
                </label>
                <input
                    type="email"
                    placeholder={c.fields.email.placeholder}
                    value={values.email}
                    onChange={set("email")}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-[#0c74eb] focus:ring-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {c.fields.need.label} <span className="text-rose-500">*</span>
                </label>
                <select
                    value={values.need}
                    onChange={set("need")}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-[#0c74eb] focus:ring-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                >
                    <option value="">{c.fields.need.placeholder}</option>
                    {c.needOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {c.fields.budget.label}
                </label>
                <select
                    value={values.budget}
                    onChange={set("budget")}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-[#0c74eb] focus:ring-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                >
                    {c.budgetOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {c.fields.message.label}
                </label>
                <textarea
                    placeholder={c.fields.message.placeholder}
                    value={values.message}
                    onChange={set("message")}
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-[#0c74eb] focus:ring-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
                type="submit"
                disabled={status === "submitting" || !emailValid || !requiredFilled}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0c74eb] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0a5dbc] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {status === "submitting" ? (
                    <svg
                        className="-ml-1 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" />
                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                ) : null}
                {c.submit}
            </button>

            <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                {c.hint}
            </p>
        </form>
    );
}
