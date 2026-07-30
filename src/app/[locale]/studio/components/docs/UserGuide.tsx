import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Eye,
  HelpCircle,
  Pause,
  Play,
  PlayCircle,
  Sparkles,
  Wand2,
} from "lucide-react";
import { MOCK_FAQ, MOCK_TUTORIALS } from "@/lib/mockData";

export const UserGuide: React.FC<{ onStartTour: (tab: string) => void }> = ({
  onStartTour,
}) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="animate-in space-y-8 fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-100 to-cyan-100 p-8 dark:border-white/10 dark:from-sky-500/20 dark:to-cyan-500/10">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
              Halo, ada yang bisa kami bantu?
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Pelajari cara menggunakan PLUS secara maksimal dengan tur
              interaktif dan video tutorial singkat.
            </p>
          </div>
          <div className="relative z-10 flex gap-3">
            <button
              onClick={() => onStartTour("planner")}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-sky-700 shadow-lg transition-colors hover:bg-slate-50"
            >
              <Sparkles size={16} /> Mulai Tur Planner
            </button>
            <button
              onClick={() => onStartTour("generator")}
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-slate-800"
            >
              <Wand2 size={16} /> Tur Generator
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
            <PlayCircle size={20} className="text-sky-600 dark:text-sky-300" />{" "}
            Video Tutorial
          </h3>

          <div className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
            {activeVideo ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-sky-900/20 to-cyan-900/20" />
                <div className="relative z-10 text-center">
                  <h4 className="mb-2 text-xl font-bold text-white">
                    {
                      MOCK_TUTORIALS.find((video) => video.id === activeVideo)
                        ?.title
                    }
                  </h4>
                  <div className="flex items-center justify-center gap-4">
                    <button className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
                      <ArrowRight size={20} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="rounded-full bg-white p-4 text-black transition-transform hover:scale-110"
                    >
                      <Pause size={24} fill="currentColor" />
                    </button>
                    <button className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">
                    Simulasi Pemutar Video
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                  <div className="h-full w-1/3 bg-rose-500" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                <p className="text-sm text-slate-500">
                  Pilih video di bawah untuk memutar
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {MOCK_TUTORIALS.map((video) => (
              <button
                key={video.id}
                onClick={() => setActiveVideo(video.id)}
                className={`group overflow-hidden rounded-xl border text-left transition-all ${
                  activeVideo === video.id
                    ? "border-sky-500 ring-1 ring-sky-500"
                    : "border-slate-200 hover:border-sky-400/60 dark:border-white/10 dark:hover:border-white/30"
                }`}
              >
                <div
                  className={`relative flex aspect-video flex-col justify-end bg-gradient-to-br ${video.thumbnail} p-3`}
                >
                  <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/0" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-black/50 p-2 backdrop-blur">
                      <Play size={16} className="text-white" fill="white" />
                    </div>
                  </div>
                  <span className="relative z-10 ml-auto rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    {video.duration}
                  </span>
                </div>
                <div className="bg-white p-3 dark:bg-slate-900/50">
                  <h5 className="line-clamp-2 text-xs font-bold leading-snug text-slate-800 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300">
                    {video.title}
                  </h5>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                    <Eye size={10} /> {video.views} views
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
            <HelpCircle
              size={20}
              className="text-emerald-500 dark:text-emerald-400"
            />{" "}
            FAQ
          </h3>
          <div className="space-y-3">
            {MOCK_FAQ.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800/30"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {item.q}
                  </span>
                  {openFAQ === index ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 pb-4 pt-0 text-xs leading-relaxed text-slate-500 dark:border-white/5 dark:bg-black/20 dark:text-slate-400">
                    <div className="pt-3">{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-500/30 dark:bg-sky-900/20">
            <p className="mb-2 text-xs text-sky-600 dark:text-sky-300">
              Butuh bantuan lebih lanjut?
            </p>
            <Link
              href="mailto:plusthesite@gmail.com"
              className="block w-full rounded-lg bg-slate-950 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-slate-800"
            >
              Hubungi Support CS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
