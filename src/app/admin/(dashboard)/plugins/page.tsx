import { requireRole } from "@/lib/role";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Plugin {
  name: string;
  description: string;
  version: string;
  author: string;
  active: boolean;
  note?: string;
}

export default async function PluginsPage() {
  await requireRole(["admin"]);

  const supabaseOn = isSupabaseConfigured();
  const aiOn = !!process.env.GEMINI_API_KEY;
  const placesOn = !!process.env.GOOGLE_MAPS_API_KEY;

  const plugins: Plugin[] = [
    {
      name: "Supabase / Database & Auth",
      description:
        "Postgres database, RLS, session handling, and admin authentication.",
      version: "2.x",
      author: "Supabase",
      active: supabaseOn,
      note: supabaseOn
        ? undefined
        : "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
    },
    {
      name: "Google Gemini AI",
      description: "Powers the chatbot and AI generation surfaces.",
      version: "1.x",
      author: "Google",
      active: aiOn,
      note: aiOn ? undefined : "Set GEMINI_API_KEY",
    },
    {
      name: "Google Places Lead Importer",
      description:
        "Imports real local businesses into the CRM via Places API workflows.",
      version: "1.0",
      author: "plus.",
      active: placesOn,
      note: placesOn
        ? undefined
        : "Set GOOGLE_MAPS_API_KEY then run scripts/import-places-leads.mjs",
    },
    {
      name: "Blog CMS",
      description:
        "Create, edit, publish, and import posts across static and DB content.",
      version: "1.1",
      author: "plus.",
      active: true,
    },
    {
      name: "CRM Pipeline",
      description:
        "Leads, opportunities, outreach helpers, and admin reporting.",
      version: "1.0",
      author: "plus.",
      active: true,
    },
    {
      name: "SEO & AI Search Kit",
      description: "Sitemap, llms.txt, robots, OG images, and structured data.",
      version: "1.0",
      author: "plus.",
      active: true,
    },
    {
      name: "i18n (EN / ID)",
      description: "URL-based bilingual content with locale-aware routing.",
      version: "1.0",
      author: "plus.",
      active: true,
    },
    {
      name: "Netlify / Hosting & SSR",
      description:
        "Production hosting, API routes, server rendering, and deploy infra.",
      version: "5.x",
      author: "Netlify",
      active: true,
    },
  ];

  const activeCount = plugins.filter((plugin) => plugin.active).length;
  const inactiveCount = plugins.length - activeCount;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Platform modules
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Integrations and built-in modules that keep plus running day to
              day.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Ini bukan plugin marketplace, tapi peta modul inti dan integrasi
              nyata yang menopang CRM, content, AI, SEO, dan hosting.
            </p>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Active
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {activeCount}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
                Needs setup
              </p>
              <p className="mt-3 text-3xl font-black text-amber-700">
                {inactiveCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {plugins.map((plugin) => (
          <article
            key={plugin.name}
            className={`rounded-[1.75rem] border bg-white/95 p-5 shadow-sm ${
              plugin.active ? "border-slate-200/80" : "border-amber-200/80"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{plugin.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {plugin.description}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Version {plugin.version} / By {plugin.author}
                </p>
                {plugin.note && (
                  <p className="mt-2 text-xs text-amber-700">{plugin.note}</p>
                )}
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  plugin.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {plugin.active ? "Active" : "Inactive"}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
