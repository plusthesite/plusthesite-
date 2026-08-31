"use client";

import { useEffect, useState } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";

/**
 * Idle screen for the first seconds of a hard load.
 *
 * Shows the looping animated wordmark plus a quiet status line while the
 * browser fetches and hydrates the page, then fades out as soon as the load
 * event fires - held for a short minimum so it never just flashes, and cut
 * by a 10s failsafe so it never traps anyone. Client-side navigations never
 * re-mount it.
 */
export default function Preloader({ locale }: { locale: string }) {
    const [done, setDone] = useState(false);
    const [gone, setGone] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const mountedAt = performance.now();
        const MIN_SHOW = 1200; // below this the curtain reads as a flicker
        const MAX_SHOW = 10_000; // never hold the page hostage

        const finish = () => {
            if (cancelled) return;
            const elapsed = performance.now() - mountedAt;
            const wait = Math.max(0, MIN_SHOW - elapsed);
            setTimeout(() => {
                if (!cancelled) setDone(true);
            }, wait);
        };

        if (document.readyState === "complete") {
            finish();
        } else {
            window.addEventListener("load", finish, { once: true });
        }
        const failsafe = setTimeout(finish, MAX_SHOW);

        return () => {
            cancelled = true;
            window.removeEventListener("load", finish);
            clearTimeout(failsafe);
        };
    }, []);

    useEffect(() => {
        if (!done) return;
        const t = setTimeout(() => setGone(true), 600); // matches the fade-out
        return () => clearTimeout(t);
    }, [done]);

    if (gone) return null;

    return (
        <div className={`preloader ${done ? "preloader--done" : ""}`}>
            <div className="preloader__inner">
                <AnimatedLogo href={null} variant="auto" size="hero" loop />
                <p className="preloader__cta">
                    {locale === "id"
                        ? "Menyiapkan pengalaman..."
                        : "Preparing the experience..."}
                </p>
            </div>
            {/* Anchored to the curtain itself - the animated inner is a
                containing block (transform), so it must not wrap this. */}
            <button
                type="button"
                className="preloader__skip"
                onClick={() => setDone(true)}
            >
                {locale === "id" ? "Lewati" : "Skip"}
            </button>
        </div>
    );
}
