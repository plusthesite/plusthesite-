import Link from "next/link";
import { SalesFunnel } from "./SalesFunnel";

export const dynamic = "force-dynamic";

const STAGES = [
    { s: "New", c: "bg-slate-100 text-slate-600", arti: "Lead baru, belum dihubungi.", aksi: "Kirim pesan Intro (personalisasi dulu!). Catat di Activity.", lanjut: "Begitu sudah dikirim/dihubungi → Contacted." },
    { s: "Contacted", c: "bg-blue-50 text-blue-700", arti: "Sudah dihubungi, menunggu/ada balasan.", aksi: "Bangun obrolan. Tanya kebutuhan, jangan jualan dulu.", lanjut: "Kalau ada minat & kebutuhan jelas → Qualified." },
    { s: "Qualified", c: "bg-indigo-50 text-indigo-700", arti: "Cocok: butuh, ada budget, orang yang tepat.", aksi: "Gali detail (BANT). Convert lead → Opportunity di sini.", lanjut: "Setelah setuju lihat penawaran → Proposal." },
    { s: "Proposal", c: "bg-violet-50 text-violet-700", arti: "Penawaran/proposal sudah dikirim.", aksi: "Presentasikan ringkas, fokus hasil (bukan fitur). Konfirmasi pemahaman.", lanjut: "Kalau nego harga/scope → Negotiation." },
    { s: "Negotiation", c: "bg-amber-50 text-amber-700", arti: "Tawar-menawar harga, scope, atau timeline.", aksi: "Jaga nilai, beri opsi (paket lebih kecil), bukan asal diskon.", lanjut: "Deal disepakati → Won. Tidak jadi → Lost (catat alasan)." },
    { s: "Won", c: "bg-emerald-50 text-emerald-700", arti: "🎉 Closed Won — deal jadi.", aksi: "Kirim invoice/PO, jadwalkan kickoff, serah-terima ke tim delivery.", lanjut: "Selesai. Minta testimoni setelah hasil keluar." },
];

const PRINCIPLES = [
    { t: "Tanya, jangan jualan", d: "Pesan pertama tujuannya dapat balasan, bukan closing. Ajukan 1 pertanyaan relevan tentang bisnis mereka." },
    { t: "Personalisasi 1 kalimat", d: "Sebut hal spesifik (menu, lokasi, layanan mereka). Jangan kirim pesan yang sama persis ke semua — itu yang bikin ketahuan template." },
    { t: "Pakai nama asli", d: "Tanda tangani dengan nama kamu, bukan 'tim'. Orang percaya ke orang. Balas cepat & ramah." },
];

const BANT = [
    { k: "Budget", q: "“Untuk hal seperti ini, kira-kira sudah ada anggaran yang disiapkan, atau masih tahap cari info?”" },
    { k: "Authority", q: "“Selain Bapak/Ibu, ada yang biasanya ikut memutuskan untuk hal ini?”" },
    { k: "Need", q: "“Apa yang paling bikin repot sekarang soal {layanan}? Apa yang ideal buat Anda?”" },
    { k: "Timeline", q: "“Kalau cocok, kira-kira ingin mulai kapan? Ada momen/target tertentu?”" },
];

