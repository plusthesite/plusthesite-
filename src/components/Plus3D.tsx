"use client";

import { useEffect, useId, useRef } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * The plus mark as a faux-3D hero object.
 *
 * The depth is baked into one static SVG - a solid extruded side built from
 * offset copies of the mark, a lit gradient face and a hairline highlight -
 * so it is painted exactly once. Everything that moves is a transform or an
 * opacity on its own compositor layer:
 *
 *   float  - CSS idle bob, runs only while the hero is on screen
 *   stage  - scroll-driven turn, shrink and fade (one write per frame)
 *   tilt   - eases toward the pointer in perspective, then stops its loop
 *
 * The glow and contact shadow are plain gradients that never animate. No
 * filters, no blend modes and no per-frame paint - the old build animated a
 * drop-shadow on a 540px SVG, which dragged the cursor down with it.
 */

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/** Start and end of the turn, measured across one viewport of scrolling. */
const TURN = {
    rotate: [-8, 6],
    y: [0, -18],
    scale: [1, 0.88],
};

/** Pointer tilt range in degrees, and how quickly the mark catches up. */
const TILT = { x: 12, y: 16, ease: 0.09 };

/** Depth of the extruded side, in mark units, and the light direction. */
const EXTRUDE = { steps: 14, dx: 0.9, dy: 1.25 };
const EXTRUDE_STEPS = Array.from({ length: EXTRUDE.steps }, (_, i) => EXTRUDE.steps - i);

const at = (range: number[], t: number) => range[0] + (range[1] - range[0]) * t;

export default function Plus3D({ className = "" }: { className?: string }) {
    const floatRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);
    const uid = useId().replace(/:/g, "");

    useEffect(() => {
        const float = floatRef.current;
        const stage = stageRef.current;
        const tilt = tiltRef.current;
        if (!float || !stage || !tilt) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const finePointer = window.matchMedia("(pointer: fine)").matches;

        let visible = true;
        let running = false;

        // ── Scroll: turn, drift and fade the stage as the hero leaves. ──
        let settled = false;
        let scrollTicking = false;
        const applyScroll = () => {
            scrollTicking = false;
            const t = clamp(window.scrollY / (window.innerHeight || 1), 0, 1);
            if (settled && t >= 1) return;
            if (t < 1) settled = false;

            stage.style.transform = [
                `translateY(${at(TURN.y, t)}%)`,
                `rotate(${at(TURN.rotate, t)}deg)`,
                `scale(${at(TURN.scale, t)})`,
            ].join(" ");
            stage.style.opacity = String(1 - t * 0.9);
            if (t >= 1) settled = true;
        };

        const onScroll = () => {
            // Nothing to do once the mark has scrolled away.
            if (!visible || scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(applyScroll);
            sync();
        };

        // ── Pointer: ease the tilt toward a target, then let the loop die. ──
        const target = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };
        let tiltFrame = 0;

        const stepTilt = () => {
            current.x += (target.x - current.x) * TILT.ease;
            current.y += (target.y - current.y) * TILT.ease;
            const done =
                Math.abs(target.x - current.x) < 0.02 &&
                Math.abs(target.y - current.y) < 0.02;
            if (done) {
                current.x = target.x;
                current.y = target.y;
            }
            tilt.style.transform = `perspective(1400px) rotateX(${current.x.toFixed(2)}deg) rotateY(${current.y.toFixed(2)}deg)`;
            tiltFrame = done ? 0 : requestAnimationFrame(stepTilt);
        };

        const kickTilt = () => {
            if (!tiltFrame) tiltFrame = requestAnimationFrame(stepTilt);
        };

        const onPointerMove = (event: PointerEvent) => {
            if (!running) return;
            const nx = event.clientX / (window.innerWidth || 1) - 0.5;
            const ny = event.clientY / (window.innerHeight || 1) - 0.5;
            target.x = -ny * TILT.x;
            target.y = nx * TILT.y;
            kickTilt();
        };

        const onPointerLeave = () => {
            target.x = 0;
            target.y = 0;
            kickTilt();
        };

        // ── Visibility: idle animations and compositor hints only on screen. ──
        const sync = () => {
            const shouldRun = visible && window.scrollY < window.innerHeight;
            if (shouldRun === running) return;
            running = shouldRun;
            float.classList.toggle("is-running", running);
            const hint = running ? "transform" : "auto";
            stage.style.willChange = hint;
            tilt.style.willChange = hint;
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                const wasVisible = visible;
                visible = entry.isIntersecting;
                if (wasVisible && !visible) {
                    // Settle at the final pose so nothing is left mid-motion.
                    applyScroll();
                    if (tiltFrame) cancelAnimationFrame(tiltFrame);
                    tiltFrame = 0;
                }
                sync();
            },
            { threshold: 0 },
        );
        observer.observe(stage);

        applyScroll();
        sync();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", applyScroll, { passive: true });
        if (finePointer) {
            window.addEventListener("pointermove", onPointerMove, { passive: true });
            document.addEventListener("pointerleave", onPointerLeave);
        }

        return () => {
            observer.disconnect();
            if (tiltFrame) cancelAnimationFrame(tiltFrame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", applyScroll);
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerleave", onPointerLeave);
        };
    }, []);

    const face = `plus3d-face-${uid}`;
    const side = `plus3d-side-${uid}`;

    return (
        <div className={`plus3d ${className}`} aria-hidden>
            <div className="plus3d__float" ref={floatRef}>
                <div className="plus3d__stage" ref={stageRef}>
                    <div className="plus3d__tilt" ref={tiltRef}>
                        <div className="plus2d__shadow" />
                        <div className="plus2d__glow" />
                        <svg className="plus2d" viewBox={MARK_VIEW_BOX} focusable="false">
                            <defs>
                                <linearGradient id={face} x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" className="plus2d__face-hi" />
                                    <stop offset="55%" className="plus2d__face-mid" />
                                    <stop offset="100%" className="plus2d__face-lo" />
                                </linearGradient>
                                <linearGradient id={side} x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" className="plus2d__side-hi" />
                                    <stop offset="100%" className="plus2d__side-lo" />
                                </linearGradient>
                            </defs>
                            {/* The stroke fills the gaps between offset copies so the
                                side reads as one smooth wall instead of steps. */}
                            <g
                                fill={`url(#${side})`}
                                stroke={`url(#${side})`}
                                strokeWidth={1.6}
                                strokeLinejoin="round"
                            >
                                {EXTRUDE_STEPS.map((step) => (
                                    <path
                                        key={step}
                                        d={MARK_D}
                                        transform={`translate(${(step * EXTRUDE.dx).toFixed(2)} ${(step * EXTRUDE.dy).toFixed(2)})`}
                                    />
                                ))}
                            </g>
                            <path d={MARK_D} fill={`url(#${face})`} />
                            <path className="plus2d__rim" d={MARK_D} />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
