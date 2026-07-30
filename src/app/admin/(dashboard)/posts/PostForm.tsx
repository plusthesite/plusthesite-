"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { createPost, updatePost } from "./actions";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] animate-pulse rounded-lg bg-slate-100" />
    ),
  },
);

export interface PostFormData {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  content?: string;
  image?: string;
  locale?: string;
  read_time?: string;
  status?: string;
}

const inputCls =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20";
const labelCls =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function PostForm({ post }: { post?: PostFormData }) {
  const isEdit = Boolean(post?.id);
  const action = isEdit ? updatePost : createPost;

  return (
    <form action={action} className="max-w-4xl space-y-5">
      {isEdit && <input type="hidden" name="id" value={post!.id} />}

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <label className={labelCls}>Judul</label>
        <input
          name="title"
          required
          defaultValue={post?.title ?? ""}
          className={inputCls}
          placeholder="Judul artikel"
        />
      </div>

      <div className="grid gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Slug</label>
          <input
            name="slug"
            required
            defaultValue={post?.slug ?? ""}
            className={inputCls}
            placeholder="judul-artikel-anda"
          />
        </div>
        <div>
          <label className={labelCls}>Kategori</label>
          <input
            name="category"
            defaultValue={post?.category ?? ""}
            className={inputCls}
            placeholder="AI, marketing, growth, dll."
          />
        </div>
      </div>

      <div className="grid gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Bahasa</label>
          <select
            name="locale"
            defaultValue={post?.locale ?? "en"}
            className={inputCls}
          >
            <option value="en">English</option>
            <option value="id">Indonesia</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select
            name="status"
            defaultValue={post?.status ?? "draft"}
            className={inputCls}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Estimasi baca</label>
          <input
            name="read_time"
            defaultValue={post?.read_time ?? "5 min"}
            className={inputCls}
            placeholder="5 min"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <label className={labelCls}>URL cover image</label>
        <input
          name="image"
          defaultValue={post?.image ?? ""}
          className={inputCls}
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <label className={labelCls}>Tag (pisahkan dengan koma)</label>
        <input
          name="tags"
          defaultValue={(post?.tags ?? []).join(", ")}
          className={inputCls}
          placeholder="AI, Marketing, SEO"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <label className={labelCls}>Deskripsi meta</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={post?.description ?? ""}
          className={inputCls}
          placeholder="Ringkasan singkat untuk SEO dan preview card"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <label className={labelCls}>Konten</label>
        <RichTextEditor name="content" defaultValue={post?.content ?? ""} />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          {isEdit ? "Simpan perubahan" : "Buat artikel"}
        </button>
        <Link
          href="/admin/posts"
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
