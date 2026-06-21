"use client";

import { useActionState, useState } from "react";
import { saveAppearance, type AppearanceState } from "./actions";

const DEFAULT_P = "#2563eb";
const DEFAULT_S = "#7c3aed";

const PRESETS: { name: string; p: string; s: string }[] = [
    { name: "plus. Blue", p: "#2563eb", s: "#7c3aed" },
    { name: "Emerald", p: "#059669", s: "#0d9488" },
    { name: "Rose", p: "#e11d48", s: "#f43f5e" },
    { name: "Indigo / Sky", p: "#4f46e5", s: "#0284c7" },
    { name: "Sunset", p: "#ea580c", s: "#db2777" },
    { name: "Royal", p: "#7c3aed", s: "#2563eb" },
    { name: "Forest", p: "#16a34a", s: "#65a30d" },
    { name: "Midnight", p: "#0ea5e9", s: "#6366f1" },
];

const field = "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-mono uppercase focus:border-blue-400 focus:outline-none";

export function AppearanceForm({ initialPrimary, initialSecondary }: { initialPrimary: string; initialSecondary: string }) {
    const [state, action, pending] = useActionState<AppearanceState, FormData>(saveAppearance, {});
    const [p, setP] = useState(initialPrimary || DEFAULT_P);
    const [s, setS] = useState(initialSecondary || DEFAULT_S);
    const grad = `linear-gradient(135deg, ${p}, ${s})`;

    return (
        <form action={action} className="grid gap-6 lg:grid-cols-2">
            {/* Controls */}
            <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {state.ok && <div className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">✅ Tersimpan & langsung aktif! Refresh tab situs publik untuk melihat warna baru.</div>}
                {state.error && <div className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">{state.error}</div>}

                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Preset palette</p>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                        {PRESETS.map((pre) => (
                            <button type="button" key={pre.name} title={pre.name} onClick={() => { setP(pre.p); setS(pre.s); }}
                                className={`h-9 rounded-lg ring-2 ring-offset-1 transition ${p === pre.p && s === pre.s ? "ring-slate-900" : "ring-transparent hover:ring-slate-300"}`}
                                style={{ background: `linear-gradient(135deg, ${pre.p}, ${pre.s})` }} />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary</label>
                        <div className="mt-1 flex gap-2">
                            <input type="color" value={p} onChange={(e) => setP(e.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200" />
                            <input name="primary_color" value={p} onChange={(e) => setP(e.target.value)} className={field} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Secondary</label>
                        <div className="mt-1 flex gap-2">
                            <input type="color" value={s} onChange={(e) => setS(e.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200" />
                            <input name="secondary_color" value={s} onChange={(e) => setS(e.target.value)} className={field} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <button disabled={pending} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{pending ? "Menyimpan…" : "Simpan & Terapkan"}</button>
                    <button type="submit" name="reset" value="1" disabled={pending} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Reset ke default</button>
                </div>
                <p className="text-xs text-slate-400">Diterapkan ke seluruh situs publik (tombol, gradient, aksen). Aman & bisa di-reset kapan saja.</p>
            </div>

            {/* Live preview */}
            <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Live preview</p>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="space-y-4 p-8">
                        <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: `${p}1a`, color: p }}>Global Digital AI-gency</span>
                        <h3 className="text-2xl font-extrabold leading-tight text-slate-900">
                            Build Smarter Brands.{" "}
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage: grad }}>Faster.</span>
                        </h3>
                        <p className="text-sm text-slate-500">AI chatbots, branding, apps, and CRM — in one place.</p>
                        <div className="flex flex-wrap gap-3 pt-1">
                            <span className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg" style={{ background: grad }}>See What We Build</span>
                            <span className="rounded-full border-2 px-5 py-2.5 text-sm font-semibold" style={{ borderColor: p, color: p }}>View Pricing</span>
                        </div>
                        <div className="flex gap-2 pt-3">
                            {[p, s].map((c, i) => <span key={i} className="h-8 w-8 rounded-lg" style={{ background: c }} />)}
                            <span className="h-8 flex-1 rounded-lg" style={{ background: grad }} />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
