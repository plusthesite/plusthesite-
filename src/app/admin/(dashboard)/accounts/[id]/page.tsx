import Link from "next/link";
import { notFound } from "next/navigation";
import { formatIDR, serviceName } from "@/lib/services";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: account } = await supabase
    .from("accounts")
    .select("id, name, industry, website, phone, email, owner, notes")
    .eq("id", id)
    .maybeSingle();

  if (!account) notFound();

  const [leadsRes, opportunitiesRes] = await Promise.all([
    supabase
      .from("leads")
      .select("id, name, email, phone, service, status")
      .eq("account_id", id),
    supabase
      .from("opportunities")
      .select("id, name, value, stage, service, owner")
      .eq("account_id", id)
      .order("value", { ascending: false }),
  ]);

  const leads = (leadsRes.data ?? []) as {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    service: string | null;
    status: string | null;
  }[];

  const opportunities = (opportunitiesRes.data ?? []) as {
    id: string;
    name: string;
    value: number | null;
    stage: string;
    service: string | null;
    owner: string | null;
  }[];

  const openValue = opportunities
    .filter(
      (opportunity) =>
        opportunity.stage !== "won" && opportunity.stage !== "lost",
    )
    .reduce((sum, opportunity) => sum + (opportunity.value ?? 0), 0);
  const wonValue = opportunities
    .filter((opportunity) => opportunity.stage === "won")
    .reduce((sum, opportunity) => sum + (opportunity.value ?? 0), 0);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/accounts"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
      >
        {"<-"} Back to Accounts
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Account detail
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              {account.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {[
                account.industry,
                account.owner ? `Owner: ${account.owner}` : null,
              ]
                .filter(Boolean)
                .join(" / ") || "Company account"}
            </p>
            {(account.website || account.phone || account.email) && (
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                {account.website && (
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 transition-colors hover:text-sky-800"
                  >
                    {account.website}
                  </a>
                )}
                {account.phone && <span>{account.phone}</span>}
                {account.email && (
                  <a
                    href={`mailto:${account.email}`}
                    className="text-sky-600 transition-colors hover:text-sky-800"
                  >
                    {account.email}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
                Open pipeline
              </p>
              <p className="mt-3 text-3xl font-black text-sky-700">
                {formatIDR(openValue, true)}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/70">
                Won revenue
              </p>
              <p className="mt-3 text-3xl font-black text-emerald-700">
                {formatIDR(wonValue, true)}
              </p>
            </div>
          </div>
        </div>

        {account.notes && (
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Notes
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {account.notes}
            </p>
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Opportunities ({opportunities.length})
          </h2>
          <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100">
                {opportunities.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-400">
                      No deals yet.
                    </td>
                  </tr>
                )}
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/opportunities/${opportunity.id}`}
                        className="font-medium text-slate-800 transition-colors hover:text-sky-600"
                      >
                        {opportunity.name}
                      </Link>
                      <p className="mt-1 text-xs text-slate-400">
                        {serviceName(opportunity.service)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-600">
                        {opportunity.stage}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-800">
                      {formatIDR(opportunity.value ?? 0, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Leads ({leads.length})
          </h2>
          <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100">
                {leads.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-400">
                      No leads yet.
                    </td>
                  </tr>
                )}
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-medium text-slate-800 transition-colors hover:text-sky-600"
                      >
                        {lead.name ?? lead.email ?? "Lead"}
                      </Link>
                      <p className="mt-1 text-xs text-slate-400">
                        {serviceName(lead.service)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-600">
                        {lead.status ?? "new"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-xs text-slate-400">
                      {lead.phone || lead.email || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
