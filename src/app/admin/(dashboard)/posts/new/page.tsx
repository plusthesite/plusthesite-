import PostForm from "../PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            New article
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            Draft a new blog post and publish it when the article is ready for
            the public site.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Tulis artikel baru, atur locale dan kategori, lalu ubah status ke
            published kalau memang siap tayang.
          </p>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <PostForm />
      </section>
    </div>
  );
}
