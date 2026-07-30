import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityPanel } from "@/components/admin/ActivityPanel";
import { QuickMessage } from "@/components/admin/QuickMessage";
import { formatIDR, serviceName } from "@/lib/services";
import { getSupabaseAdmin } from "@/lib/supabase";
import { updateOpportunityStage } from "../actions";
import { StageSelect } from "../StageSelect";

export const dynamic = "force-dynamic";

function opener(
  contactName: string | null,
  company: string | null,
  service: string | null,
  locale: string | null,
) {
  const first = contactName?.trim().split(/\s+/)[0];
  const svc = serviceName(service).toLowerCase();

  if (locale === "en") {
    return `Hi ${first || "there"}, this is plus. (plusthe.site) following up on ${svc}${company ? ` for ${company}` : ""}. Open to a quick chat?`;
  }

  return `Halo ${first || "Kak"}, saya dari plus. (plusthe.site) menindaklanjuti kebutuhan ${svc}${company ? ` untuk ${company}` : ""}. Boleh kita lanjut ngobrol singkat?`;
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

function stageTone(stage: string) {
  switch (stage) {
    case "won":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "lost":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "proposal":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "negotiation":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "qualified":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: opportunity } = await supabase
    .from("opportunities")
    .select(
      "id, name, company, contact_name, email, phone, value, stage, probability, source, service, owner, next_action, next_action_at, expected_close, notes, locale, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!opportunity) notFound();

  const label = opportunity.company || opportunity.name;
  const message = opener(
    opportunity.contact_name,
    opportunity.company,
    opportunity.service,
    opportunity.locale,
  );
  const whatsapp = waLink(opportunity.phone, message);
  const mailto = opportunity.email
    ? `mailto:${opportunity.email}?subject=${encodeURIComponent(
        opportunity.locale === "en"
          ? "Following up from plus."
          : "Tindak lanjut dari plus.",
      )}&body=${encodeURIComponent(message)}`
    : null;

  const weightedValue =
    (opportunity.value ?? 0) * ((opportunity.probability ?? 0) / 100);
  const nextStepState =
    opportunity.next_action?.trim() && opportunity.next_action_at
      ? "Follow-up scheduled"
      : "Needs follow-up plan";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/opportunities"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
      >
        {"<-"} Back to Opportunities
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Opportunity record
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              {opportunity.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {[opportunity.contact_name, opportunity.company]
                .filter(Boolean)
                .join(" / ") || "Kontak belum lengkap"}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${stageTone(
                  opportunity.stage,
                )}`}
              >
                {opportunity.stage}
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                {serviceName(opportunity.service)}
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                {nextStepState}
              </span>
            </div>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Deal value
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {formatIDR(opportunity.value ?? 0, true)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Probability: {opportunity.probability ?? 0}%
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
                Weighted forecast
              </p>
              <p className="mt-3 text-3xl font-black text-sky-700">
                {formatIDR(weightedValue, true)}
              </p>
              <p className="mt-2 text-xs text-sky-800/70">
                Owner: {opportunity.owner ?? "unassigned"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr_1.5fr]">
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Stage control
            </h2>
            <StageSelect
              id={opportunity.id}
              stage={opportunity.stage}
              action={updateOpportunityStage}
            />
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Owner</dt>
              <dd className="text-right font-medium text-slate-700">
                {opportunity.owner ?? "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Source</dt>
              <dd className="text-right font-medium text-slate-700">
                {opportunity.source ?? "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Expected close</dt>
              <dd className="text-right font-medium text-slate-700">
                {formatDate(opportunity.expected_close)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Next touch</dt>
              <dd className="text-right font-medium text-slate-700">
                {formatDate(opportunity.next_action_at)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Created</dt>
              <dd className="text-right font-medium text-slate-700">
                {formatDate(opportunity.created_at)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Locale</dt>
              <dd className="text-right font-medium text-slate-700">
                {(opportunity.locale ?? "id").toUpperCase()}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp dengan follow-up siap pakai"
                className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                WhatsApp
              </a>
            )}
            {opportunity.phone && (
              <a
                href={`tel:${opportunity.phone}`}
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Call
              </a>
            )}
            {mailto && (
              <a
                href={mailto}
                title="Email dengan follow-up siap pakai"
                className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
              >
                Email
              </a>
            )}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Follow-up brief
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Next action
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {opportunity.next_action ??
                "Belum ada langkah lanjut yang ditulis."}
            </p>
          </div>

          {opportunity.notes && (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {opportunity.notes}
              </p>
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Contact snapshot
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Email</dt>
                <dd className="text-right font-medium text-slate-700">
                  {opportunity.email ?? "-"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Phone</dt>
                <dd className="text-right font-medium text-slate-700">
                  {opportunity.phone ?? "-"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Quick outreach
            </h2>
            <div className="mt-5">
              <QuickMessage
                name={opportunity.contact_name}
                phone={opportunity.phone}
                email={opportunity.email}
                company={opportunity.company}
                service={opportunity.service}
                locale={opportunity.locale === "id" ? "id" : "en"}
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Activity log
            </h2>
            <div className="mt-5">
              <ActivityPanel
                parentType="opportunity"
                parentId={opportunity.id}
                parentLabel={label}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
