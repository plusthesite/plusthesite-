import { requireRole } from "@/lib/role";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AppearanceForm } from "./AppearanceForm";

export const dynamic = "force-dynamic";

export default async function AppearancePage() {
  await requireRole(["admin"]);

  const supabase = getSupabaseAdmin();
  let primary = "";
  let secondary = "";
  let tertiary = "";
  let needsSetup = false;

  if (supabase) {
    const { data, error } = await supabase
      .from("site_settings")
      .select("primary_color, secondary_color, tertiary_color")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      needsSetup = true;
    } else {
      primary = data?.primary_color ?? "";
      secondary = data?.secondary_color ?? "";
      tertiary = data?.tertiary_color ?? "";
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-pink-700">
            Brand appearance
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            Re-theme the public site with live brand colors and a cleaner visual
            control surface.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Halaman ini dipakai buat atur warna utama brand plus, preview tone
            yang aktif, lalu menerapkannya langsung ke situs publik.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Primary
            </p>
            <div
              className="mt-3 h-12 rounded-2xl border border-slate-200"
              style={{ backgroundColor: primary || "#0f172a" }}
            />
            <p className="mt-2 text-xs text-slate-500">
              {primary || "fallback default"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Secondary
            </p>
            <div
              className="mt-3 h-12 rounded-2xl border border-slate-200"
              style={{ backgroundColor: secondary || "#2563eb" }}
            />
            <p className="mt-2 text-xs text-slate-500">
              {secondary || "fallback default"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Tertiary
            </p>
            <div
              className="mt-3 h-12 rounded-2xl border border-slate-200"
              style={{ backgroundColor: tertiary || "#f59e0b" }}
            />
            <p className="mt-2 text-xs text-slate-500">
              {tertiary || "fallback default"}
            </p>
          </div>
        </div>
      </section>

      {!supabase ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase belum dikonfigurasi.
        </div>
      ) : needsSetup ? (
        <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-base font-bold text-amber-900">
            Setup satu kali
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            Tabel `site_settings` belum ada di database, jadi warna tema belum
            bisa disimpan. Buka Supabase SQL Editor, jalankan skrip di bawah,
            lalu refresh halaman ini.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">{`create table if not exists public.site_settings (
  id smallint primary key default 1,
  primary_color text,
  secondary_color text,
  tertiary_color text,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);
alter table public.site_settings add column if not exists tertiary_color text;
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
alter table public.site_settings enable row level security;
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings for select using (true);`}</pre>
          <p className="mt-4 text-xs text-amber-700">
            Skrip ini idempotent dan aman. Versi file lengkapnya ada di
            `supabase/site_settings.sql`.
          </p>
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <AppearanceForm
            initialPrimary={primary}
            initialSecondary={secondary}
            initialTertiary={tertiary}
          />
        </section>
      )}
    </div>
  );
}
