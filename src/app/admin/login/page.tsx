"use client";

import { useState } from "react";
import { ArrowRight, BarChart3, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const supabase = createSupabaseBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });
            if (error) {
                setError(error.message || "Login failed");
                return;
            }

            // Force a fresh server request so middleware can read the session
            // cookie before the protected dashboard renders.
            window.location.assign("/admin");
        } catch (err) {
            console.error("Admin login failed", err);
            setError(
                "Tidak dapat terhubung ke layanan login. Periksa koneksi atau konfigurasi Supabase."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[100dvh] bg-[#f4f7fb] text-slate-950">
            <div className="mx-auto grid min-h-[100dvh] w-full max-w-6xl items-center gap-10 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
                <section className="hidden lg:block">
                    <div className="mb-16 text-2xl font-extrabold tracking-tight">
                        plus<span className="text-blue-600">.</span>
                    </div>

                    <div className="max-w-xl">
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Admin workspace
                        </p>
                        <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950">
                            Operate leads, content, and customers from one calm desk.
                        </h1>
                        <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                            Secure dashboard for the plus team. Built for daily work, not decoration.
                        </p>
                    </div>

                    <div className="mt-12 max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Today</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">Pipeline overview</p>
                            </div>
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="grid grid-cols-3 gap-3 pt-4">
                            {[
                                ["42", "Leads"],
                                ["18", "Tasks"],
                                ["7", "Priority"],
                            ].map(([value, label]) => (
                                <div key={label} className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
                                    <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-md">
                    <div className="mb-8 text-center lg:hidden">
                        <div className="text-2xl font-extrabold tracking-tight">
                            plus<span className="text-blue-600">.</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">Admin workspace</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
                        <div className="mb-7">
                            <p className="text-sm font-medium text-blue-700">Secure sign in</p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                                Welcome back.
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Use your admin account to continue.
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pl-10 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="admin@plusthe.site"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pl-10 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="Password"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium leading-5 text-rose-700">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </form>

                        <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
                            Authorized administrators only.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
