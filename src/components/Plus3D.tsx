"use client";

import { useEffect, useRef } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * The plus mark as a flat 2D motion graphic.
 *
 * One SVG, three cheap channels: a CSS float loop, a scroll-driven turn and
 * drift (transform on a wrapper, one write per frame), and a slow glow pulse.
 * No masks, no layer stacks — a fraction of the old 3D build's cost.
 */

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/** Start and end of the turn, measured across one viewport of scrolling. */
const TURN = {
    rotate: [-8, 6],
    y: [0, -18],
    scale: [1, 0.88],
};

const at = (range: number[], t: number) => range[0] + (range[1] - range[0]) * t;

export default function Plus3D({ className = "" }: { className?: string }) {
    const stageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let visible = true;
        let running = false;

        const sync = () => {
            const shouldRun = visible && window.scrollY < window.innerHeight;
            if (shouldRun === running) return;
            running = shouldRun;
            stage.classList.toggle("is-running", running);
            stage.style.willChange = running ? "transform" : "auto";
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                sync();
            },
            { threshold: 0 },
        );
        observer.observe(stage);

        let settled = false;
        let ticking = false;
        const apply = () => {
            ticking = false;
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
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(apply);
            }
        };

        apply();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", apply, { passive: true });
        sync();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", apply);
        };
    }, []);

    return (
        <div className={`plus3d ${className}`} aria-hidden>
            <div className="plus3d__float">
                <div className="plus3d__stage" ref={stageRef}>
                    <div className="plus2d__glow" />
                    <svg className="plus2d" viewBox={MARK_VIEW_BOX} focusable="false">
                        <path className="plus2d__path" d={MARK_D} />
                    </svg>
                </div>
            </div>
        </div>
    );
}
