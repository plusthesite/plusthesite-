import Link from "next/link";
import { SalesFunnel } from "./SalesFunnel";

export const dynamic = "force-dynamic";

const STEPS = [
    { n: 1, icon: "⭐", t: "Buka Priority", d: "Lead sudah diurutkan otomatis. Kerjakan dari atas (yang paling panas dulu).", href: "/admin/priority" },
    { n: 2, icon: "💬", t: "Sapa via WhatsApp", d: "Klik lead → Quick Message → ganti kalimat pembuka biar personal → kirim.", href: "/admin/leads" },
    { n: 3, icon: "📝", t: "Catat hasilnya", d: "Setiap balasan dicatat di Activity, biar nggak lupa & gampang follow up.", href: null },
    { n: 4, icon: "🎯", t: "Yang tertarik → Convert", d: "Jadikan Opportunity. Yang belum balas, jadwalkan follow-up (Task).", href: "/admin/opportunities" },
];

const STAGES = [
    { s: "New", emoji: "🆕", color: "border-t-slate-300", task: "Lead baru. Kirim pesan perkenalan (jangan lupa personalisasi!)." },
    { s: "Contacted", emoji: "💬", color: "border-t-blue-400", task: "Sudah disapa. Mulai ngobrol, tanya kebutuhan — belum jualan." },
    { s: "Qualified", emoji: "✅", color: "border-t-indigo-400", task: "Cocok & butuh. Saatnya ubah jadi Opportunity." },
    { s: "Proposal", emoji: "📄", color: "border-t-violet-400", task: "Penawaran terkirim. Fokus ke hasil buat mereka, bukan daftar fitur." },
    { s: "Negotiation", emoji: "🤝", color: "border-t-amber-400", task: "Bahas harga/scope. Beri pilihan paket — jangan langsung obral diskon." },
    { s: "Closed Won", emoji: "🏆", color: "border-t-emerald-400", task: "Deal! 🎉 Kirim invoice, jadwalkan kickoff, serahkan ke tim." },
];

const TRUST = [
    { icon: "❓", t: "Tanya, jangan jualan", d: "Pesan pertama tujuannya dapat balasan — bukan langsung nawarin. Ajukan 1 pertanyaan tentang bisnis mereka." },
    { icon: "✍️", t: "Bikin personal", d: "Sebut hal spesifik (menu, lokasi, atau layanan mereka). Pesan yang sama persis ke semua orang = ketahuan template." },
    { icon: "🙋", t: "Pakai nama sendiri", d: "Tanda tangani dengan nama kamu, bukan 'tim'. Orang lebih percaya ke orang. Balas cepat & ramah." },
];

const ASK = [
    { icon: "🎯", k: "Apa yang dibutuhkan", q: "“Apa yang paling bikin repot sekarang? Idealnya seperti apa buat Anda?”" },
    { icon: "💰", k: "Soal anggaran", q: "“Untuk hal ini sudah ada anggaran yang disiapkan, atau masih cari info dulu?”" },
    { icon: "👤", k: "Siapa yang memutuskan", q: "“Selain Bapak/Ibu, ada yang biasanya ikut memutuskan?”" },
    { icon: "📅", k: "Kapan mau mulai", q: "“Kalau cocok, kira-kira ingin mulai kapan? Ada target tertentu?”" },
];

const DOUBTS = [
    { o: "“Mahal / belum ada budget.”", r: "Wajar 🙂. Tanya hasil yang diharapkan, lalu tawarkan mulai dari paket kecil (Rp 2,5jt/bln) — naik kalau sudah kelihatan hasilnya." },
    { o: "“Sudah ada tim/vendor.”", r: "Bagus berarti sudah jalan. Tawarkan melengkapi (mis. otomasi WA / CRM), atau kirim 1 ide kecil yang berguna." },
    { o: "“Nanti dulu, belum sempat.”", r: "Santai, nggak buru-buru. Minta izin follow up minggu depan, atau kirim ringkasan biar bisa dilihat santai." },
    { o: "“Dapat nomor saya dari mana?”", r: "Jujur: dari Google Bisnis mereka yang publik. Minta maaf kalau mengganggu, tawarkan langsung dihapus kalau tak berkenan." },
];

const CLOSE = [
    "Ringkas hasilnya, bukan harganya: “Jadi dengan ini, [hasil konkret]. Sesuai ya?”",
    "Tawarkan langkah kecil yang jelas: “Kita mulai bulan ini, saya kirim invoice & kickoff minggu depan?”",
    "Selalu sepakati langkah berikutnya + tanggalnya (buat Task!) — jangan tutup chat menggantung.",
    "Kalau gagal, catat alasannya. Bisa ditawari lagi kuartal depan.",
];

