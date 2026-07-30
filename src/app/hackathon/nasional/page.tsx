import Link from "next/link";
import { getNationalBundle, memberForecast } from "@/lib/hackathon/national";
import NasionalView from "./NasionalView";

export const dynamic = "force-dynamic";

export default async function NasionalPage() {
    const bundle = await getNationalBundle();

    if (!bundle.ok) {
        return (
            <div className="nalar-root min-h-screen px-5 py-10">
                <div className="mx-auto max-w-5xl">
                    <div className="nalar-card overflow-hidden">
                        <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                            <div className="p-8 md:p-10">
                                <span
                                    className="nalar-chip"
                                    style={{ background: "var(--hijau-terang)", color: "var(--hijau)" }}
                                >
                                    Monitoring nasional standby
                                </span>
                                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
                                    Panel nasional siap dinyalakan
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: "var(--kabur)" }}>
                                    Mode nasional belum membaca database panitia karena kredensial <code>HACK_DB_*</code> belum tersedia di environment ini.
                                    Begitu koneksi aktif, halaman ini langsung berubah menjadi radar kesehatan koperasi lintas provinsi.
                                </p>
                                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                    {[
                                        "Peta persebaran koperasi",
                                        "Skor kesehatan ekosistem",
                                        "Prediksi pertumbuhan anggota",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-2xl border px-4 py-4 text-sm font-medium"
                                            style={{ borderColor: "var(--garis)", background: "var(--latar)" }}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href="/hackathon/dashboard"
                                        className="rounded-xl px-5 py-3 text-sm font-bold text-white"
                                        style={{ background: "var(--hijau)" }}
                                    >
                                        Buka dashboard gerai
                                    </Link>
                                    <Link
                                        href="/hackathon"
                                        className="rounded-xl border px-5 py-3 text-sm font-bold"
                                        style={{ borderColor: "var(--garis)", color: "var(--hijau)" }}
                                    >
                                        Kembali ke hub hackathon
                                    </Link>
                                </div>
                            </div>
                            <div
                                className="border-t p-8 md:border-l md:border-t-0"
                                style={{ borderColor: "var(--garis)", background: "var(--latar)" }}
                            >
                                <div className="rounded-3xl border p-5" style={{ borderColor: "var(--garis)", background: "#fff" }}>
                                    <div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--kuning)" }}>
                                        Saat koneksi aktif
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {[
                                            "Provinsi, sektor, dan status transaksi bisa difilter langsung",
                                            "Peta nasional menampilkan koperasi aktif vs belum bertransaksi",
                                            "Top koperasi dan produk terlaris dihitung dari dataset resmi panitia",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="rounded-2xl border px-4 py-3 text-sm"
                                                style={{ borderColor: "var(--garis)" }}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-xs leading-5" style={{ color: "var(--kabur)" }}>
                                        Status ini bukan error produk. Ini hanya menandakan layer data nasional belum diberi akses pada environment sekarang.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const forecast = memberForecast(bundle.growth);
    return <NasionalView bundle={bundle} forecast={forecast} mapsKey={process.env.NEXT_PUBLIC_MAPS_KEY} />;
}
