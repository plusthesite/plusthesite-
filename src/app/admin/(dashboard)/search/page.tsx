import Link from "next/link";
import { formatIDR, serviceName } from "@/lib/services";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function clean(query: string) {
  return query
    .replace(/[%,()*]/g, " ")
    .trim()
    .slice(0, 80);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: raw } = await searchParams;
  const query = clean(raw ?? "");
  const supabase = getSupabaseAdmin();
  const like = `%${query}%`;

  const run = query.length >= 2 && supabase;
  const [leadsRes, opportunitiesRes, accountsRes, postsRes] = run
    ? await Promise.all([
        supabase
          .from("leads")
          .select("id, name, company, email, service, status")
          .or(`name.ilike.${like},company.ilike.${like},email.ilike.${like}`)
          .limit(20),
        supabase
          .from("opportunities")
          .select("id, name, company, value, stage, service")
          .or(
            `name.ilike.${like},company.ilike.${like},contact_name.ilike.${like}`,
          )
          .limit(20),
        supabase
          .from("accounts")
          .select("id, name, industry")
          .ilike("name", like)
          .limit(20),
        supabase
          .from("posts")
          .select("id, slug, title, locale, status")
          .ilike("title", like)
          .limit(20),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const leads = (leadsRes.data ?? []) as {
    id: string;
    name: string | null;
    company: string | null;
    email: string | null;
    service: string | null;
    status: string | null;
  }[];
  const opportunities = (opportunitiesRes.data ?? []) as {
    id: string;
    name: string;
    company: string | null;
    value: number | null;
    stage: string;
    service: string | null;
  }[];
  const accounts = (accountsRes.data ?? []) as {
    id: string;
    name: string;
    industry: string | null;
  }[];
  const posts = (postsRes.data ?? []) as {
    id: string;
    slug: string;
    title: string;
    locale: string;
    status: string;
  }[];
  const total =
    leads.length + opportunities.length + accounts.length + posts.length;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Universal search
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Cari lead, deal, akun, dan artikel dari satu tempat.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Gunakan pencarian ini untuk lompat cepat ke record penting tanpa
            pindah-pindah menu.
          </p>
        </div>

        <form action="/admin/search" method="get" className="mt-5">
          <input
            name="q"
            defaultValue={raw ?? ""}
            autoFocus
            placeholder="Cari nama, email, perusahaan, deal, atau judul artikel..."
            className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
          />
        </form>

        {query.length >= 2 ? (
          <p className="mt-4 text-sm text-slate-400">
            {total} hasil untuk &ldquo;{query}&rdquo;
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            Ketik minimal 2 karakter untuk mulai mencari.
          </p>
        )}
      </section>

      <div className="space-y-6">
        {opportunities.length > 0 && (
          <Section title="Opportunities" count={opportunities.length}>
            {opportunities.map((opportunity) => (
              <Row
                key={opportunity.id}
                href={`/admin/opportunities/${opportunity.id}`}
                title={opportunity.name}
                sub={`${opportunity.company ?? "Tanpa company"} / ${serviceName(opportunity.service)}`}
                right={formatIDR(opportunity.value ?? 0, true)}
                tag={opportunity.stage}
              />
            ))}
          </Section>
        )}

        {leads.length > 0 && (
          <Section title="Leads" count={leads.length}>
            {leads.map((lead) => (
              <Row
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                title={lead.name ?? lead.email ?? "Lead"}
                sub={`${lead.company ?? "Tanpa company"} / ${serviceName(lead.service)}`}
                tag={lead.status ?? "new"}
              />
            ))}
          </Section>
        )}

        {accounts.length > 0 && (
          <Section title="Accounts" count={accounts.length}>
            {accounts.map((account) => (
              <Row
                key={account.id}
                href={`/admin/accounts/${account.id}`}
                title={account.name}
                sub={account.industry ?? "Perusahaan"}
              />
            ))}
          </Section>
        )}

        {posts.length > 0 && (
          <Section title="Artikel" count={posts.length}>
            {posts.map((post) => (
              <Row
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                title={post.title}
                sub={post.locale.toUpperCase()}
                tag={post.status}
              />
            ))}
          </Section>
        )}

        {run && total === 0 && (
          <p className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-400 shadow-sm">
            Tidak ada hasil yang cocok untuk pencarian ini.
          </p>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
          {count} item
        </span>
      </div>
      <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60">
        {children}
      </div>
    </section>
  );
}

function Row({
  href,
  title,
  sub,
  right,
  tag,
}: {
  href: string;
  title: string;
  sub?: string;
  right?: string;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-white"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
        {sub && <p className="truncate text-xs text-slate-400">{sub}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {right && (
          <span className="text-sm font-semibold text-slate-700">{right}</span>
        )}
        {tag && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-500">
            {tag}
          </span>
        )}
      </div>
    </Link>
  );
}
