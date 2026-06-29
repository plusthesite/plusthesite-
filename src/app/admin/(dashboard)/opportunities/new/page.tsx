import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { STAGES } from "../constants";
import { createOpportunity } from "../actions";

export const dynamic = "force-dynamic";

const field = "mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";
const label = "block text-xs font-bold uppercase tracking-wider text-slate-500";

export default function NewOpportunityPage() {
    return (
        <div className="max-w-2xl">
            <Link href="/admin/opportunities" className="text-xs font-semibold text-slate-400 hover:text-slate-600">← Back to Opportunities</Link>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">New Opportunity</h1>

            <form action={createOpportunity} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div><label className={label}>Deal name *</label><input name="name" required className={field} placeholder="e.g. AI Chatbot — Batik Nusantara" /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className={label}>Company</label><input name="company" className={field} placeholder="Company" /></div>
                    <div><label className={label}>Contact name</label><input name="contact_name" className={field} placeholder="Contact person" /></div>
                    <div><label className={label}>Email</label><input name="email" type="email" className={field} placeholder="name@company.com" /></div>
                    <div><label className={label}>Phone / WhatsApp</label><input name="phone" className={field} placeholder="+62 …" /></div>
                    <div><label className={label}>Value (IDR)</label><input name="value" type="number" min="0" className={field} placeholder="15000000" /></div>
                    <div>
                        <label className={label}>Service</label>
                        <select name="service" className={field} defaultValue="">
                            <option value="">— None —</option>
                            {SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.en}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={label}>Stage</label>
                        <select name="stage" className={field} defaultValue="new">
                            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div><label className={label}>Owner</label><input name="owner" className={field} placeholder="Sales rep" /></div>
                    <div><label className={label}>Expected close</label><input name="expected_close" type="date" className={field} /></div>
                    <div><label className={label}>Source</label><input name="source" className={field} placeholder="manual" defaultValue="manual" /></div>
                </div>
                <div><label className={label}>Notes</label><textarea name="notes" rows={3} className={field} placeholder="Context…" /></div>
                <input type="hidden" name="locale" value="id" />
                <div className="flex justify-end gap-2">
                    <Link href="/admin/opportunities" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</Link>
                    <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create Opportunity</button>
                </div>
            </form>
        </div>
    );
}
