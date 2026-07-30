import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { createLead } from "../actions";

export const dynamic = "force-dynamic";

const field =
  "mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none";
const label = "block text-xs font-bold uppercase tracking-wider text-slate-500";

export default function NewLeadPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
        >
          {"<-"} Kembali ke Leads
        </Link>
        <div className="mt-4 max-w-3xl">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
            Manual lead entry
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            Tambah lead baru secara manual saat prospek masuk dari luar alur
            inbound biasa.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Cocok untuk lead dari referral, event, outreach manual, atau input
            cepat dari tim sales yang perlu segera masuk ke CRM.
          </p>
        </div>
      </section>

      <form
        action={createLead}
        className="max-w-3xl space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Nama Kontak</label>
            <input
              name="name"
              className={field}
              placeholder="Nama PIC atau calon klien"
            />
          </div>
          <div>
            <label className={label}>Perusahaan</label>
            <input
              name="company"
              className={field}
              placeholder="Nama brand atau perusahaan"
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
            <label className={label}>Status</label>
            <select name="status" className={field} defaultValue="new">
              {[
                "new",
                "contacted",
                "qualified",
                "unqualified",
                "converted",
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Estimasi Nilai (IDR)</label>
            <input
              name="value"
              type="number"
              min="0"
              className={field}
              placeholder="8000000"
            />
          </div>
          <div>
            <label className={label}>Penanggung Jawab</label>
            <input
              name="owner"
              className={field}
              placeholder="Nama sales atau owner lead"
            />
          </div>
        </div>
        <div>
          <label className={label}>Catatan</label>
          <textarea
            name="message"
            rows={4}
            className={field}
            placeholder="Konteks awal, kebutuhan, atau sumber lead..."
          />
        </div>
        <input type="hidden" name="locale" value="id" />
        <div className="flex justify-end gap-2">
          <Link
            href="/admin/leads"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </Link>
          <button className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Simpan Lead
          </button>
        </div>
      </form>
    </div>
  );
}
