import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { serviceName, formatIDR } from "@/lib/services";

export const dynamic = "force-dynamic";

function clean(q: string) {
    // Strip characters that would break a PostgREST or() filter.
    return q.replace(/[%,()*]/g, " ").trim().slice(0, 80);
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q: raw } = await searchParams;
    const q = clean(raw ?? "");
    const supabase = getSupabaseAdmin();
    const like = `%${q}%`;

    const run = q.length >= 2 && supabase;
    const [leadsRes, oppsRes, accRes, postRes] = run
        ? await Promise.all([
            supabase.from("leads").select("id, name, company, email, service, status").or(`name.ilike.${like},company.ilike.${like},email.ilike.${like}`).limit(20),
            supabase.from("opportunities").select("id, name, company, value, stage, service").or(`name.ilike.${like},company.ilike.${like},contact_name.ilike.${like}`).limit(20),
            supabase.from("accounts").select("id, name, industry").ilike("name", like).limit(20),
            supabase.from("posts").select("id, slug, title, locale, status").ilike("title", like).limit(20),
        ])
        : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

    const leads = (leadsRes.data ?? []) as { id: string; name: string | null; company: string | null; email: string | null; service: string | null; status: string | null }[];
    const opps = (oppsRes.data ?? []) as { id: string; name: string; company: string | null; value: number | null; stage: string; service: string | null }[];
    const accounts = (accRes.data ?? []) as { id: string; name: string; industry: string | null }[];
    const posts = (postRes.data ?? []) as { id: string; slug: string; title: string; locale: string; status: string }[];
    const total = leads.length + opps.length + accounts.length + posts.length;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Search</h1>
            <form action="/admin/search" method="get" className="mt-4">
                <input
                    name="q"
                    defaultValue={raw ?? ""}
                    autoFocus
                    placeholder="Search leads, deals, accounts, articles…"
                    className="w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
            </form>

            {q.length >= 2 ? (
                <p className="mt-3 text-sm text-slate-400">{total} result{total === 1 ? "" : "s"} for &ldquo;{q}&rdquo;</p>
            ) : (
                <p className="mt-3 text-sm text-slate-400">Type at least 2 characters.</p>
            )}

            <div className="mt-4 space-y-6">
                {opps.length > 0 && (
                    <Section title="Opportunities">
                        {opps.map((o) => (
                            <Row key={o.id} href={`/admin/opportunities/${o.id}`} title={o.name} sub={`${o.company ?? ""} · ${serviceName(o.service)}`} right={formatIDR(o.value ?? 0, true)} tag={o.stage} />
                        ))}
                    </Section>
                )}
                {leads.length > 0 && (
                    <Section title="Leads">
                        {leads.map((l) => (
                            <Row key={l.id} href={`/admin/leads/${l.id}`} title={l.name ?? l.email ?? "Lead"} sub={`${l.company ?? ""} · ${serviceName(l.service)}`} tag={l.status ?? "new"} />
                        ))}
                    </Section>
                )}
                {accounts.length > 0 && (
                    <Section title="Accounts">
                        {accounts.map((a) => (
                            <Row key={a.id} href={`/admin/accounts/${a.id}`} title={a.name} sub={a.industry ?? "Company"} />
                        ))}
                    </Section>
                )}
                {posts.length > 0 && (
                    <Section title="Articles">
                        {posts.map((p) => (
                            <Row key={p.id} href={`/admin/posts/${p.id}/edit`} title={p.title} sub={p.locale.toUpperCase()} tag={p.status} />
                        ))}
                    </Section>
                )}
                {run && total === 0 && <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400 shadow-sm">No matches.</p>}
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">{title}</h2>
            <div className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{children}</div>
        </div>
    );
}

function Row({ href, title, sub, right, tag }: { href: string; title: string; sub?: string; right?: string; tag?: string }) {
    return (
        <Link href={href} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50">
            <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">{title}</p>
                {sub && <p className="truncate text-xs text-slate-400">{sub}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-3">
                {right && <span className="text-sm font-semibold text-slate-700">{right}</span>}
                {tag && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-500">{tag}</span>}
            </div>
        </Link>
    );
}
