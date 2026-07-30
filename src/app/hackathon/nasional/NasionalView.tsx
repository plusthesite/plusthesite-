"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { rp, rpShort } from "@/lib/hackathon/analytics";
import { BarChartH, Donut, Gauge, LineTrend } from "../_components/Charts";
import KoperasiMap from "./KoperasiMap";
import type { Koperasi, NationalBundle } from "@/lib/hackathon/national";

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const ribu = (n: number) => n.toLocaleString("id-ID");
const titlecase = (s: string) =>
    s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const shorten = (s: string, n = 24) => (s.length > n ? `${s.slice(0, n - 1)}...` : s);
const SEKTOR_COLORS = ["#D6222A", "#1B3A6B", "#F2B807", "#9E6B4A", "#7A5AA0", "#B0521F"];

type Status = "all" | "tx" | "notx";

type ChartRow = { key: string; n: number };

export default function NasionalView({
    bundle,
    forecast,
    mapsKey,
}: {
    bundle: NationalBundle;
    forecast: { proyeksi: number[]; total: number };
    mapsKey?: string;
}) {
    const [provinsi, setProvinsi] = useState("all");
    const [sektor, setSektor] = useState("all");
    const [status, setStatus] = useState<Status>("all");

    const all = bundle.koperasi;

    const provinsiList = useMemo(
        () => [...new Set(all.map((k) => k.provinsi))].sort(),
        [all]
    );
    const sektorList = useMemo(
        () => [...new Set(all.map((k) => k.sektor))].sort((a, b) => a.localeCompare(b)),
        [all]
    );

    const ks = useMemo(
        () =>
            all.filter((k) => {
                const matchProvinsi = provinsi === "all" || k.provinsi === provinsi;
                const matchSektor = sektor === "all" || k.sektor === sektor;
                const matchStatus =
                    status === "all" || (status === "tx" ? k.tx > 0 : k.tx === 0);

                return matchProvinsi && matchSektor && matchStatus;
            }),
        [all, provinsi, sektor, status]
    );

    const forProvinsi = useMemo(
        () =>
            all.filter((k) => {
                const matchSektor = sektor === "all" || k.sektor === sektor;
                const matchStatus =
                    status === "all" || (status === "tx" ? k.tx > 0 : k.tx === 0);

                return matchSektor && matchStatus;
            }),
        [all, sektor, status]
    );

    const forSektor = useMemo(
        () =>
            all.filter((k) => {
                const matchProvinsi = provinsi === "all" || k.provinsi === provinsi;
                const matchStatus =
                    status === "all" || (status === "tx" ? k.tx > 0 : k.tx === 0);

                return matchProvinsi && matchStatus;
            }),
        [all, provinsi, status]
    );

    const ov = useMemo(() => {
        const summary = {
            koperasi: ks.length,
            anggota: 0,
            anggotaAktif: 0,
            gerai: 0,
            geraiAktif: 0,
            omzet: 0,
            simpanan: 0,
            tx: 0,
            koperasiTx: 0,
        };

        for (const koperasi of ks) {
            summary.anggota += koperasi.anggota;
            summary.anggotaAktif += koperasi.anggotaAktif;
            summary.gerai += koperasi.gerai;
            summary.geraiAktif += koperasi.geraiAktif;
            summary.omzet += koperasi.omzet;
            summary.simpanan += koperasi.simpanan;
            summary.tx += koperasi.tx;
            if (koperasi.tx > 0) summary.koperasiTx += 1;
        }

        return summary;
    }, [ks]);

    const provinsiBars = useMemo(
        () => countBy(forProvinsi, (k) => k.provinsi).slice(0, 12),
        [forProvinsi]
    );
    const sektorBars = useMemo(
        () => countBy(forSektor, (k) => k.sektor).slice(0, 10),
        [forSektor]
    );
    const topKoperasi = useMemo(
        () =>
            [...ks]
                .filter((k) => k.omzet > 0)
                .sort((a, b) => b.omzet - a.omzet)
                .slice(0, 8),
        [ks]
    );
    const points = useMemo(
        () =>
            ks.flatMap((k) =>
                k.lat == null || k.lng == null
                    ? []
                    : [{ lat: k.lat, lng: k.lng, tx: k.tx > 0, nama: k.nama }]
            ),
        [ks]
    );

    const geraiAktifPct = pct(ov.geraiAktif, ov.gerai);
    const anggotaAktifPct = pct(ov.anggotaAktif, ov.anggota);
    const coveragePct = pct(ov.koperasiTx, ov.koperasi);
    const health = Math.round(
        geraiAktifPct * 0.4 + anggotaAktifPct * 0.35 + coveragePct * 0.25
    );
    const healthStatus =
        health >= 80 ? "Sehat" : health >= 60 ? "Perlu Perhatian" : "Kritis";

    const growthTail = bundle.growth.slice(-12);
    const filtered = provinsi !== "all" || sektor !== "all" || status !== "all";

    const reset = () => {
        setProvinsi("all");
        setSektor("all");
        setStatus("all");
    };

    return (
        <div className="nalar-root min-h-screen">
            <header
                className="sticky top-0 z-20 border-b backdrop-blur"
                style={{
                    borderColor: "var(--garis)",
                    background: "rgba(241,244,239,.85)",
                }}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
                    <Link href="/hackathon" className="flex items-center gap-2 font-extrabold">
                        <Image
                            src="/nalar-logo.jpg"
                            alt="NALAR"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-lg object-cover object-left"
                        />
                        <span>
                            NALAR
                            <span
                                className="ml-1 text-xs font-semibold"
                                style={{ color: "var(--kabur)" }}
                            >
                                Nasional
                            </span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            style={{
                                background: "var(--hijau-terang)",
                                color: "var(--hijau)",
                            }}
                        >
                            <span
                                className="h-2 w-2 animate-pulse rounded-full"
                                style={{ background: "var(--hijau-aksi)" }}
                            />
                            Data Kemenkop · live
                        </span>
                        <Link
                            href="/hackathon/dashboard"
                            className="text-xs font-semibold"
                            style={{ color: "var(--hijau)" }}
                        >
                            Dashboard Gerai {"->"}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-6">
                <div className="mb-4">
                    <div
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: "var(--kuning)" }}
                    >
                        Monitoring Kesehatan Koperasi Nasional
                    </div>
                    <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                        Sistem Pemantauan Ekosistem Koperasi
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: "var(--kabur)" }}>
                        Business Intelligence interaktif di atas{" "}
                        <strong>{ribu(all.length)} koperasi</strong> nyata - dataset
                        Hackathon Kementerian Koperasi 2026.
                    </p>
                </div>

                <div className="nalar-card mb-4 flex flex-wrap items-end gap-3 p-4">
                    <Field label="Provinsi">
                        <select
                            value={provinsi}
                            onChange={(e) => setProvinsi(e.target.value)}
                            className="nalar-select"
                        >
                            <option value="all">Semua provinsi</option>
                            {provinsiList.map((item) => (
                                <option key={item} value={item}>
                                    {titlecase(item)}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Sektor Usaha (KBLI)">
                        <select
                            value={sektor}
                            onChange={(e) => setSektor(e.target.value)}
                            className="nalar-select"
                            style={{ minWidth: "14rem" }}
                        >
                            <option value="all">Semua sektor</option>
                            {sektorList.map((item) => (
                                <option key={item} value={item}>
                                    {shorten(item, 40)}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Status Transaksi">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Status)}
                            className="nalar-select"
                        >
                            <option value="all">Semua</option>
                            <option value="tx">Sudah bertransaksi</option>
                            <option value="notx">Belum bertransaksi</option>
                        </select>
                    </Field>
                    <div className="ml-auto flex items-center gap-2">
                        {filtered ? (
                            <span
                                className="text-[12px] font-semibold"
                                style={{ color: "var(--hijau)" }}
                            >
                                {ribu(ks.length)} koperasi cocok
                            </span>
                        ) : null}
                        <button
                            onClick={reset}
                            disabled={!filtered}
                            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
                            style={{ borderColor: "var(--garis)", color: "var(--kabur)" }}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                    <Kpi
                        label="Koperasi"
                        value={ribu(ov.koperasi)}
                        sub={`${ribu(ov.koperasiTx)} bertransaksi`}
                        big
                    />
                    <Kpi
                        label="Anggota"
                        value={ribu(ov.anggota)}
                        sub={`${anggotaAktifPct}% aktif`}
                    />
                    <Kpi
                        label="Gerai"
                        value={ribu(ov.gerai)}
                        sub={`${geraiAktifPct}% aktif`}
                    />
                    <Kpi
                        label="Omzet Transaksi"
                        value={rpShort(ov.omzet)}
                        sub={`${ribu(ov.tx)} transaksi`}
                    />
                    <Kpi
                        label="Simpanan Anggota"
                        value={rpShort(ov.simpanan)}
                        sub="modal sosial"
                    />
                </div>

                {points.length > 0 ? (
                    <div className="mt-4">
                        <Panel
                            title="Peta Sebaran Koperasi"
                            chip={`${ribu(points.length)} titik`}
                            chipColor="var(--hijau)"
                        >
                            <KoperasiMap points={points} mapsKey={mapsKey} />
                        </Panel>
                    </div>
                ) : null}

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <Panel title="Skor Kesehatan Ekosistem">
                        <div className="flex flex-col items-center">
                            <Gauge value={health} status={healthStatus} />
                            <div className="mt-3 w-full space-y-1.5 text-[12px]">
                                <RowStat l="Aktivasi gerai" v={`${geraiAktifPct}%`} w={40} />
                                <RowStat
                                    l="Keanggotaan aktif"
                                    v={`${anggotaAktifPct}%`}
                                    w={35}
                                />
                                <RowStat
                                    l="Cakupan transaksi"
                                    v={`${coveragePct}%`}
                                    w={25}
                                />
                            </div>
                        </div>
                    </Panel>
                    <Panel title="Status Gerai">
                        <Donut
                            data={[
                                {
                                    label: "Aktif",
                                    value: ov.geraiAktif,
                                    color: "#1B3A6B",
                                },
                                {
                                    label: "Belum Aktif",
                                    value: Math.max(0, ov.gerai - ov.geraiAktif),
                                    color: "#F2B807",
                                },
                            ]}
                            format={ribu}
                        />
                    </Panel>
                    <Panel title="Status Keanggotaan">
                        <Donut
                            data={[
                                {
                                    label: "Aktif",
                                    value: ov.anggotaAktif,
                                    color: "#1B3A6B",
                                },
                                {
                                    label: "Menunggu",
                                    value: Math.max(0, ov.anggota - ov.anggotaAktif),
                                    color: "#F2B807",
                                },
                            ]}
                            format={ribu}
                        />
                    </Panel>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Reco
                        icon="Toko"
                        title={`${ribu(ov.gerai - ov.geraiAktif)} gerai belum aktif`}
                        body={`${100 - geraiAktifPct}% gerai belum beroperasi pada pilihan ini. Aktivasi mendongkrak volume usaha.`}
                    />
                    <Reco
                        icon="Anggota"
                        title={`${ribu(ov.anggota - ov.anggotaAktif)} anggota menunggu`}
                        body={`Pendaftaran "Requested" belum disetujui. Percepat verifikasi agar partisipasi dan simpanan naik.`}
                    />
                    <Reco
                        icon="Tx"
                        title={`Cakupan transaksi ${coveragePct}%`}
                        body={`Baru ${ribu(ov.koperasiTx)} dari ${ribu(ov.koperasi)} koperasi bertransaksi. Dorong digitalisasi POS (SAKSI).`}
                    />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Panel title="Sebaran per Provinsi" chip="klik untuk filter" chipColor="var(--kabur)">
                        <BarChartH
                            data={provinsiBars.map((row) => ({
                                label: titlecase(row.key),
                                value: row.n,
                                tip: titlecase(row.key),
                            }))}
                            format={ribu}
                            selectedLabel={provinsi === "all" ? undefined : titlecase(provinsi)}
                            onSelect={(label) =>
                                setProvinsi(
                                    provinsi.toLowerCase() === label.toLowerCase()
                                        ? "all"
                                        : label.toUpperCase()
                                )
                            }
                        />
                    </Panel>
                    <Panel title="Sektor Usaha (KBLI)" chip="klik untuk filter" chipColor="var(--kabur)">
                        {sektorBars.length ? (
                            <BarChartH
                                data={sektorBars.map((row) => ({
                                    label: shorten(row.key),
                                    value: row.n,
                                    tip: row.key,
                                }))}
                                format={ribu}
                                selectedLabel={sektor === "all" ? undefined : shorten(sektor)}
                                onSelect={(label) => {
                                    const full = sektorList.find((item) => shorten(item) === label) ?? label;
                                    setSektor(sektor === full ? "all" : full);
                                }}
                            />
                        ) : (
                            <Empty />
                        )}
                    </Panel>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <Panel
                        title="Pertumbuhan Anggota & Prediksi 6 Bulan"
                        className="lg:col-span-2"
                        chip={`proyeksi +${ribu(forecast.total)} · nasional`}
                        chipColor="var(--hijau)"
                    >
                        {growthTail.length > 1 ? (
                            <LineTrend
                                actual={growthTail.map((item) => item.n)}
                                forecast={forecast.proyeksi}
                                labels={[
                                    ...growthTail.map((item) => item.bulan.slice(2)),
                                    ...forecast.proyeksi.map((_, i) => `+${i + 1}`),
                                ]}
                                format={ribu}
                            />
                        ) : (
                            <Empty />
                        )}
                    </Panel>
                    <Panel title="Top Koperasi (Omzet)">
                        {topKoperasi.length ? (
                            <BarChartH
                                data={topKoperasi.map((koperasi) => ({
                                    label: shorten(koperasi.nama, 18),
                                    value: koperasi.omzet,
                                    sub: `${koperasi.tx} tx`,
                                    tip: koperasi.nama,
                                }))}
                                format={rpShort}
                            />
                        ) : (
                            <Empty note="Belum ada koperasi bertransaksi pada filter ini." />
                        )}
                    </Panel>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <Panel title="Komposisi Jabatan Karyawan" chip="nasional" chipColor="var(--kabur)">
                        <BarChartH
                            data={bundle.karyawan.map((item) => ({
                                label: shorten(item.jabatan, 16),
                                value: item.n,
                                tip: item.jabatan,
                            }))}
                            format={ribu}
                        />
                    </Panel>
                    <Panel title="Akses Internet Gerai" chip="kesiapan digital" chipColor="var(--kabur)">
                        <Donut
                            data={bundle.infraInternet.map((item, i) => ({
                                label: item.v,
                                value: item.n,
                                color: SEKTOR_COLORS[i % SEKTOR_COLORS.length],
                            }))}
                            format={ribu}
                        />
                    </Panel>
                    <Panel title="Akses Listrik Gerai" chip="kesiapan digital" chipColor="var(--kabur)">
                        <Donut
                            data={bundle.infraListrik.map((item, i) => ({
                                label: item.v,
                                value: item.n,
                                color: SEKTOR_COLORS[i % SEKTOR_COLORS.length],
                            }))}
                            format={ribu}
                        />
                    </Panel>
                </div>

                <div className="mt-4">
                    <Panel title="Produk Terlaris Nasional (nilai keluar)" chip="nasional" chipColor="var(--kabur)">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr
                                        className="text-left text-[11px] uppercase"
                                        style={{ color: "var(--kabur)" }}
                                    >
                                        <th className="pb-2">#</th>
                                        <th className="pb-2">Produk</th>
                                        <th className="pb-2 text-right">Qty Keluar</th>
                                        <th className="pb-2 text-right">Nilai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bundle.topProduk.map((produk, index) => (
                                        <tr
                                            key={`${produk.nama}-${index}`}
                                            className="border-t transition-colors hover:bg-[#F3F7F4]"
                                            style={{ borderColor: "var(--garis)" }}
                                        >
                                            <td
                                                className="py-2"
                                                style={{ color: "var(--kabur)" }}
                                            >
                                                {index + 1}
                                            </td>
                                            <td className="py-2 font-medium">{produk.nama}</td>
                                            <td className="py-2 text-right tabular-nums">
                                                {ribu(produk.qty)}
                                            </td>
                                            <td
                                                className="py-2 text-right tabular-nums font-semibold"
                                                style={{ color: "var(--hijau)" }}
                                            >
                                                {rp(produk.nilai)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                </div>

                <p className="mt-6 text-center text-[11px]" style={{ color: "var(--kabur)" }}>
                    Sumber: dataset resmi Hackathon Kementerian Koperasi 2026
                    (read-only). Dataset per-koperasi di-cache 10 menit; filter dan
                    agregasi dihitung di peramban.
                </p>
            </main>

            <style>{`.nalar-select{border:1px solid var(--garis);border-radius:10px;padding:.5rem .7rem;font-size:.85rem;font-weight:600;background:#fff;min-width:11rem;max-width:20rem}`}</style>
        </div>
    );
}

function countBy(arr: Koperasi[], key: (k: Koperasi) => string): ChartRow[] {
    const map = new Map<string, number>();
    for (const item of arr) {
        map.set(key(item), (map.get(key(item)) ?? 0) + 1);
    }

    return [...map.entries()]
        .map(([key, n]) => ({ key, n }))
        .sort((a, b) => b.n - a.n);
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="flex flex-col gap-1">
            <span
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ color: "var(--kabur)" }}
            >
                {label}
            </span>
            {children}
        </label>
    );
}

function Kpi({
    label,
    value,
    sub,
    big,
}: {
    label: string;
    value: string;
    sub: string;
    big?: boolean;
}) {
    return (
        <div className="nalar-card p-4" title={`${label}: ${value}`}>
            <div
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--kabur)" }}
            >
                {label}
            </div>
            <div
                className={`mt-1 font-extrabold tabular-nums ${big ? "text-2xl" : "text-xl"}`}
                style={{ color: big ? "var(--hijau)" : "var(--tinta)" }}
            >
                {value}
            </div>
            <div className="text-[11px]" style={{ color: "var(--kabur)" }}>
                {sub}
            </div>
        </div>
    );
}

function Panel({
    title,
    children,
    className = "",
    chip,
    chipColor,
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
    chip?: string;
    chipColor?: string;
}) {
    return (
        <section className={`nalar-card p-5 ${className}`}>
            <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold">{title}</h3>
                {chip ? (
                    <span
                        className="nalar-chip shrink-0"
                        style={{
                            background: "var(--latar)",
                            color: chipColor ?? "var(--hijau)",
                        }}
                    >
                        {chip}
                    </span>
                ) : null}
            </div>
            {children}
        </section>
    );
}

function RowStat({ l, v, w }: { l: string; v: string; w: number }) {
    return (
        <div className="flex items-center gap-2">
            <span className="flex-1" style={{ color: "var(--kabur)" }}>
                {l}
            </span>
            <span className="font-semibold tabular-nums">{v}</span>
            <span className="text-[10px]" style={{ color: "var(--kabur)" }}>
                ·{w}%
            </span>
        </div>
    );
}

function Reco({
    icon,
    title,
    body,
}: {
    icon: string;
    title: string;
    body: string;
}) {
    return (
        <div className="nalar-card p-5" style={{ borderLeft: "3px solid var(--hijau)" }}>
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-bold">{title}</h3>
            </div>
            <p className="mt-1.5 text-[13px]" style={{ color: "var(--kabur)" }}>
                {body}
            </p>
        </div>
    );
}

function Empty({ note = "Data belum tersedia." }: { note?: string }) {
    return (
        <p className="text-sm" style={{ color: "var(--kabur)" }}>
            {note}
        </p>
    );
}
