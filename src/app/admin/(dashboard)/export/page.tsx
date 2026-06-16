export const dynamic = "force-dynamic";

const EXPORTS = [
    { type: "leads", label: "Leads", desc: "All inbound prospects with contact info, service & status." },
    { type: "opportunities", label: "Opportunities", desc: "Full sales pipeline with values, stages & owners." },
    { type: "accounts", label: "Accounts", desc: "Company accounts and their contact details." },
    { type: "subscribers", label: "Subscribers", desc: "Newsletter signups." },
    { type: "contacts", label: "Contacts", desc: "Contact-form submissions." },
];

export default function ExportPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Export</h1>
            <p className="mt-1 text-sm text-slate-500">Download your CRM data as CSV — open in Excel, Google Sheets, or import elsewhere.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {EXPORTS.map((e) => (
                    <div key={e.type} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900">{e.label}</h2>
                        <p className="mt-1 flex-1 text-sm text-slate-500">{e.desc}</p>
                        <a
                            href={`/api/admin/export?type=${e.type}`}
                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download CSV
                        </a>
                    </div>
                ))}
            </div>

            <h2 className="mt-10 text-lg font-bold text-slate-900">Daily Pipeline Digest</h2>
            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">An email summary of new leads, open follow-ups, pipeline value, and hot deals.</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a href="/api/admin/digest" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Preview digest</a>
                    <span className="text-xs text-slate-400">To auto-send daily: set <code className="font-mono">RESEND_API_KEY</code>, <code className="font-mono">ADMIN_DIGEST_EMAIL</code>, <code className="font-mono">CRON_SECRET</code>, then POST <code className="font-mono">/api/admin/digest</code> from a daily cron with header <code className="font-mono">x-cron-secret</code>.</span>
                </div>
            </div>
        </div>
    );
}
