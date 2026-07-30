import { requireRole } from "@/lib/role";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function Health({
  label,
  ok,
  hint,
}: {
  label: string;
  ok: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <div>
        <span className="text-slate-700">{label}</span>
        {!ok && hint && (
          <span className="ml-2 text-xs text-amber-600">{hint}</span>
        )}
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        }`}
      >
        {ok ? "Connected" : "Not configured"}
      </span>
    </div>
  );
}

export default async function SettingsPage() {
  await requireRole(["admin"]);

  const supabaseOn = isSupabaseConfigured();
  const aiOn = !!process.env.GEMINI_API_KEY;
  const placesOn = !!process.env.GOOGLE_MAPS_API_KEY;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700">
              System settings
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Configuration overview for the public site, admin stack, and core
              integrations.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Halaman ini dipakai buat baca health stack, metadata inti, dan
              status integrasi yang paling penting untuk operasional plus.
            </p>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Connected services
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {[supabaseOn, aiOn, placesOn].filter(Boolean).length}
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
                Languages
              </p>
              <p className="mt-3 text-3xl font-black text-sky-700">2</p>
              <p className="mt-2 text-xs text-sky-800/70">
                EN and ID routes live
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            General
          </h2>
          <div className="mt-4">
            <Row label="Site title" value="plus." />
            <Row label="Tagline" value="Global Digital AI-gency" />
            <Row label="Site URL" value="https://plusthe.site" />
            <Row
              label="Languages"
              value="English (/en) / Bahasa Indonesia (/id)"
            />
            <Row label="Admin email" value="plusthesite@gmail.com" />
            <Row label="Timezone" value="Asia/Jakarta (WIB)" />
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Nilai di atas berasal dari codebase dan metadata global. Ubah di
            repo kalau mau update secara menyeluruh.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Integration health
          </h2>
          <div className="mt-3 divide-y divide-slate-100">
            <Health
              label="Supabase database and auth"
              ok={supabaseOn}
              hint="set env vars"
            />
            <Health
              label="Google Gemini AI"
              ok={aiOn}
              hint="set GEMINI_API_KEY"
            />
            <Health
              label="Google Places importer"
              ok={placesOn}
              hint="set GOOGLE_MAPS_API_KEY"
            />
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Kelola key di hosting env dan lokal lewat `.env.local`.
          </p>
        </section>
      </div>
    </div>
  );
}
