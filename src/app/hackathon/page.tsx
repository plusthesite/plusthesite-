import Image from "next/image";
import Link from "next/link";
import { kpi, healthScore, promoConversion, rpShort } from "@/lib/hackathon/analytics";
import { KOPERASI, DATES } from "@/lib/hackathon/seed";

export default function HackathonLanding() {
    const total = kpi({});
    const health = healthScore();
    const topPromo = promoConversion()[0];

    return (
        <div className="nalar-root">
            <SiteNav />

            {/* Hero */}
            <header className="relative overflow-hidden">
                <div
                    className="absolute inset-0 -z-10"
                    style={{ background: "radial-gradient(1200px 400px at 20% -10%, #E7F1EB 0%, transparent 60%), radial-gradient(900px 500px at 100% 0%, #FAF6EC 0%, transparent 55%)" }}
                />
                <div className="mx-auto max-w-6xl px-5 pt-14 pb-12 sm:pt-20">
                    <div className="nalar-rise max-w-3xl">
                        <div className="flex flex-wrap gap-2">
                            <span className="nalar-chip" style={{ background: "var(--hijau-terang)", color: "var(--hijau)" }}>
                                ● Hackathon Kementerian Koperasi 2026 · Tema 1
                            </span>
                            <span className="nalar-chip" style={{ background: "var(--kertas)", color: "var(--kuning)" }}>
                                Selaras skema resmi Kemenkop · 27 tabel · 58 relasi
                            </span>
                        </div>
                        <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
                            Peningkatan Usaha Koperasi<br />
                            <span style={{ color: "var(--hijau)" }}>Melalui Teknologi Digital</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg" style={{ color: "var(--kabur)" }}>
                            <strong>SUARA WARGA</strong> berdiri di atas dua pilar: <strong>SAKSI</strong> membuat setiap
                            transaksi lahir jujur & tak bisa dipalsukan, lalu <strong>NALAR</strong> mengubah data jujur itu
                            menjadi keputusan bisnis dalam hitungan detik.
                        </p>
                        <p className="mt-3 text-sm font-semibold italic" style={{ color: "var(--hijau-aksi)" }}>
                            “Setiap Rupiah Ada Saksinya, Setiap Keputusan Ada Dasarnya.”
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/hackathon/login"
                                className="rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
                                style={{ background: "var(--hijau)" }}
                            >
                                Masuk Dashboard →
                            </Link>
                            <Link
                                href="/hackathon/verifikasi"
                                className="rounded-xl border px-6 py-3.5 text-sm font-bold transition hover:bg-white"
                                style={{ borderColor: "var(--garis)", color: "var(--hijau)" }}
                            >
                                Cek Struk (tanpa login)
                            </Link>
                        </div>
                    </div>

                    {/* Live metric strip - proves the engine is real */}
                    <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Metric label="Omzet 14 hari" value={rpShort(total.omzet)} sub={`${total.transaksi} transaksi teratestasi`} />
                        <Metric label="Skor Kesehatan Koperasi" value={`${health.skor}/100`} sub={health.status} />
                        <Metric label="Konversi Tebus Murah" value={`${Math.round(topPromo.rasio * 100)}%`} sub={`${topPromo.sales.nama.split(" ")[0]} (${topPromo.konversi}/${topPromo.dilayani})`} />
                        <Metric label="Integritas Ledger" value="100%" sub="anti scan-ganda (SAKSI)" />
                    </div>
                </div>
            </header>

            {/* Problem */}
            <section className="mx-auto max-w-6xl px-5 py-14">
                <SectionTitle kicker="Masalah" title="Koperasi tahu ada uang masuk, tapi buta arah bisnis" />
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <Problem n="01" t="Data tidak bisa dipercaya" d="Pencatatan di satu tangan bisa diedit diam-diam. Insight dari data kotor hanya menyesatkan keputusan." />
                    <Problem n="02" t="Manajemen ambil keputusan pakai feeling" d="Tidak tahu produk apa laku, sales mana perform, kapan jam ramai, promo mana efektif → stok mati, omzet stagnan." />
                    <Problem n="03" t="Pengurus senior gaptek" d="Direktur harus mengawasi & memutuskan, tapi alergi tabel mentah. Butuh jawaban dalam bahasa manusia." />
                </div>
            </section>

            {/* Two pillars */}
            <section className="mx-auto max-w-6xl px-5 py-6">
                <SectionTitle kicker="Solusi" title="Satu produk, dua pilar yang saling mengunci" />
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <Pillar
                        tag="Pilar 1 · Integritas"
                        name="SAKSI"
                        tagline="Data lahir jujur"
                        desc="Setiap transaksi disaksikan dua pihak, terkunci dalam rantai hash (bukan blockchain), dan meninggalkan struk terverifikasi. Kasir tak bisa scan-ganda atau menyembunyikan diskon."
                        points={["Atestasi ganda offline-first", "Rantai hash anti-utak-atik", "Struk publik: ASLI / TIDAK COCOK", "Jembatan data bersih ke NALAR"]}
                        cta={{ href: "/hackathon/verifikasi", label: "Coba verifikasi struk" }}
                        dark
                    />
                    <Pillar
                        tag="Pilar 2 · Kecerdasan"
                        name="NALAR"
                        tagline="Data jadi keputusan"
                        desc="Navigasi, Analisis, Laporan, Aktivitas & Rekomendasi. Dashboard interaktif untuk manager + AI chatbot prompt-terbatas untuk direktur. Dari data jujur, lahir aksi."
                        points={["Dashboard BI + filter real-time", "AI rekomendasi produk & piket", "Skor kesehatan & prediksi omzet", "Chatbot direktur (RAG, anti-ngarang)"]}
                        cta={{ href: "/hackathon/login", label: "Masuk dashboard NALAR" }}
                    />
                </div>
            </section>

            {/* Tema 1 solution map */}
            <section className="mx-auto max-w-6xl px-5 py-14">
                <SectionTitle kicker="Cakupan Tema 1" title="Enam jenis solusi Tema 1, semuanya ada di NALAR" />
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Solution icon="📊" t="Business Intelligence Dashboard" d="Total penjualan, kehadiran, aktivitas, audit harian, detail SKU, filter per sales/kategori/periode/shift." />
                    <Solution icon="🤖" t="AI Business Recommendation" d="Produk top-tier untuk di-restock, komposisi piket prime-time, alert stok menipis." />
                    <Solution icon="❤️‍🩹" t="Monitoring Kesehatan Koperasi" d="Skor kesehatan komposit: integritas, pertumbuhan, kehadiran, konversi promo." />
                    <Solution icon="📈" t="Predictive Analytics" d="Proyeksi omzet 7 hari ke depan dari tren harian penjualan gerai." />
                    <Solution icon="🧾" t="Digitalisasi Operasional" d="POS gerai berstruk terverifikasi SAKSI, pencatatan otomatis, tanpa buku manual." />
                    <Solution icon="💬" t="Smart Decision Support System" d="Chatbot direktur prompt-terbatas: tanya sekali, dapat rekap + file. Terhubung waktu lokal." />
                </div>
            </section>

            {/* Judge accounts */}
            <section className="mx-auto max-w-6xl px-5 pb-16">
                <div className="nalar-card overflow-hidden">
                    <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
                        <div className="p-8">
                            <span className="nalar-chip" style={{ background: "var(--kertas)", color: "var(--kuning)" }}>Akun Demo Juri</span>
                            <h3 className="mt-4 text-2xl font-bold">Coba tiga peran sekarang</h3>
                            <p className="mt-2 text-sm" style={{ color: "var(--kabur)" }}>
                                Login membedakan peran: direktur tidak melihat tabel mentah, sales hanya melihat performa sendiri.
                                Data demo: <strong>{KOPERASI.nama}</strong> · {DATES[0]} s/d {DATES[DATES.length - 1]}.
                            </p>
                            <Link href="/hackathon/login" className="mt-6 inline-block rounded-xl px-5 py-3 text-sm font-bold text-white" style={{ background: "var(--hijau)" }}>
                                Buka halaman login →
                            </Link>
                        </div>
                        <div className="border-t p-8 md:border-l md:border-t-0" style={{ borderColor: "var(--garis)", background: "var(--latar)" }}>
                            <Cred role="Store Manager" user="manager.demo" pin="444444" />
                            <Cred role="Direktur" user="direktur.demo" pin="555555" />
                            <Cred role="Sales Gerai" user="sales.demo" pin="666666" />
                            <div className="flex items-center justify-between py-2.5 text-sm">
                                <span className="font-semibold">Pelanggan Gerai</span>
                                <Link href="/hackathon/pelanggan" className="font-semibold" style={{ color: "var(--hijau)" }}>buka app →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t" style={{ borderColor: "var(--garis)" }}>
                <div className="mx-auto max-w-6xl px-5 py-8 text-sm" style={{ color: "var(--kabur)" }}>
                    <p className="font-bold" style={{ color: "var(--tinta)" }}>SUARA WARGA, SAKSI × NALAR</p>
                    <p className="mt-1">Prototipe Hackathon Kementerian Koperasi 2026, Tema 1: Peningkatan Usaha Koperasi Melalui Teknologi Digital. Data pada demo ini adalah data sintetis (bukan koperasi nyata).</p>
                    <p className="mt-3 text-xs">Dibangun di atas plusthe.site · hackathon.plusthe.site</p>
                </div>
            </footer>
        </div>
    );
}

