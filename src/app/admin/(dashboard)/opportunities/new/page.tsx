import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { createOpportunity } from "../actions";
import { STAGES } from "../constants";

export const dynamic = "force-dynamic";

const field =
  "mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none";
const label = "block text-xs font-bold uppercase tracking-wider text-slate-500";

export default function NewOpportunityPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <Link
          href="/admin/opportunities"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
        >
          {"<-"} Kembali ke Opportunities
        </Link>
        <div className="mt-4 max-w-3xl">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Manual opportunity
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            Tambah opportunity baru saat deal sudah cukup jelas untuk langsung
            masuk pipeline.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Cocok untuk deal hasil referral, closing call, inbound matang, atau
            lead yang sudah tidak perlu lagi lewat tahap screening awal.
          </p>
        </div>
      </section>

      <form
        action={createOpportunity}
        className="max-w-3xl space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm"
      >
        <div>
          <label className={label}>Nama Deal *</label>
          <input
            name="name"
            required
            className={field}
            placeholder="Contoh: AI Chatbot / Batik Nusantara"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Perusahaan</label>
            <input
              name="company"
              className={field}
              placeholder="Nama perusahaan atau brand"
            />
          </div>
          <div>
            <label className={label}>Nama Kontak</label>
            <input
              name="contact_name"
              className={field}
              placeholder="PIC utama atau pengambil keputusan"
            />
          </div>
          <div>
            <label className={label}>Email</label>
            <input
              name="email"
              type="email"
              className={field}
              placeholder="nama@perusahaan.com"
            />
          </div>
          <div>
            <label className={label}>Telepon / WhatsApp</label>
            <input name="phone" className={field} placeholder="+62 812..." />
          </div>
          <div>
            <label className={label}>Nilai Deal (IDR)</label>
            <input
              name="value"
              type="number"
              min="0"
              className={field}
              placeholder="15000000"
            />
          </div>
          <div>
            <label className={label}>Layanan</label>
            <select name="service" className={field} defaultValue="">
              <option value="">Belum dipilih</option>
              {SERVICES.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Tahap</label>
            <select name="stage" className={field} defaultValue="new">
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Penanggung Jawab</label>
            <input
              name="owner"
              className={field}
              placeholder="Nama sales atau account owner"
            />
          </div>
          <div>
            <label className={label}>Target Closing</label>
            <input name="expected_close" type="date" className={field} />
          </div>
          <div>
            <label className={label}>Sumber</label>
            <input
              name="source"
              className={field}
              placeholder="Manual, inbound, referral..."
              defaultValue="manual"
            />
          </div>
        </div>
        <div>
          <label className={label}>Catatan</label>
          <textarea
            name="notes"
            rows={4}
            className={field}
            placeholder="Konteks deal, kebutuhan klien, atau next step..."
          />
        </div>
        <input type="hidden" name="locale" value="id" />
        <div className="flex justify-end gap-2">
          <Link
            href="/admin/opportunities"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </Link>
          <button className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Simpan Opportunity
          </button>
        </div>
      </form>
    </div>
  );
}
