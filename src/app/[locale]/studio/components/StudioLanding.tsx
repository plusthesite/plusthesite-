"use client";

import React, { useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Wand2,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { useLocale } from "@/i18n/I18nProvider";

const COPY = {
  en: {
    badge: "New workspace: Strategy, creative, and growth in one flow",
    title: "Your AI Growth Desk,\nNot Just Another Tool",
    subtitle:
      "PLUS Studio helps small teams plan campaigns, generate visuals, repurpose assets, and move from idea to launch without jumping across five tabs.",
    ctaPrimary: "Open Studio",
    ctaDemo: "Talk to Our Team",
    login: "Sign In",
    studio: "Studio",
    proofLabel: "Trusted workflow",
    proofValue:
      "One workspace for planning, visual production, and launch prep.",
    stats: [
      { value: "8", label: "core tools" },
      { value: "< 10m", label: "from brief to draft" },
      { value: "1 flow", label: "strategy to output" },
    ],
    pills: [
      "Planner Campaign",
      "Generator Visual",
      "Mesin Repurpose",
      "Toolkit Growth",
    ],
    checklist: [
      "Build monthly campaign plans in minutes",
      "Generate on-brand visuals faster",
      "Turn one idea into multiple content formats",
    ],
    previewTitle: "Today's launch board",
    previewEyebrow: "Live workspace",
    previewItems: [
      "Campaign brief approved",
      "3 visual drafts generated",
      "Repurpose pack ready for posting",
    ],
    previewFoot: "Everything stays in one working rhythm.",
  },
  id: {
    badge: "Workspace baru: strategi, kreatif, dan growth dalam satu alur",
    title: "Meja Kerja AI untuk Growth,\nBukan Sekadar Tool",
    subtitle:
      "PLUS Studio membantu tim kecil menyusun campaign, membuat visual, mengolah ulang aset, dan bergerak dari ide ke eksekusi tanpa pindah-pindah lima tab.",
    ctaPrimary: "Masuk ke Studio",
    ctaDemo: "Ngobrol dengan Tim Kami",
    login: "Masuk",
    studio: "Studio",
    proofLabel: "Alur kerja tepercaya",
    proofValue:
      "Satu workspace untuk planning, produksi visual, dan persiapan launch.",
    stats: [
      { value: "8", label: "tool inti" },
      { value: "< 10 mnt", label: "dari brief ke draft" },
      { value: "1 alur", label: "dari strategi ke output" },
    ],
    pills: [
      "Campaign Planner",
      "Visual Generator",
      "Repurpose Engine",
      "Growth Toolkit",
    ],
    checklist: [
      "Susun rencana campaign bulanan dalam hitungan menit",
      "Buat visual yang konsisten dengan brand lebih cepat",
      "Ubah satu ide menjadi banyak format konten",
    ],
    previewTitle: "Launch board hari ini",
    previewEyebrow: "Workspace aktif",
    previewItems: [
      "Brief campaign sudah disetujui",
      "3 draft visual berhasil dibuat",
      "Paket repurpose siap diposting",
    ],
    previewFoot: "Semua kerja tetap rapi dalam satu ritme.",
  },
} as const;

export const StudioLanding: React.FC<{
  onStart: () => void;
  onLoginClick: () => void;
}> = ({ onStart, onLoginClick }) => {
  const { theme } = useTheme();
  const locale = useLocale();
  const c = COPY[locale] ?? COPY.en;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      document.querySelectorAll(".parallax").forEach((element) => {
        const speed = parseFloat(
          (element as HTMLElement).getAttribute("data-speed") || "1",
        );
        const x = (window.innerWidth - event.pageX * speed) / 100;
        const y = (window.innerHeight - event.pageY * speed) / 100;
        (element as HTMLElement).style.transform =
          `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef6fb_48%,_#f8fafc_100%)] text-slate-950 transition-colors duration-500 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#020617_100%)] dark:text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="parallax absolute left-[4%] top-[8%] h-[34vw] w-[34vw] rounded-full bg-sky-500/12 blur-[130px] dark:bg-sky-500/10"
          data-speed="2"
        />
        <div
          className="parallax absolute bottom-[8%] right-[8%] h-[28vw] w-[28vw] rounded-full bg-cyan-400/10 blur-[120px] dark:bg-cyan-400/8"
          data-speed="-1.4"
        />
        <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo
            variant={theme === "dark" ? "light" : "dark"}
            size="default"
            href={`/${locale}/studio`}
          />
          <span className="mt-1 rounded-full border border-sky-200 bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-sky-300">
            {c.studio}
          </span>
        </div>
        <button
          onClick={onLoginClick}
          className="rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
        >
          {c.login}
        </button>
      </nav>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-14 px-6 pb-14 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20">
        <section className="max-w-3xl">
          <div className="inline-flex animate-in slide-in-from-top-4 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md duration-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
            {c.badge}
          </div>

          <h1 className="mt-7 animate-in zoom-in-95 whitespace-pre-line text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-slate-950 duration-700 delay-100 md:text-6xl xl:text-7xl dark:text-white">
            {c.title}
          </h1>

          <p className="mt-6 max-w-2xl animate-in fade-in text-lg leading-8 text-slate-600 duration-700 delay-200 dark:text-slate-300">
            {c.subtitle}
          </p>

          <div className="mt-9 flex animate-in slide-in-from-bottom-8 flex-col gap-3 duration-700 delay-300 sm:flex-row">
            <button
              onClick={onStart}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-base font-bold text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              {c.ctaPrimary}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <a
              href="mailto:plusthesite@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/75 px-7 py-4 text-base font-bold text-slate-800 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <PlayCircle size={18} />
              {c.ctaDemo}
            </a>
          </div>

          <div className="mt-10 animate-in fade-in rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_70px_rgba(148,163,184,0.12)] backdrop-blur-xl duration-700 delay-500 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                {c.proofLabel}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {c.proofValue}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {c.stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/40"
                >
                  <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex animate-in fade-in flex-wrap gap-3 duration-700 delay-700">
            {c.pills.map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <Wand2 size={12} className="text-sky-600 dark:text-sky-300" />
                {pill}
              </span>
            ))}
          </div>
        </section>

        <section className="animate-in slide-in-from-right-8 duration-700 delay-200">
          <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/85 p-4 shadow-[0_35px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white dark:border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
                    {c.previewEyebrow}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {c.previewTitle}
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {locale === "id" ? "Aktif" : "Live"}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {c.previewItems.map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-2xl border border-white/10 p-4 ${
                      index === 1 ? "bg-sky-500/20" : "bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-white/10 p-2">
                        <CheckCircle2 className="h-4 w-4 text-sky-200" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {item}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {index === 0 &&
                            (locale === "id"
                              ? "Strategi sudah final dan siap masuk produksi."
                              : "Strategy locked, ready for production.")}
                          {index === 1 &&
                            (locale === "id"
                              ? "Output kreatif sudah selaras dengan campaign aktif."
                              : "Creative output aligned with the active campaign.")}
                          {index === 2 &&
                            (locale === "id"
                              ? "Aset distribusi sudah antre untuk gelombang posting berikutnya."
                              : "Distribution assets queued for the next publish wave.")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 p-4 text-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900/70">
                  {locale === "id" ? "Catatan operator" : "Operator note"}
                </p>
                <p className="mt-2 text-sm font-semibold">{c.previewFoot}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {c.checklist.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600/10 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                    <Sparkles size={16} />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
