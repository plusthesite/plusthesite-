"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { PRELOADER_DONE_EVENT } from "@/lib/preloader";
import { GLYPHS, LOGO_VIEW_BOX, MARK_D } from "@/lib/logoPaths";

/**
 * plus. - animated brand mark.
 *
 * The wordmark is a vector trace of the original logo, split into the blue
 * "plus" mark and the four navy glyphs so each part can be timed separately.
 *
 * Motion: the outline draws itself, the mark unfolds from a quarter turn,
 * the fills bloom in, and the glyphs rise with a stagger. Timing lives in
 * globals.css (`.plus-logo*`) so it stays inspectable and respects the
 * global prefers-reduced-motion guard.
 */

const SIZES = {
    small: 55,
    default: 73,
    large: 92,
    hero: 240,
} as const;

export type AnimatedLogoProps = {
    /** "dark" = navy wordmark, "light" = all white, "auto" = follows the theme in CSS. */
    variant?: "dark" | "light" | "auto";
    size?: keyof typeof SIZES;
    /** Wrap in a link. Pass null to render a plain mark. */
    href?: string | null;
    className?: string;
    /** Play the intro once on mount. */
    animate?: boolean;
    /** Keep cycling - used for the hero lockup. */
    loop?: boolean;
    /** Re-run the intro when the user hovers the mark. */
    replayOnHover?: boolean;
    /** Re-run the intro when the first-load curtain lifts, so it is seen. */
    replayAfterPreloader?: boolean;
    title?: string;
};

export default function AnimatedLogo({
    variant = "dark",
    size = "default",
    href = "/",
    className = "",
    animate = true,
    loop = false,
    replayOnHover = true,
    replayAfterPreloader = false,
    title = "plus.",
}: AnimatedLogoProps) {
    const [runId, setRunId] = useState(0);

    useEffect(() => {
        if (!replayAfterPreloader || loop) return;
        const onDone = () => setRunId((value) => value + 1);
        window.addEventListener(PRELOADER_DONE_EVENT, onDone);
        return () => window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
    }, [loop, replayAfterPreloader]);

    const replay = useCallback(() => {
        if (!replayOnHover || loop) return;
        setRunId((value) => value + 1);
    }, [loop, replayOnHover]);

    const width = SIZES[size];
    const height = Math.round((width * 292) / 668);

    const svg = (
        <svg
            key={runId}
            viewBox={LOGO_VIEW_BOX}
            width={width}
            height={height}
            role="img"
            aria-label={title}
            className={`logo-image plus-logo ${loop ? "plus-logo--loop" : ""} ${
                animate || loop ? "plus-logo--animate" : ""
            } ${variant === "light" ? "plus-logo--light" : ""} ${
                variant === "auto" ? "plus-logo--auto" : ""
            }`}
        >
            <g className="plus-logo__mark">
                <path className="plus-logo__fill" d={MARK_D} />
                <path className="plus-logo__stroke" pathLength={1} d={MARK_D} />
            </g>
            {GLYPHS.map((glyph, index) => (
                <g
                    key={glyph.name}
                    className="plus-logo__glyph"
                    style={{ "--i": index + 1 } as CSSProperties}
                >
                    <path className="plus-logo__fill" d={glyph.d} />
                    <path className="plus-logo__stroke" pathLength={1} d={glyph.d} />
                </g>
            ))}
        </svg>
    );

    if (!href) {
        return (
            <span
                className={`logo-wrapper relative inline-block ${className}`}
                onMouseEnter={replay}
            >
                {svg}
            </span>
        );
    }

    return (
        <Link
            href={href}
            aria-label={title}
            className={`logo-wrapper group relative inline-block ${className}`}
            onMouseEnter={replay}
        >
            {svg}
        </Link>
    );
}
