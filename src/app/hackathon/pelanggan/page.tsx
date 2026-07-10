import Link from "next/link";
import { DEMO_CUSTOMER, customerReceipts, loyalty, CUSTOMER_PROMOS } from "@/lib/hackathon/customer";

const rp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

export default function PelangganHome() {
    const c = DEMO_CUSTOMER;
    const l = loyalty();
    const receipts = customerReceipts();

    return (
        <div className="nalar-root mx-auto min-h-screen max-w-md pb-24">
            {/* Greeting header */}
            <header className="rounded-b-3xl px-5 pb-8 pt-6 text-white" style={{ background: "linear-gradient(160deg, var(--hijau) 0%, var(--hijau-aksi) 100%)" }}>
                <div className="flex items-center justify-between">
                    <Link href="/hackathon" className="text-sm font-semibold opacity-90">← SUARA WARGA</Link>
                    <span className="nalar-chip" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>Kartu {c.kartu}</span>
                </div>
                <p className="mt-5 text-sm opacity-90">Selamat datang,</p>
                <h1 className="text-2xl font-extrabold">{c.nama}</h1>
                <p className="text-xs opacity-80">Anggota koperasi sejak {c.anggotaSejak}</p>

                {/* Loyalty card — big number (UI law: nominal = elemen terbesar) */}
                <div className="mt-5 rounded-2xl bg-white/12 p-4 backdrop-blur">
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-xs opacity-80">Poin Loyalti</div>
                            <div className="text-4xl font-black tabular-nums">{l.poin.toLocaleString("id-ID")}</div>
                        </div>
                        <div className="text-right">
                            <div className="nalar-chip" style={{ background: "var(--kuning)", color: "#3a2c00" }}>Tier {l.tier}</div>
                            <div className="mt-1 text-xs opacity-85">Total hemat {rp(l.hemat)}</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-5">
                {/* Quick actions — max simple, big tap targets */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <Action href={`/hackathon/pelanggan/struk/${receipts[0]?.txId ?? ""}`} icon="🧾" label="Struk Terakhir" />
                    <Action href="/hackathon/verifikasi" icon="🛡️" label="Cek Keaslian" />
                </div>

                {/* Promo untukmu */}
                <h2 className="mt-7 text-sm font-bold">Promo untukmu</h2>
                <div className="mt-3 space-y-3">
                    {CUSTOMER_PROMOS.map((p) => (
                        <div key={p.id} className="nalar-card flex items-start gap-3 p-4">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl" style={{ background: "var(--kertas)" }}>
                                {p.jenis === "tebus_murah" ? "🏷️" : "🗓️"}
                            </span>
                            <div>
                                <div className="font-bold">{p.nama}</div>
                                <p className="text-[13px]" style={{ color: "var(--kabur)" }}>{p.syarat}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Struk Saya */}
                <h2 className="mt-7 text-sm font-bold">Struk Saya</h2>
                <div className="mt-3 space-y-2.5">
                    {receipts.map((r) => (
                        <Link key={r.txId} href={`/hackathon/pelanggan/struk/${r.txId}`} className="nalar-card flex items-center gap-3 p-4 transition active:scale-[.99]">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg" style={{ background: "var(--hijau-terang)" }}>🛍️</span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate font-semibold">{r.items.length} barang</span>
                                    {r.tebusMurah && <span className="nalar-chip shrink-0" style={{ background: "var(--kertas)", color: "var(--kuning)" }}>Tebus Murah</span>}
                                </div>
                                <div className="text-[12px]" style={{ color: "var(--kabur)" }}>{r.tgl} · {String(r.jam).padStart(2, "0")}:00 · {r.sales.split(" ")[0]}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-extrabold tabular-nums">{rp(r.total)}</div>
                                <div className="text-[11px]" style={{ color: "var(--hijau)" }}>✓ Tersimpan aman</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <p className="mt-6 text-center text-[11px]" style={{ color: "var(--kabur)" }}>
                    Setiap struk teratestasi SAKSI — buktinya ada di tanganmu.
                </p>
            </main>
        </div>
    );
}

function Action({ href, icon, label }: { href: string; icon: string; label: string }) {
    return (
        <Link href={href} className="nalar-card flex flex-col items-center gap-1.5 p-4 text-center transition active:scale-[.98]">
            <span className="text-2xl">{icon}</span>
            <span className="text-[13px] font-semibold">{label}</span>
        </Link>
    );
}
