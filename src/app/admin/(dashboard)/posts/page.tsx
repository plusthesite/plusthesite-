import Link from "next/link";
import { articles as staticArticles } from "@/data/articles";
import { getSupabaseAdmin } from "@/lib/supabase";
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

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
        .select(
          "id, slug, title, locale, category, status, published_at, created_at",
        )
        .order("created_at", { ascending: false })
    : { data: [] };

  const dbRows = (data ?? []) as DbRow[];
  const dbSlugs = new Set(dbRows.map((row) => row.slug));

  const staticRows = staticArticles
    .filter((article) => !dbSlugs.has(article.slug))
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      locale: article.locale ?? "id",
      category: article.category,
    }));

  const counts = {
    all: dbRows.length + staticRows.length,
    published:
      dbRows.filter((row) => row.status === "published").length +
      staticRows.length,
    draft: dbRows.filter((row) => row.status === "draft").length,
    cms: dbRows.length,
    static: staticRows.length,
  };

  const showCms =
    !filter || filter === "cms" || filter === "published" || filter === "draft";
  const showStatic = !filter || filter === "static" || filter === "published";
  const visibleDb = dbRows.filter((row) =>
    filter === "published"
      ? row.status === "published"
      : filter === "draft"
        ? row.status === "draft"
        : true,
  );

  const tabs: { key: string; label: string; n: number }[] = [
    { key: "", label: "All", n: counts.all },
    { key: "published", label: "Published", n: counts.published },
    { key: "draft", label: "Drafts", n: counts.draft },
    { key: "cms", label: "CMS", n: counts.cms },
    { key: "static", label: "Static", n: counts.static },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Editorial hub
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Every article in one place, whether it already lives in CMS or
              still sits in static content.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Dipakai untuk mengelola artikel publik, memindahkan static article
              ke CMS, dan menjaga alur editorial tetap rapi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
              {counts.all} total posts
            </span>
            <Link
              href="/admin/posts/new"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              + New Post
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Published
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {counts.published}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/70">
              Drafts
            </p>
            <p className="mt-3 text-3xl font-black text-amber-700">
              {counts.draft}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/70">
              CMS
            </p>
            <p className="mt-3 text-3xl font-black text-sky-700">
              {counts.cms}
            </p>
          </div>
          <div className="rounded-2xl border border-violet-200/80 bg-violet-50/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700/70">
              Static
            </p>
            <p className="mt-3 text-3xl font-black text-violet-700">
              {counts.static}
            </p>
          </div>
        </div>
      </section>

      {!supabase && (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase is not configured. Run `supabase/posts.sql` and set the
          required env vars.
        </div>
      )}

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 text-sm">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key ? `/admin/posts?filter=${tab.key}` : "/admin/posts"}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                (filter ?? "") === tab.key
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab.label} ({tab.n})
            </Link>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Locale</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Source</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {counts.all === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No posts yet. Create your first one.
                    </td>
                  </tr>
                )}

                {showCms &&
                  visibleDb.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80">
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {row.title}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-500">
                          {row.locale}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {row.category || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            row.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
                          CMS
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(row.published_at ?? row.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          {row.status === "published" && (
                            <a
                              href={`/${row.locale}/blog/${row.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
                            >
                              View
                            </a>
                          )}
                          <Link
                            href={`/admin/posts/${row.id}/edit`}
                            className="text-xs font-semibold text-sky-600 transition-colors hover:text-sky-800"
                          >
                            Edit
                          </Link>
                          <form action={deletePost}>
                            <input type="hidden" name="id" value={row.id} />
                            <button className="text-xs font-semibold text-rose-500 transition-colors hover:text-rose-700">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}

                {showStatic &&
                  staticRows.map((row) => (
                    <tr
                      key={`static-${row.slug}`}
                      className="hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {row.title}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-500">
                          {row.locale}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {row.category || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          published
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                          Static
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">Code-defined</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={`/${row.locale}/blog/${row.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
                          >
                            View
                          </a>
                          <form action={importStaticPost}>
                            <input type="hidden" name="slug" value={row.slug} />
                            <button className="text-xs font-semibold text-violet-600 transition-colors hover:text-violet-800">
                              Import to CMS
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
