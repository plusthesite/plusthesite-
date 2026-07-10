"use client";

import { useEffect, useRef, useState } from "react";

export interface KoperasiPoint { lat: number; lng: number; tx: boolean; nama: string }

// Indonesia bounding box for the SVG fallback projection.
const LNG_MIN = 95, LNG_MAX = 141, LAT_MIN = -11, LAT_MAX = 6;
const HIJAU = "#1B3A6B", KUNING = "#F2B807"; // navy = bertransaksi (positif), kuning = belum

declare global {
    interface Window { google?: { maps?: unknown }; __nalarMapCb?: () => void; gm_authFailure?: () => void }
}

export default function KoperasiMap({ points, mapsKey }: { points: KoperasiPoint[]; mapsKey?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<"loading" | "google" | "svg">(mapsKey ? "loading" : "svg");
    const bertransaksi = points.filter((p) => p.tx).length;

    useEffect(() => {
        if (!mapsKey || !ref.current) { setMode("svg"); return; }
        let cancelled = false;
        // Force SVG fallback — even if a Google map object was already created,
        // because auth errors (invalid key / API not enabled / billing / referrer)
        // surface AFTER init as Google's own "Oops" overlay.
        const toSvg = () => { if (!cancelled) setMode("svg"); };
        const timer = setTimeout(toSvg, 6000); // never hang the demo

        // Google invokes this global on any auth/config failure → degrade to SVG.
        window.gm_authFailure = toSvg;

        function init() {
            clearTimeout(timer);
            if (cancelled) return;
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const g = (window as any).google.maps;
                const map = new g.Map(ref.current, {
                    center: { lat: -2.4, lng: 118 }, zoom: 4.4,
                    disableDefaultUI: true, zoomControl: true, gestureHandling: "greedy",
                    styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
                });
                for (const p of points) {
                    new g.Circle({
                        map, center: { lat: p.lat, lng: p.lng },
                        radius: 16000, strokeWeight: 0,
                        fillColor: p.tx ? HIJAU : KUNING, fillOpacity: p.tx ? 0.85 : 0.55,
                    });
                }
                if (!cancelled) setMode("google");
            } catch { toSvg(); }
        }

        if ((window as unknown as { google?: { maps?: unknown } }).google?.maps) {
            init();
            return () => { cancelled = true; clearTimeout(timer); };
        }
        window.__nalarMapCb = init;
        const s = document.createElement("script");
        s.src = `https://maps.googleapis.com/maps/api/js?key=${mapsKey}&callback=__nalarMapCb&loading=async`;
        s.async = true;
        s.onerror = toSvg;
        document.head.appendChild(s);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [mapsKey, points]);

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5"><Dot c={HIJAU} /> Bertransaksi ({bertransaksi.toLocaleString("id-ID")})</span>
                <span className="flex items-center gap-1.5"><Dot c={KUNING} /> Belum bertransaksi ({(points.length - bertransaksi).toLocaleString("id-ID")})</span>
                <span className="ml-auto" style={{ color: "var(--kabur)" }}>{points.length.toLocaleString("id-ID")} koperasi terpetakan</span>
            </div>
            {mode !== "svg" ? (
                <div className="relative h-[420px] w-full overflow-hidden rounded-xl" style={{ background: "#E7F1EB" }}>
                    {/* Google Maps fully owns this node — React never renders children into it. */}
                    <div ref={ref} className="absolute inset-0" />
                    {mode === "loading" && (
                        <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm" style={{ color: "var(--kabur)" }}>Memuat peta…</div>
                    )}
                </div>
            ) : (
                <SvgScatter points={points} />
            )}
        </div>
    );
}

function Dot({ c }: { c: string }) {
    return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c }} />;
}

// Dependency-free fallback: equirectangular scatter over Indonesia's bbox.
function SvgScatter({ points }: { points: KoperasiPoint[] }) {
    const W = 1000, H = 380;
    const x = (lng: number) => ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
    const y = (lat: number) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;
    return (
        <div className="overflow-hidden rounded-xl" style={{ background: "linear-gradient(180deg,#EAF3ED,#F1F4EF)" }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Sebaran koperasi">
                {[0.25, 0.5, 0.75].map((g) => (
                    <line key={g} x1={0} x2={W} y1={g * H} y2={g * H} stroke="#DCE5DE" strokeDasharray="2 6" />
                ))}
                {points.map((p, i) => (
                    <circle key={i} cx={x(p.lng)} cy={y(p.lat)} r={p.tx ? 3.4 : 2.6}
                        fill={p.tx ? HIJAU : KUNING} fillOpacity={p.tx ? 0.9 : 0.55} />
                ))}
            </svg>
        </div>
    );
}
