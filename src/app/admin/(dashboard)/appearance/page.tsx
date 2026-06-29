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
        const { data, error } = await supabase.from("site_settings").select("primary_color, secondary_color, tertiary_color").eq("id", 1).maybeSingle();
        if (error) {
            needsSetup = true;
        } else {
            primary = data?.primary_color ?? "";
            secondary = data?.secondary_color ?? "";
            tertiary = data?.tertiary_color ?? "";
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Appearance</h1>
            <p className="mt-1 text-sm text-slate-500">Re-theme situs publik secara interaktif — pilih warna brand, lihat preview langsung, terapkan instan ke seluruh situs.</p>
            {!supabase ? (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Supabase belum dikonfigurasi.
                </div>
            ) : needsSetup ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-xl">🛠️</span>
                        <div>
                            <h2 className="text-base font-bold text-amber-900">Satu langkah setup</h2>
                            <p className="mt-1 text-sm text-amber-800">Tabel <code className="rounded bg-amber-100 px-1 font-mono">site_settings</code> belum ada di database, jadi tema belum bisa disimpan. Buka <b>Supabase → SQL Editor</b>, tempel skrip ini, lalu <b>Run</b> — setelah itu Appearance langsung berfungsi.</p>
                            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">{`create table if not exists public.site_settings (
  id smallint primary key default 1,
  primary_color text, secondary_color text, tertiary_color text,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);
alter table public.site_settings add column if not exists tertiary_color text;
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
alter table public.site_settings enable row level security;
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings for select using (true);`}</pre>
                            <p className="mt-3 text-xs text-amber-700">Skrip ini idempotent &amp; aman — file lengkapnya ada di <code className="font-mono">supabase/site_settings.sql</code>. Refresh halaman ini setelah Run.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-6">
                    <AppearanceForm initialPrimary={primary} initialSecondary={secondary} initialTertiary={tertiary} />
                </div>
            )}
        </div>
    );
}
