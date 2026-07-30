import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { articles as staticArticles } from "@/data/articles";
import { deletePost, importStaticPost } from "./actions";

export const dynamic = "force-dynamic";

interface DbRow {
    id: string;
    slug: string;
    title: string;
    locale: string;
    category: string | null;
    status: string;
    published_at: string | null;
    created_at: string;
}

export default async function PostsPage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string }>;
}) {
    const { filter } = await searchParams;
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
            .from("posts")
            .select("id, slug, title, locale, category, status, published_at, created_at")
            .order("created_at", { ascending: false })
        : { data: [] };
    const dbRows = (data ?? []) as DbRow[];
    const dbSlugs = new Set(dbRows.map((r) => r.slug));

    // Static (code-defined) articles not yet imported into the CMS.
    const staticRows = staticArticles
        .filter((a) => !dbSlugs.has(a.slug))
        .map((a) => ({ slug: a.slug, title: a.title, locale: a.locale ?? "id", category: a.category }));

    const counts = {
        all: dbRows.length + staticRows.length,
        published: dbRows.filter((r) => r.status === "published").length + staticRows.length,
        draft: dbRows.filter((r) => r.status === "draft").length,
        cms: dbRows.length,
        static: staticRows.length,
    };

    const showCms = !filter || filter === "cms" || filter === "published" || filter === "draft";
    const showStatic = !filter || filter === "static" || filter === "published";
    const visibleDb = dbRows.filter((r) => (filter === "published" ? r.status === "published" : filter === "draft" ? r.status === "draft" : true));

    const tabs: { key: string; label: string; n: number }[] = [
        { key: "", label: "All", n: counts.all },
        { key: "published", label: "Published", n: counts.published },
        { key: "draft", label: "Drafts", n: counts.draft },
        { key: "cms", label: "CMS", n: counts.cms },
        { key: "static", label: "Static", n: counts.static },
    ];

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">All Posts</h1>
                    <p className="mt-1 text-sm text-slate-500">Every article in one place — edit CMS posts, or import a static one to make it editable.</p>
                </div>
                <Link href="/admin/posts/new" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                    + New Post
                </Link>
            </div>

            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Supabase isn&apos;t configured. Run <code className="font-mono">supabase/posts.sql</code> and set the env vars.
                </div>
            )}

            {/* WordPress-style status tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-sm">
                {tabs.map((tb) => (
                    <Link
                        key={tb.key}
                        href={tb.key ? `/admin/posts?filter=${tb.key}` : "/admin/posts"}
                        className={`rounded-md px-3 py-1.5 font-medium ${(filter ?? "") === tb.key ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                        {tb.label} <span className="opacity-60">({tb.n})</span>
                    </Link>
                ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Title</th>
                            <th className="px-5 py-3 font-semibold">Lang</th>
                            <th className="px-5 py-3 font-semibold">Category</th>
                            <th className="px-5 py-3 font-semibold">Status</th>
                            <th className="px-5 py-3 font-semibold">Source</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {counts.all === 0 && (
                            <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No posts yet. Create your first one.</td></tr>
                        )}

                        {showCms && visibleDb.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3 font-medium text-slate-800">{r.title}</td>
                                <td className="px-5 py-3"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-500">{r.locale}</span></td>
                                <td className="px-5 py-3 text-slate-500">{r.category || "—"}</td>
                                <td className="px-5 py-3">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{r.status}</span>
                                </td>
                                <td className="px-5 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">CMS</span></td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center justify-end gap-3">
                                        {r.status === "published" && (
                                            <a href={`/${r.locale}/blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-slate-400 hover:text-slate-600">View</a>
                                        )}
                                        <Link href={`/admin/posts/${r.id}/edit`} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Edit</Link>
                                        <form action={deletePost}>
                                            <input type="hidden" name="id" value={r.id} />
                                            <button className="text-xs font-semibold text-rose-500 hover:text-rose-700">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {showStatic && staticRows.map((r) => (
                            <tr key={`static-${r.slug}`} className="hover:bg-slate-50">
                                <td className="px-5 py-3 font-medium text-slate-800">{r.title}</td>
                                <td className="px-5 py-3"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-500">{r.locale}</span></td>
                                <td className="px-5 py-3 text-slate-500">{r.category || "—"}</td>
                                <td className="px-5 py-3"><span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">published</span></td>
                                <td className="px-5 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">Static</span></td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center justify-end gap-3">
                                        <a href={`/${r.locale}/blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-slate-400 hover:text-slate-600">View</a>
                                        <form action={importStaticPost}>
                                            <input type="hidden" name="slug" value={r.slug} />
                                            <button className="text-xs font-semibold text-violet-600 hover:text-violet-800">Import to CMS →</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
