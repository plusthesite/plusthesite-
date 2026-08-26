"use client";

import { useEffect, useState } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";

/**
 * Idle screen for the first seconds of a hard load.
 *
 * Shows the looping animated wordmark plus a quiet status line while the
 * browser fetches and hydrates the page, then fades out as soon as the load
 * event fires (or a visitor taps skip, or a 3.5s failsafe trips — never trap
 * anyone behind a curtain). Client-side navigations never re-mount it.
 */
export default function Preloader({ locale }: { locale: string }) {
    const [done, setDone] = useState(false);
    const [gone, setGone] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const finish = () => {
            if (!cancelled) setDone(true);
        };

        if (document.readyState === "complete") {
            finish();
        } else {
            window.addEventListener("load", finish, { once: true });
        }
        const failsafe = setTimeout(finish, 3500);

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
                <button
                    type="button"
                    className="preloader__skip"
                    onClick={() => setDone(true)}
                >
                    {locale === "id" ? "Lewati" : "Skip"}
                </button>
            </div>
        </div>
    );
}
