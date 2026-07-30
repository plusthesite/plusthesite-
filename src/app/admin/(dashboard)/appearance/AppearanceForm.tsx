"use client";

import { useActionState, useState } from "react";
import { saveAppearance, type AppearanceState } from "./actions";

const DEFAULT_P = "#2563eb";
const DEFAULT_S = "#7c3aed";
const DEFAULT_T = "#0d9488";

const PRESETS: { name: string; p: string; s: string; t: string }[] = [
  { name: "plus. Blue", p: "#2563eb", s: "#7c3aed", t: "#0d9488" },
  { name: "Emerald", p: "#059669", s: "#0d9488", t: "#65a30d" },
  { name: "Rose", p: "#e11d48", s: "#f43f5e", t: "#db2777" },
  { name: "Indigo / Sky", p: "#4f46e5", s: "#0284c7", t: "#0891b2" },
  { name: "Sunset", p: "#ea580c", s: "#db2777", t: "#f59e0b" },
  { name: "Royal", p: "#7c3aed", s: "#2563eb", t: "#9333ea" },
  { name: "Forest", p: "#16a34a", s: "#65a30d", t: "#0d9488" },
  { name: "Midnight", p: "#0ea5e9", s: "#6366f1", t: "#8b5cf6" },
];

const field =
  "h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-mono uppercase focus:border-sky-400 focus:outline-none";

export function AppearanceForm({
  initialPrimary,
  initialSecondary,
  initialTertiary,
}: {
  initialPrimary: string;
  initialSecondary: string;
  initialTertiary: string;
}) {
  const [state, action, pending] = useActionState<AppearanceState, FormData>(
    saveAppearance,
    {},
  );
  const [primary, setPrimary] = useState(initialPrimary || DEFAULT_P);
  const [secondary, setSecondary] = useState(initialSecondary || DEFAULT_S);
  const [tertiary, setTertiary] = useState(initialTertiary || DEFAULT_T);
  const gradient = `linear-gradient(135deg, ${primary}, ${secondary})`;

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        {state.ok && (
          <div className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
            Tersimpan dan langsung aktif. Refresh tab situs publik untuk melihat
            warna baru.
          </div>
        )}
        {state.error && (
          <div className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">
            {state.error}
          </div>
        )}

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Preset palette
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                title={preset.name}
                onClick={() => {
                  setPrimary(preset.p);
                  setSecondary(preset.s);
                  setTertiary(preset.t);
                }}
                className={`h-9 rounded-xl ring-2 ring-offset-1 transition ${
                  primary === preset.p &&
                  secondary === preset.s &&
                  tertiary === preset.t
                    ? "ring-slate-900"
                    : "ring-transparent hover:ring-slate-300"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${preset.p}, ${preset.s} 60%, ${preset.t})`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Primary
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={primary}
                onChange={(event) => setPrimary(event.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-200"
              />
              <input
                name="primary_color"
                value={primary}
                onChange={(event) => setPrimary(event.target.value)}
                className={field}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Secondary
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={secondary}
                onChange={(event) => setSecondary(event.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-200"
              />
              <input
                name="secondary_color"
                value={secondary}
                onChange={(event) => setSecondary(event.target.value)}
                className={field}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Accent
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={tertiary}
                onChange={(event) => setTertiary(event.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-200"
              />
              <input
                name="tertiary_color"
                value={tertiary}
                onChange={(event) => setTertiary(event.target.value)}
                className={field}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            disabled={pending}
            className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {pending ? "Menyimpan..." : "Simpan & Terapkan"}
          </button>
          <button
            type="submit"
            name="reset"
            value="1"
            disabled={pending}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Reset ke default
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Diterapkan ke seluruh situs publik. Aman dan bisa di-reset kapan saja.
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Live preview
        </p>
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-sm">
          <div className="space-y-4 p-8">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{ background: `${primary}1a`, color: primary }}
            >
              Global Digital AI-gency
            </span>
            <h3 className="text-2xl font-extrabold leading-tight text-slate-900">
              Build Smarter Brands.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: gradient }}
              >
                Faster.
              </span>
            </h3>
            <p className="text-sm text-slate-500">
              AI chatbots, branding, apps, and CRM in one place.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
                style={{ background: gradient }}
              >
                See What We Build
              </span>
              <span
                className="rounded-full border-2 px-5 py-2.5 text-sm font-semibold"
                style={{ borderColor: primary, color: primary }}
              >
                View Pricing
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: `${tertiary}1a`, color: tertiary }}
              >
                New
              </span>
            </div>
            <div className="flex gap-2 pt-3">
              {[primary, secondary, tertiary].map((color, index) => (
                <span
                  key={index}
                  className="h-8 w-8 rounded-xl"
                  style={{ background: color }}
                />
              ))}
              <span
                className="h-8 flex-1 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${secondary} 60%, ${tertiary})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
