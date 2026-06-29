import { isSupabaseConfigured } from "@/lib/supabase";
import { requireRole } from "@/lib/role";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 border-b border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-800">{value}</span>
        </div>
    );
}

function Health({ label, ok, hint }: { label: string; ok: boolean; hint?: string }) {
    return (
        <div className="flex items-center justify-between py-2.5 text-sm">
            <div>
                <span className="text-slate-700">{label}</span>
                {!ok && hint && <span className="ml-2 text-xs text-amber-600">{hint}</span>}
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
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
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="mt-1 text-sm text-slate-500">Site configuration and integration health.</p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">General</h2>
                    <div className="mt-3">
                        <Row label="Site Title" value="plus." />
                        <Row label="Tagline" value="Global Digital AI-gency" />
                        <Row label="Site Address (URL)" value="https://plusthe.site" />
                        <Row label="Languages" value="English (/en) · Bahasa Indonesia (/id)" />
                        <Row label="Admin Email" value="support@plusthe.site" />
                        <Row label="Timezone" value="Asia/Jakarta (WIB)" />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">These are defined in code/SEO metadata. Edit in the repo to change them globally.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">Integration Health</h2>
                    <div className="mt-2 divide-y divide-slate-100">
                        <Health label="Supabase (Database & Auth)" ok={supabaseOn} hint="set env vars" />
                        <Health label="Google Gemini AI" ok={aiOn} hint="set GEMINI_API_KEY" />
                        <Health label="Google Places Importer" ok={placesOn} hint="set GOOGLE_MAPS_API_KEY" />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Manage keys in your hosting env (Netlify) and locally in <code className="font-mono">.env.local</code>.</p>
                </div>
            </div>
        </div>
    );
}
