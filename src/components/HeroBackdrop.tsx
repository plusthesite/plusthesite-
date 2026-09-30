"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Plus3D from "@/components/Plus3D";

const HeroShaderStack = dynamic(() => import("@/components/HeroShaderStack"), {
    ssr: false,
    loading: () => null,
});

const QUERIES = ["(prefers-reduced-motion: reduce)", "(max-width: 767px)"];

function subscribe(onChange: () => void) {
    const lists = QUERIES.map((query) => window.matchMedia(query));
    lists.forEach((list) => list.addEventListener("change", onChange));

    return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

/** Shaders stay off on small screens and for reduced-motion visitors. */
function shaderAllowed() {
    if (process.env.NEXT_PUBLIC_HERO_SHADER !== "on") return false;

    return !QUERIES.some((query) => window.matchMedia(query).matches);
}

/**
 * Animated hero backdrop.
 *
 * Default is a pure-CSS stack (drifting colour fields + fluted banding + grain)
 * that costs nothing and works everywhere. The WebGPU shader version is opt-in
 * via NEXT_PUBLIC_HERO_SHADER=on, and still falls back to CSS when the browser
 * has no WebGPU, the screen is small, or the visitor prefers reduced motion.
 */
export default function HeroBackdrop() {
    const { resolvedTheme } = useTheme();
    const dark = resolvedTheme === "dark";
    const [unavailable, setUnavailable] = useState(false);
    const allowed = useSyncExternalStore(subscribe, shaderAllowed, () => false);
    const onUnavailable = useCallback(() => setUnavailable(true), []);

    return (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[#ffffff] dark:bg-[#070b14]" />

            <div
                className="hero-blob hero-blob-1 -left-[10%] top-[-12%] h-[52vw] w-[52vw] bg-[radial-gradient(circle,_rgba(12,116,235,0.42),_transparent_68%)]"
                aria-hidden
            />
            <div
                className="hero-blob hero-blob-2 right-[-8%] top-[6%] h-[44vw] w-[44vw] bg-[radial-gradient(circle,_rgba(56,189,248,0.34),_transparent_68%)]"
                aria-hidden
            />
            <div
                className="hero-blob hero-blob-3 bottom-[-18%] left-[24%] h-[48vw] w-[48vw] bg-[radial-gradient(circle,_rgba(124,58,237,0.24),_transparent_68%)]"
                aria-hidden
            />


            {/* Placement matters as much as the geometry.
                Desktop (lg+): bled off the right edge with a real gutter to the
                copy. The old `lg:right-[3%]` anchor put ~170px of arm over the
                headline at 1440px; the copy column is now capped at 58% so the
                gutter holds at every width (measured 179px at 1024, 337px at
                1440, 628px at 1920).
                Below lg the copy moves under the mark, so the mark is sized to
                the band above it rather than to the viewport: at 820x900 a
                viewport-relative mark hung 78px into the copy block. */}
            <Plus3D className="right-[-30%] top-[6%] h-[52vmin] w-[52vmin] sm:right-[-20%] sm:top-[4%] sm:h-[46vmin] sm:w-[46vmin] lg:right-[-9%] lg:top-[6%] lg:h-[40vw] lg:w-[40vw] lg:max-h-[560px] lg:max-w-[560px]" />

            {allowed && !unavailable ? (
                <div className="absolute inset-0">
                    <HeroShaderStack dark={dark} onUnavailable={onUnavailable} />
                </div>
            ) : null}

            <div className="hero-flutes absolute inset-0" aria-hidden />
            <div className="hero-grain absolute inset-0" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#ffffff] dark:to-[#070b14]" />
        </div>
    );
}