function SiteNav() {
    return (
        <nav className="sticky top-0 z-20 border-b backdrop-blur" style={{ borderColor: "var(--garis)", background: "rgba(246,243,242,.85)" }}>
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
                <Link href="/hackathon" className="flex items-center gap-2.5 font-extrabold tracking-tight">
                    <Image src="/nalar-logo.jpg" alt="NALAR" width={32} height={32} className="h-8 w-auto" />
                    <span className="hidden text-sm font-bold sm:inline" style={{ color: "var(--kabur)" }}>× SUARA WARGA</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href="/hackathon/nasional" className="hidden rounded-lg px-3 py-2 text-sm font-semibold sm:block" style={{ color: "var(--hijau)" }}>Nasional</Link>
                    <Link href="/hackathon/pelanggan" className="hidden rounded-lg px-3 py-2 text-sm font-semibold sm:block" style={{ color: "var(--hijau)" }}>Pelanggan</Link>
                    <Link href="/hackathon/verifikasi" className="hidden rounded-lg px-3 py-2 text-sm font-semibold sm:block" style={{ color: "var(--hijau)" }}>Cek Struk</Link>
                    <Link href="/hackathon/login" className="rounded-lg px-4 py-2 text-sm font-bold text-white" style={{ background: "var(--hijau)" }}>Masuk</Link>
                </div>
            </div>
        </nav>
    );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
    return (
        <div className="nalar-card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--kabur)" }}>{label}</div>
            <div className="mt-1 text-2xl font-extrabold tabular-nums" style={{ color: "var(--hijau)" }}>{value}</div>
            <div className="text-[11px]" style={{ color: "var(--kabur)" }}>{sub}</div>
        </div>
    );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
    return (
        <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--kuning)" }}>{kicker}</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        </div>
    );
}

