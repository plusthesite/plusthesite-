import Link from "next/link";
import { formatIDR, SERVICES, serviceName } from "@/lib/services";
import { getSupabaseAdmin } from "@/lib/supabase";
import { scoreLead, scoreTier } from "@/lib/leadScore";

export const dynamic = "force-dynamic";

interface Lead {
  id: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  service: string | null;
  status: string | null;
  value: number | null;
  source: string | null;
  owner: string | null;
  locale: string | null;
  created_at: string;
}

function opener(lead: Lead) {
  const first = lead.name?.trim().split(/\s+/)[0];
  const service = serviceName(lead.service).toLowerCase();

  if (lead.locale === "en") {
    return `Hi ${first || "there"}, this is plus. (plusthe.site). We help businesses with ${service}, saw ${lead.company || "your business"}, and thought we could help. Open to a quick chat?`;
  }

  return `Halo ${first || "Kak"}, saya dari plus. (plusthe.site). Kami bantu bisnis untuk ${service}. Kami sempat lihat ${lead.company || "usaha Anda"} dan rasanya bisa cocok. Boleh ngobrol singkat?`;
}

function waLink(lead: Lead) {
  if (!lead.phone) return null;
  const digits = lead.phone.replace(/[^\d]/g, "");
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(opener(lead))}`
    : null;
}

function mailtoLink(lead: Lead) {
  if (!lead.email) return null;
  const subject =
    lead.locale === "en" ? "Quick hello from plus." : "Halo dari plus.";
  return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(opener(lead))}`;
}

export default async function PriorityPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: filter } = await searchParams;
  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase
        .from("leads")
        .select(
          "id, name, company, phone, email, website, service, status, value, source, owner, locale, created_at",
        )
        .neq("status", "converted")
        .order("value", { ascending: false })
        .limit(1000)
    : { data: [] };

  const scored = ((data ?? []) as Lead[])
    .map((lead) => ({ lead, ...scoreLead(lead) }))
    .sort((a, b) => b.score - a.score);

  const counts = SERVICES.map((service) => ({
    service,
    total: scored.filter((item) => item.lead.service === service.slug).length,
  })).filter((item) => item.total > 0);

  const visible = filter
    ? scored.filter((item) => item.lead.service === filter)
    : scored;
  const hot = scored.filter((item) => item.score >= 70).length;
  const warm = scored.filter(
    (item) => item.score >= 45 && item.score < 70,
  ).length;
  const top = visible.slice(0, 100);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-700">
              Priority queue
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Auto-ranked leads, sorted so the hottest and most reachable
              prospects get handled first.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Ranking ini menggabungkan nilai, reachability, stage, dan recency,
              jadi tim bisa fokus ke lead paling menjanjikan tanpa nebak-nebak
              lagi.
            </p>
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700/70">
                Hot leads
              </p>
              <p className="mt-3 text-3xl font-black text-rose-700">{hot}</p>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
                Warm leads
              </p>
              <p className="mt-3 text-3xl font-black text-amber-700">{warm}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/priority"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              !filter
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({scored.length})
          </Link>
          {counts.map(({ service, total }) => (
            <Link
              key={service.slug}
              href={`/admin/priority?service=${service.slug}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                filter === service.slug
                  ? "bg-slate-950 text-white"
                  : `${service.chip} hover:opacity-80`
              }`}
            >
              {service.en} / {total}
            </Link>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Lead</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Why</th>
                  <th className="px-4 py-3 font-semibold">Reach out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {top.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      No leads in this segment.
                    </td>
                  </tr>
                )}
                {top.map(({ lead, score, reasons }, index) => {
                  const tier = scoreTier(score);
                  const whatsapp = waLink(lead);
                  const mailto = mailtoLink(lead);

                  return (
                    <tr
                      key={lead.id}
                      className="align-top hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-4 text-slate-400">{index + 1}</td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-semibold text-slate-800 transition-colors hover:text-sky-600"
                        >
                          {lead.company || lead.name || lead.email || "Lead"}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">
                          {lead.name && lead.company
                            ? lead.name
                            : lead.source || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {serviceName(lead.service)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-700">
                        {formatIDR(lead.value ?? 0, true)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {score}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tier.color}`}
                          >
                            {tier.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-slate-400">
                          {reasons.slice(0, 3).join(" / ")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          {whatsapp && (
                            <a
                              href={whatsapp}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 transition-colors hover:bg-emerald-100"
                              title="WhatsApp with a ready opener"
                            >
                              WA
                            </a>
                          )}
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-slate-500 transition-colors hover:text-slate-700"
                            >
                              Call
                            </a>
                          )}
                          {mailto && (
                            <a
                              href={mailto}
                              className="text-sky-600 transition-colors hover:text-sky-800"
                              title="Email with a ready opener"
                            >
                              Email
                            </a>
                          )}
                          {!whatsapp && !lead.phone && !mailto && (
                            <span className="text-slate-300">no contact</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
