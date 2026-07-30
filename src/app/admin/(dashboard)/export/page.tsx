export const dynamic = "force-dynamic";

const EXPORTS = [
  {
    type: "leads",
    label: "Leads",
    desc: "All inbound prospects with contact info, service, source, and status.",
  },
  {
    type: "opportunities",
    label: "Opportunities",
    desc: "Full sales pipeline with values, stages, owners, and follow-up signals.",
  },
  {
    type: "accounts",
    label: "Accounts",
    desc: "Company accounts plus contact context and CRM linkage.",
  },
  {
    type: "subscribers",
    label: "Subscribers",
    desc: "Newsletter signups and lightweight audience growth data.",
  },
  {
    type: "contacts",
    label: "Contacts",
    desc: "Contact-form submissions for inbound business inquiries.",
  },
];

export default function ExportPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700">
              Data export
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Export CRM data cleanly for ops review, spreadsheet analysis, or
              downstream tooling.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Semua export di sini berbentuk CSV supaya gampang dibuka di Excel,
              Google Sheets, atau dipakai untuk proses internal lain.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Export types
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {EXPORTS.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {EXPORTS.map((item) => (
          <article
            key={item.type}
            className="flex flex-col rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm"
          >
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              {item.label}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {item.desc}
            </p>
            <a
              href={`/api/admin/export?type=${item.type}`}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download CSV
            </a>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Daily pipeline digest
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Preview atau automasi email ringkasan pipeline harian.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-sm leading-6 text-slate-600">
            Digest berisi new leads, open follow-ups, pipeline value, dan hot
            deals. Cocok untuk owner atau sales manager yang butuh snapshot
            cepat tiap pagi.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="/api/admin/digest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Preview digest
            </a>
            <span className="text-xs leading-6 text-slate-400">
              Untuk auto-send harian, set `RESEND_API_KEY`,
              `ADMIN_DIGEST_EMAIL`, dan `CRON_SECRET`, lalu POST ke
              `/api/admin/digest` dengan header `x-cron-secret`.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