const OBJECTIONS = [
    { o: "“Mahal / belum ada budget.”", r: "“Wajar. Boleh saya tahu hasil seperti apa yang Anda harapkan? Kita bisa mulai dari paket kecil dulu (mulai Rp 2,5jt/bln) yang penting jalan, lalu naik kalau sudah kelihatan hasilnya.”" },
    { o: "“Sudah ada vendor/tim sendiri.”", r: "“Bagus berarti sudah jalan. Saya nggak mau ganggu yang sudah baik — biasanya kami justru melengkapi (mis. otomasi WA / CRM). Boleh saya kirim 1 ide kecil, kalau berguna silakan dipakai?”" },
    { o: "“Nanti dulu / belum sempat.”", r: "“Siap, nggak buru-buru sama sekali. Boleh saya simpan kontak dan follow up minggu depan? Atau saya kirim ringkasannya saja dulu biar bisa dilihat santai?”" },
    { o: "“Kirim proposal/harga dulu aja.”", r: "“Boleh banget. Biar penawarannya pas (bukan template), boleh saya tanya 2 hal singkat dulu soal kebutuhan Anda?”" },
    { o: "“Dapat nomor saya dari mana?”", r: "“Dari profil Google Bisnis Anda yang publik 🙏 Mohon maaf kalau mengganggu — kalau tidak berkenan, tinggal bilang, langsung saya hapus dari daftar.”" },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export default function PlaybookPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-900">Sales Playbook</h1>
            <p className="mt-1 text-sm text-slate-500">Panduan lengkap tim sales: dari lead jadi <strong>Closed Won</strong>. Kualitas &gt; kuantitas.</p>

            {/* Live funnel monitor */}
            <h2 className="mt-6 text-sm font-bold uppercase tracking-wide text-slate-400">Monitor proses (live)</h2>
            <div className="mt-3"><SalesFunnel /></div>

            {/* Daily routine */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">Rutinitas harian</h2>
            <Card className="mt-3">
                <ol className="space-y-3 text-sm text-slate-700">
                    <li><strong>1.</strong> Buka <Link href="/admin/priority" className="font-semibold text-blue-600 hover:underline">Priority</Link> — kerjakan dari atas (🔴 Hot dulu). <strong>Target realistis: 10–15 lead/hari.</strong> Jangan hajar semua sekaligus.</li>
                    <li><strong>2.</strong> Klik lead → <strong>Quick Message</strong> → <strong>edit baris pembuka</strong> (sebut hal spesifik) → kirim WhatsApp.</li>
                    <li><strong>3.</strong> Catat setiap kontak/balasan di <strong>Activity</strong> pada halaman detail lead.</li>
                    <li><strong>4.</strong> Yang tertarik → <strong>Convert → Opportunity</strong>. Yang belum balas → jadwalkan <strong>Task</strong> follow-up (2–3 hari).</li>
                    <li><strong>5.</strong> Pagi hari, cek <Link href="/admin/tasks" className="font-semibold text-blue-600 hover:underline">Tasks</Link> — kerjakan follow-up yang jatuh tempo dulu.</li>
                </ol>
            </Card>

            {/* Pipeline */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">6 Tahap pipeline — apa & kapan lanjut</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr><th className="px-4 py-3 font-semibold">Tahap</th><th className="px-4 py-3 font-semibold">Aksi kamu</th><th className="px-4 py-3 font-semibold">Kapan naik</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {STAGES.map((s) => (
                            <tr key={s.s} className="align-top">
                                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.c}`}>{s.s}</span><p className="mt-1 text-xs text-slate-400">{s.arti}</p></td>
                                <td className="px-4 py-3 text-slate-700">{s.aksi}</td>
                                <td className="px-4 py-3 text-slate-500">{s.lanjut}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Organic principles */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">3 kunci reach-out organik (biar dipercaya)</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {PRINCIPLES.map((p, i) => (
                    <Card key={i}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">{i + 1}</span>
                        <h3 className="mt-3 text-sm font-bold text-slate-900">{p.t}</h3>
                        <p className="mt-1 text-sm text-slate-600">{p.d}</p>
                    </Card>
                ))}
            </div>

            {/* Qualification */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">Kualifikasi — 4 hal yang harus tahu (BANT)</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {BANT.map((b) => (
                    <Card key={b.k}>
                        <span className="text-xs font-bold uppercase tracking-wide text-primary">{b.k}</span>
                        <p className="mt-1 text-sm italic text-slate-600">{b.q}</p>
                    </Card>
                ))}
            </div>

            {/* Objection handling */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">Menjawab keberatan (objection handling)</h2>
            <div className="mt-3 space-y-3">
                {OBJECTIONS.map((o, i) => (
                    <Card key={i}>
                        <p className="text-sm font-semibold text-rose-600">{o.o}</p>
                        <p className="mt-1.5 text-sm text-slate-700">↳ {o.r}</p>
                    </Card>
                ))}
            </div>

            {/* Closing */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">Menutup deal (closing)</h2>
            <Card className="mt-3">
                <ul className="space-y-2 text-sm text-slate-700">
                    <li>• <strong>Ringkas hasil, bukan harga.</strong> “Jadi dengan ini, {`{layanan}`} Anda bisa [hasil konkret]. Sesuai ya?”</li>
                    <li>• <strong>Tawarkan langkah kecil & jelas.</strong> “Kalau oke, kita mulai dengan [paket/scope] bulan ini. Saya kirim invoice & kita kickoff minggu depan?”</li>
                    <li>• <strong>Urgensi yang jujur.</strong> Slot tim terbatas / momen musiman (Lebaran, akhir tahun) — jangan mengarang diskon palsu.</li>
                    <li>• <strong>Selalu ada next step.</strong> Jangan tutup chat tanpa kesepakatan langkah berikutnya + tanggalnya (buat Task!).</li>
                    <li>• <strong>Kalau Lost, catat alasannya.</strong> Bisa di-reach lagi kuartal depan.</li>
                </ul>
            </Card>

            {/* Tools */}
            <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">Tools yang dipakai</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Card><Link href="/admin/priority" className="text-sm font-bold text-blue-600 hover:underline">Priority →</Link><p className="mt-1 text-xs text-slate-500">Lead di-ranking otomatis. Mulai dari sini tiap hari.</p></Card>
                <Card><Link href="/admin/leads" className="text-sm font-bold text-blue-600 hover:underline">Leads →</Link><p className="mt-1 text-xs text-slate-500">Semua prospek. Filter per layanan, Quick Message, Convert.</p></Card>
                <Card><Link href="/admin/opportunities" className="text-sm font-bold text-blue-600 hover:underline">Opportunities →</Link><p className="mt-1 text-xs text-slate-500">Deal aktif. Geser tahap di Kanban board.</p></Card>
                <Card><Link href="/admin/tasks" className="text-sm font-bold text-blue-600 hover:underline">Tasks →</Link><p className="mt-1 text-xs text-slate-500">Follow-up terjadwal. Cek tiap pagi.</p></Card>
                <Card><Link href="/admin/accounts" className="text-sm font-bold text-blue-600 hover:underline">Accounts →</Link><p className="mt-1 text-xs text-slate-500">Perusahaan + semua lead/deal-nya.</p></Card>
                <Card><span className="text-sm font-bold text-slate-800">Quick Message</span><p className="mt-1 text-xs text-slate-500">Ada di tiap detail lead/deal. Edit dulu sebelum kirim!</p></Card>
            </div>

            <p className="mt-8 rounded-xl bg-slate-900 p-5 text-center text-sm font-semibold text-white">
                Ingat: 1 percakapan personal &gt; 100 pesan spam. Pelan, ramah, konsisten — itu yang closing. 🎯
            </p>
        </div>
    );
}
