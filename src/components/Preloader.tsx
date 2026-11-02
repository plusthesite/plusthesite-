"use client";

import { useEffect, useState } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";
import { PRELOADER_DONE_EVENT } from "@/lib/preloader";

/**
 * Idle screen for the first seconds of a hard load.
 *
 * Shows the looping animated wordmark plus a quiet status line while the
 * browser fetches and hydrates the page, then fades out as soon as the load
 * event fires - held for a short minimum so it never just flashes, and cut
 * by a 10s failsafe so it never traps anyone. Client-side navigations never
 * re-mount it.
 *
 * The curtain is always light with the navy wordmark (the brand's splash
 * look, matching the loading-screen mockup), centered, with the status line
 * under it and the skip affordance in the bottom-right corner. It is
 * click-through and lifts fast, so it never blocks the page below.
 */
export default function Preloader({ locale }: { locale: string }) {
    const [done, setDone] = useState(false);
    const [gone, setGone] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const mountedAt = performance.now();
        // Keep the curtain long enough to read as a splash, not a flicker,
        // but short enough that nobody waits on it. It is click-through, so
        // even while it is up the page below is fully usable. 1.5s covers the
        // full draw-on → fill intro of the wordmark.
        const MIN_SHOW = 1500;
        const MAX_SHOW = 6_000; // never hold the page hostage

        const finish = () => {
            if (cancelled) return;
            const elapsed = performance.now() - mountedAt;
            const wait = Math.max(0, MIN_SHOW - elapsed);
            setTimeout(() => {
                if (!cancelled) setDone(true);
            }, wait);
        };

        if (document.readyState === "complete" || document.readyState === "interactive") {
            finish();
        } else {
            // DOMContentLoaded is the real "page is readable" signal; the full
            // load event can trail it by seconds on slow connections and the
            // curtain must not sit there waiting for late images.
            window.addEventListener("DOMContentLoaded", finish, { once: true });
            window.addEventListener("load", finish, { once: true });
        }
        const failsafe = setTimeout(finish, MAX_SHOW);

        return () => {
            cancelled = true;
            window.removeEventListener("DOMContentLoaded", finish);
            window.removeEventListener("load", finish);
            clearTimeout(failsafe);
        };
    }, []);

    useEffect(() => {
        if (!done) return;
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
        const t = setTimeout(() => setGone(true), 600); // matches the fade-out
        return () => clearTimeout(t);
    }, [done]);

    if (gone) return null;

    return (
        <div className={`preloader ${done ? "preloader--done" : ""}`}>
            <div className="preloader__inner">
                {/* Intro-once (draw → fill), not the 6s hero loop: the curtain
                    lifts in ~1.5s, so a looping animation would never reach its
                    filled state before it disappears. */}
                <AnimatedLogo href={null} variant="dark" size="hero" />
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
