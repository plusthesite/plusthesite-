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
    if (supabase) {
        const { data } = await supabase.from("site_settings").select("primary_color, secondary_color, tertiary_color").eq("id", 1).maybeSingle();
        primary = data?.primary_color ?? "";
        secondary = data?.secondary_color ?? "";
        tertiary = data?.tertiary_color ?? "";
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Appearance</h1>
            <p className="mt-1 text-sm text-slate-500">Re-theme situs publik secara interaktif — pilih warna brand, lihat preview langsung, terapkan instan ke seluruh situs.</p>
            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Jalankan <code className="font-mono">supabase/site_settings.sql</code> dulu untuk mengaktifkan.
                </div>
            )}
            <div className="mt-6">
                <AppearanceForm initialPrimary={primary} initialSecondary={secondary} initialTertiary={tertiary} />
            </div>
        </div>
    );
}
