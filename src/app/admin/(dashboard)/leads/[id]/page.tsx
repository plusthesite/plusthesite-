import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { formatIDR, serviceName } from "@/lib/services";
import { scoreLead, scoreTier } from "@/lib/leadScore";
import { ActivityPanel } from "@/components/admin/ActivityPanel";
import { QuickMessage } from "@/components/admin/QuickMessage";
import { convertLeadToOpportunity } from "../../opportunities/actions";
import { quickUpdateLead } from "../actions";

export const dynamic = "force-dynamic";

function opener(
  name: string | null,
  service: string | null,
  company: string | null,
  locale: string | null,
) {
  const first = name?.trim().split(/\s+/)[0];
  const svc = serviceName(service).toLowerCase();

  if (locale === "en") {
    return `Hi ${first || "there"}, this is plus. (plusthe.site). We help businesses with ${svc}, saw ${company || "your business"}, and thought we could help. Open to a quick chat?`;
  }

  return `Halo ${first || "Kak"}, saya dari plus. (plusthe.site). Kami bantu bisnis untuk ${svc}. Kami sempat lihat ${company || "usaha Anda"} dan rasanya bisa cocok. Boleh ngobrol singkat?`;
}

function waLink(phone: string | null, text: string) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : null;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusTone(status: string | null) {
  switch (status) {
    case "contacted":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "qualified":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "unqualified":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "converted":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: lead } = await supabase
    .from("leads")
    .select(
      "id, name, email, phone, company, service, status, value, owner, message, source, locale, created_at, account_id, next_action",
    )
    .eq("id", id)
    .maybeSingle();

  if (!lead) notFound();

  const { data: account } = lead.account_id
    ? await supabase
        .from("accounts")
        .select("id, name, industry")
        .eq("id", lead.account_id)
        .maybeSingle()
    : { data: null };

  const label = lead.company || lead.name || lead.email || "Lead";
  const message = opener(lead.name, lead.service, lead.company, lead.locale);
  const whatsapp = waLink(lead.phone, message);
  const mailto = lead.email
    ? `mailto:${lead.email}?subject=${encodeURIComponent(
        lead.locale === "en" ? "Quick hello from plus." : "Halo dari plus.",
      )}&body=${encodeURIComponent(message)}`
    : null;

  const { score, reasons } = scoreLead(lead);
  const tier = scoreTier(score);
  const readiness = lead.next_action?.trim()
    ? "Sudah punya next step"
    : "Butuh follow-up baru";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
      >
        {"<-"} Back to Leads
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Lead record
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              {lead.name || "Tanpa nama"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {[lead.company, lead.email || lead.phone]
                .filter(Boolean)
                .join(" / ") || "Kontak belum lengkap"}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusTone(
                  lead.status,
                )}`}
              >
                {lead.status ?? "new"}
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                {serviceName(lead.service)}
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                {readiness}
              </span>
            </div>
          </div>

          <div className="grid min-w-[260px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Lead score
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-black text-slate-950">
                  {score}
                </span>
                <span className="pb-1 text-xs font-semibold text-slate-400">
                  /100
                </span>
              </div>
              <span
                className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tier.color}`}
              >
                {tier.label} lead
              </span>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/70">
                Est. value
              </p>
              <p className="mt-3 text-3xl font-black text-emerald-700">
                {lead.value ? formatIDR(lead.value, true) : "-"}
              </p>
              <p className="mt-2 text-xs text-emerald-800/70">
                Source: {lead.source ?? "unknown"}
              </p>
            </div>
          </div>
        </div>

        {reasons.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Why this score
            </p>
            <p className="mt-2 text-sm text-slate-600">{reasons.join(" / ")}</p>
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr_1.5fr]">
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Contact snapshot
          </h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Email</dt>
              <dd className="text-right font-medium text-slate-700">
                {lead.email ?? "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Phone</dt>
              <dd className="text-right font-medium text-slate-700">
                {lead.phone ?? "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Owner</dt>
              <dd className="text-right font-medium text-slate-700">
                {lead.owner ?? "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Source</dt>
              <dd className="text-right font-medium text-slate-700">
                {lead.source ?? "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Created</dt>
              <dd className="text-right font-medium text-slate-700">
                {formatDate(lead.created_at)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Locale</dt>
              <dd className="text-right font-medium text-slate-700">
                {(lead.locale ?? "id").toUpperCase()}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp dengan opener siap pakai"
                className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                WhatsApp
              </a>
            )}
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Call
              </a>
            )}
            {mailto && (
              <a
                href={mailto}
                title="Email dengan opener siap pakai"
                className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
              >
                Email
              </a>
            )}
            {lead.status !== "converted" && (
              <form action={convertLeadToOpportunity}>
                <input type="hidden" name="id" value={lead.id} />
                <button className="rounded-xl border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-50">
                  Convert to opportunity
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Account fit
          </h2>
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            {account ? (
              <>
                <p className="text-sm font-semibold text-slate-900">
                  <Link
                    href={`/admin/accounts/${account.id}`}
                    className="transition-colors hover:text-sky-600"
                  >
                    {account.name}
                  </Link>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {account.industry ?? "Industry belum diisi"}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Lead ini belum terhubung ke account.
              </p>
            )}
          </div>

          <form
            action={quickUpdateLead}
            className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
          >
            <input type="hidden" name="id" value={lead.id} />
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Next step
            </label>
            <textarea
              name="next_action"
              defaultValue={lead.next_action ?? ""}
              placeholder="Contoh: kirim proposal, follow-up Jumat, minta jadwal demo"
              rows={4}
              className={`mt-3 w-full rounded-2xl border px-3 py-3 text-sm outline-none transition-colors ${
                lead.next_action
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            />
            <button className="mt-3 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800">
              Save next step
            </button>
          </form>

          {lead.message && (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Original message
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {lead.message}
              </p>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Quick outreach
            </h2>
            <div className="mt-5">
              <QuickMessage
                name={lead.name}
                phone={lead.phone}
                email={lead.email}
                company={lead.company}
                service={lead.service}
                locale={lead.locale === "id" ? "id" : "en"}
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Activity log
            </h2>
            <div className="mt-5">
              <ActivityPanel
                parentType="lead"
                parentId={lead.id}
                parentLabel={label}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
