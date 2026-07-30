import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { createLead } from "../actions";

export const dynamic = "force-dynamic";

const field =
    "mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";
const label = "block text-xs font-bold uppercase tracking-wider text-slate-500";

export default function NewLeadPage() {
    return (
        <div className="max-w-2xl">
            <Link href="/admin/leads" className="text-xs font-semibold text-slate-400 hover:text-slate-600">
                ← Kembali ke Leads
            </Link>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">Tambah Lead Baru</h1>

            <form action={createLead} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className={label}>Nama Kontak</label>
                        <input name="name" className={field} placeholder="Nama PIC atau calon klien" />
                    </div>
                    <div>
                        <label className={label}>Perusahaan</label>
                        <input name="company" className={field} placeholder="Nama brand atau perusahaan" />
                    </div>
                    <div>
                        <label className={label}>Email</label>
                        <input name="email" type="email" className={field} placeholder="nama@perusahaan.com" />
                    </div>
                    <div>
                        <label className={label}>Telepon / WhatsApp</label>
                        <input name="phone" className={field} placeholder="+62 812..." />
                    </div>
                    <div>
                        <label className={label}>Layanan</label>
                        <select name="service" className={field} defaultValue="">
                            <option value="">— Belum dipilih —</option>
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
                            {["new", "contacted", "qualified", "unqualified", "converted"].map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={label}>Estimasi Nilai (IDR)</label>
                        <input name="value" type="number" min="0" className={field} placeholder="8000000" />
                    </div>
                    <div>
                        <label className={label}>Penanggung Jawab</label>
                        <input name="owner" className={field} placeholder="Nama sales atau owner lead" />
                    </div>
                </div>
                <div>
                    <label className={label}>Catatan</label>
                    <textarea
                        name="message"
                        rows={3}
                        className={field}
                        placeholder="Konteks awal, kebutuhan, atau sumber lead..."
                    />
                </div>
                <input type="hidden" name="locale" value="id" />
                <div className="flex justify-end gap-2">
                    <Link href="/admin/leads" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                        Batal
                    </Link>
                    <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        Simpan Lead
                    </button>
                </div>
            </form>
        </div>
    );
}