function H({ children }: { children: React.ReactNode }) {
    return <h2 className="mt-10 text-base font-bold text-slate-900">{children}</h2>;
}

export default function PlaybookPage() {
    return (
        <div className="max-w-5xl">
            <h1 className="text-2xl font-bold text-slate-900">Panduan Sales</h1>
            <p className="mt-1 text-sm text-slate-500">Cara mengubah lead jadi pelanggan — simpel, langkah demi langkah. <span className="font-semibold text-slate-700">Pelan tapi personal &gt; banyak tapi spam.</span></p>

            {/* Live funnel */}
            <div className="mt-6"><SalesFunnel /></div>

            {/* Daily routine */}
            <H>🗓️ Rutinitas harianmu</H>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map((s) => {
                    const card = (
                        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">{s.n}</span>
                                <span className="text-xl">{s.icon}</span>
                            </div>
                            <p className="mt-3 text-sm font-bold text-slate-900">{s.t}</p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.d}</p>
                        </div>
                    );
                    return s.href ? <Link key={s.n} href={s.href} className="block">{card}</Link> : <div key={s.n}>{card}</div>;
                })}
            </div>
            <p className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">💡 Target realistis: <strong>10–15 lead per hari</strong>. Jangan dihajar semua sekaligus — kualitas obrolan lebih penting.</p>

            {/* Pipeline stages */}
            <H>📊 6 tahap sebuah deal — & kapan naik ke tahap berikut</H>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {STAGES.map((st) => (
                    <div key={st.s} className={`rounded-2xl border border-t-4 border-slate-200 bg-white p-5 shadow-sm ${st.color}`}>
                        <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><span className="text-lg">{st.emoji}</span> {st.s}</p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600">{st.task}</p>
                    </div>
                ))}
            </div>

            {/* Trust principles */}
            <H>🤝 3 kunci biar calon pelanggan percaya</H>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {TRUST.map((p) => (
                    <div key={p.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <span className="text-2xl">{p.icon}</span>
                        <p className="mt-2 text-sm font-bold text-slate-900">{p.t}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{p.d}</p>
                    </div>
                ))}
            </div>

            {/* Discovery questions */}
            <H>💡 Sebelum kasih harga, pahami 4 hal ini</H>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {ASK.map((a) => (
                    <div key={a.k} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <span className="text-2xl">{a.icon}</span>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{a.k}</p>
                            <p className="mt-1 text-sm italic text-slate-500">{a.q}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Objections */}
            <H>🛟 Kalau calon pelanggan ragu — ini cara menjawabnya</H>
            <div className="mt-3 space-y-3">
                {DOUBTS.map((d, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-rose-600">{d.o}</p>
                        <p className="mt-1.5 flex gap-2 text-sm text-slate-700"><span className="text-emerald-500">↳</span> {d.r}</p>
                    </div>
                ))}
            </div>

            {/* Closing */}
            <H>🏁 Cara menutup deal</H>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <ul className="space-y-2.5">
                    {CLOSE.map((c, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-slate-700"><span className="mt-0.5 text-emerald-500">✓</span> <span>{c}</span></li>
                    ))}
                </ul>
            </div>

            {/* Tools */}
            <H>🧰 Alat yang dipakai</H>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    { href: "/admin/priority", t: "Priority", d: "Lead di-ranking otomatis. Mulai dari sini tiap hari." },
                    { href: "/admin/leads", t: "Leads", d: "Semua prospek. Filter layanan, Quick Message, Convert." },
                    { href: "/admin/opportunities", t: "Opportunities", d: "Deal aktif. Geser tahap di papan Kanban." },
                    { href: "/admin/tasks", t: "Tasks", d: "Follow-up terjadwal. Cek tiap pagi." },
                    { href: "/admin/accounts", t: "Accounts", d: "Perusahaan + semua lead/deal-nya." },
                    { href: "/admin", t: "Today's Focus", d: "Di Dashboard: 5 lead terpanas + task hari ini." },
                ].map((x) => (
                    <Link key={x.t} href={x.href} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                        <p className="text-sm font-bold text-blue-600">{x.t} →</p>
                        <p className="mt-1 text-xs text-slate-500">{x.d}</p>
                    </Link>
                ))}
            </div>

            <p className="mt-8 rounded-2xl bg-slate-900 p-5 text-center text-sm font-semibold text-white">
                Ingat: 1 obrolan personal &gt; 100 pesan spam. Pelan, ramah, konsisten — itu yang closing. 🎯
            </p>
        </div>
    );
}
