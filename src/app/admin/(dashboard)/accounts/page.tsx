import Link from "next/link";
import { formatIDR } from "@/lib/services";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Account {
  id: string;
  name: string;
  industry: string | null;
  owner: string | null;
}

const PAGE_SIZE = 50;

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const supabase = getSupabaseAdmin();

  const [accountsRes, opportunitiesRes, leadsRes] = supabase
    ? await Promise.all([
        supabase
          .from("accounts")
          .select("id, name, industry, owner")
          .order("name"),
        supabase.from("opportunities").select("account_id, value, stage"),
        supabase.from("leads").select("account_id"),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const accounts = (accountsRes.data ?? []) as Account[];
  const opportunities = (opportunitiesRes.data ?? []) as {
    account_id: string | null;
    value: number | null;
    stage: string;
  }[];
  const leads = (leadsRes.data ?? []) as { account_id: string | null }[];

  const leadCount = new Map<string, number>();
  for (const lead of leads) {
    if (lead.account_id) {
      leadCount.set(lead.account_id, (leadCount.get(lead.account_id) ?? 0) + 1);
    }
  }

  const opportunityAgg = new Map<
    string,
    { count: number; openValue: number; wonValue: number }
  >();
  for (const opportunity of opportunities) {
    if (!opportunity.account_id) continue;
    const current = opportunityAgg.get(opportunity.account_id) ?? {
      count: 0,
      openValue: 0,
      wonValue: 0,
    };
    current.count += 1;
    const value = opportunity.value ?? 0;
    if (opportunity.stage === "won") current.wonValue += value;
    else if (opportunity.stage !== "lost") current.openValue += value;
    opportunityAgg.set(opportunity.account_id, current);
  }

  let rows = accounts
    .map((account) => {
      const aggregate = opportunityAgg.get(account.id);
      return {
        ...account,
        leadCount: leadCount.get(account.id) ?? 0,
        opportunityCount: aggregate?.count ?? 0,
        openValue: aggregate?.openValue ?? 0,
        wonValue: aggregate?.wonValue ?? 0,
      };
    })
    .sort((a, b) => b.openValue - a.openValue);

  const query = (q ?? "").trim().toLowerCase();
  if (query) {
    rows = rows.filter(
      (account) =>
        account.name.toLowerCase().includes(query) ||
        (account.industry ?? "").toLowerCase().includes(query),
    );
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const from = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, total);

  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const search = params.toString();
    return `/admin/accounts${search ? `?${search}` : ""}`;
  };

  const activeAccounts = rows.filter((account) => account.openValue > 0).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Account map
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Companies, their lead volume, and their pipeline value in one
              rolled-up view.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Halaman ini membantu baca account mana yang aktif, siapa
              owner-nya, dan mana yang punya pipeline paling besar sekarang.
            </p>
          </div>

          <div className="grid min-w-[300px] gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Companies
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {accounts.length}
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
                Active pipeline
              </p>
              <p className="mt-3 text-3xl font-black text-sky-700">
                {activeAccounts}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/70">
                Search scope
              </p>
              <p className="mt-3 text-xl font-black text-emerald-700">
                Name / Industry
              </p>
            </div>
          </div>
        </div>
      </section>

      {!supabase && (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Run `supabase/accounts.sql` to enable Accounts.
        </div>
      )}

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <form method="get" className="flex flex-wrap items-center gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="Cari perusahaan atau industri..."
            className="w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
          />
          <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Cari
          </button>
          {query && (
            <Link
              href="/admin/accounts"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Reset
            </Link>
          )}
        </form>

        <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 font-semibold text-center">Leads</th>
                  <th className="px-5 py-3 font-semibold text-center">Deals</th>
                  <th className="px-5 py-3 font-semibold text-right">
                    Open pipeline
                  </th>
                  <th className="px-5 py-3 font-semibold text-right">Won</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      {query ? "No matching companies." : "No accounts yet."}
                    </td>
                  </tr>
                )}
                {pageRows.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/accounts/${account.id}`}
                        className="font-semibold text-slate-800 transition-colors hover:text-sky-600"
                      >
                        {account.name}
                      </Link>
                      {account.industry && (
                        <p className="mt-1 text-xs text-slate-400">
                          {account.industry}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {account.owner ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-center text-slate-600">
                      {account.leadCount}
                    </td>
                    <td className="px-5 py-4 text-center text-slate-600">
                      {account.opportunityCount}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-800">
                      {formatIDR(account.openValue, true)}
                    </td>
                    <td className="px-5 py-4 text-right text-emerald-600">
                      {account.wonValue
                        ? formatIDR(account.wonValue, true)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {total > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {from}-{to}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{total}</span>
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {safePage > 1 ? (
                  <Link
                    href={pageHref(safePage - 1)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {"<-"} Prev
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-300">
                    {"<-"} Prev
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-500">
                  Page {safePage} of {totalPages}
                </span>
                {safePage < totalPages ? (
                  <Link
                    href={pageHref(safePage + 1)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Next {"->"}
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-300">
                    Next {"->"}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
