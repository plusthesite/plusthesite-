import { isSupabaseConfigured } from "@/lib/supabase";
import { requireRole } from "@/lib/role";

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

    // The real "plugins" powering plus. — integrations + built-in modules.
    const plugins: Plugin[] = [
        { name: "Supabase — Database & Auth", description: "Postgres database, row-level security, and admin authentication.", version: "2.x", author: "Supabase", active: supabaseOn, note: supabaseOn ? undefined : "Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY" },
        { name: "Google Gemini AI", description: "Powers the AI chatbot and content generators.", version: "1.x", author: "Google", active: aiOn, note: aiOn ? undefined : "Set GEMINI_API_KEY" },
        { name: "Google Places Lead Importer", description: "Imports real local businesses into the leads pipeline via the official Places API.", version: "1.0", author: "plus.", active: placesOn, note: placesOn ? undefined : "Set GOOGLE_MAPS_API_KEY, then run scripts/import-places-leads.mjs" },
        { name: "Blog CMS", description: "Create, edit, publish, and import articles — all 94 static + DB posts.", version: "1.1", author: "plus.", active: true },
        { name: "CRM Pipeline", description: "Leads & opportunities segmented by service, with WhatsApp/Call/Email reach-out.", version: "1.0", author: "plus.", active: true },
        { name: "SEO & AI-Search Kit", description: "CMS-aware sitemap, AI-crawler robots, dynamic llms.txt, JSON-LD structured data.", version: "1.0", author: "plus.", active: true },
        { name: "i18n (EN / ID)", description: "URL-based bilingual content with hreflang alternates.", version: "1.0", author: "plus.", active: true },
        { name: "Netlify — Hosting & SSR", description: "Production hosting, serverless API routes, and OG images.", version: "5.x", author: "Netlify", active: true },
    ];

    const activeCount = plugins.filter((p) => p.active).length;

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Plugins</h1>
                    <p className="mt-1 text-sm text-slate-500">Integrations and modules powering your site.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{activeCount} active · {plugins.length} total</span>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-slate-100">
                        {plugins.map((p) => (
                            <tr key={p.name} className={p.active ? "border-l-2 border-l-emerald-400" : "border-l-2 border-l-transparent opacity-80"}>
                                <td className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800">{p.name}</p>
                                            <p className="mt-0.5 text-sm text-slate-500">{p.description}</p>
                                            {p.note && <p className="mt-1 text-xs text-amber-600">⚠ {p.note}</p>}
                                            <p className="mt-1.5 text-xs text-slate-400">Version {p.version} · By {p.author}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                            {p.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