function Problem({ n, t, d }: { n: string; t: string; d: string }) {
    return (
        <div className="nalar-card p-6">
            <div className="text-3xl font-black" style={{ color: "var(--garis)" }}>{n}</div>
            <h3 className="mt-2 text-lg font-bold">{t}</h3>
            <p className="mt-1.5 text-sm" style={{ color: "var(--kabur)" }}>{d}</p>
        </div>
    );
}

function Pillar({ tag, name, tagline, desc, points, cta, dark }: {
    tag: string; name: string; tagline: string; desc: string; points: string[]; cta: { href: string; label: string }; dark?: boolean;
}) {
    return (
        <div className="nalar-card flex flex-col p-7" style={dark ? { background: "var(--navy)", color: "#fff", borderColor: "var(--navy)" } : undefined}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: dark ? "#A9C2E6" : "var(--kuning)" }}>{tag}</div>
            <div className="mt-2 flex items-baseline gap-3">
                <h3 className="text-3xl font-black">{name}</h3>
                <span className="text-sm font-semibold" style={{ color: dark ? "#CBD9EE" : "var(--hijau-aksi)" }}>{tagline}</span>
            </div>
            <p className="mt-3 text-sm" style={{ color: dark ? "rgba(255,255,255,.85)" : "var(--kabur)" }}>{desc}</p>
            <ul className="mt-5 flex flex-col gap-2">
                {points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                        <span style={{ color: dark ? "#A9C2E6" : "var(--hijau-aksi)" }}>✓</span> {p}
                    </li>
                ))}
            </ul>
            <Link href={cta.href} className="mt-6 inline-block self-start rounded-xl px-5 py-2.5 text-sm font-bold transition hover:brightness-110"
                style={dark ? { background: "#fff", color: "var(--navy)" } : { background: "var(--hijau)", color: "#fff" }}>
                {cta.label} →
            </Link>
        </div>
    );
}

function Solution({ icon, t, d }: { icon: string; t: string; d: string }) {
    return (
        <div className="nalar-card p-5">
            <div className="text-2xl">{icon}</div>
            <h3 className="mt-2 font-bold">{t}</h3>
            <p className="mt-1 text-[13px]" style={{ color: "var(--kabur)" }}>{d}</p>
        </div>
    );
}

function Cred({ role, user, pin }: { role: string; user: string; pin: string }) {
    return (
        <div className="flex items-center justify-between border-b py-2.5 last:border-0" style={{ borderColor: "var(--garis)" }}>
            <span className="text-sm font-semibold">{role}</span>
            <span className="font-mono text-[13px]" style={{ color: "var(--kabur)" }}>{user} · {pin}</span>
        </div>
    );
}
