import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import PostForm, { type PostFormData } from "../../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase.from("posts").select("*").eq("id", id).maybeSingle()
    : { data: null };

  if (!data) notFound();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
            Edit article
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            Update the post, save the latest revision, and keep the live article
            aligned.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Perubahan pada post CMS disimpan langsung di sini. Kalau statusnya
            published, update akan memengaruhi artikel publik terkait.
          </p>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <PostForm post={data as PostFormData} />
      </section>
    </div>
  );
}
