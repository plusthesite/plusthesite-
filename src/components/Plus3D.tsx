"use client";

import { useEffect, useRef } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * The plus mark as a flat 2D motion graphic.
 *
 * One SVG, three cheap channels: a CSS float loop, a scroll-driven turn and
 * drift (transform on a wrapper, one write per frame), and a slow glow pulse.
 * No masks, no layer stacks - a fraction of the old 3D build's cost.
 */

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/** Start and end of the turn, measured across one viewport of scrolling.
    Rotation starts at 0 so the mark is square to the frame at rest and only
    drifts a few degrees as the hero scrolls away - the old -8deg start meant
    the mark was permanently off-axis, fighting the headline baseline. */
const TURN = {
    rotate: [0, 5],
    y: [0, -16],
    scale: [1, 0.9],
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
                const wasVisible = visible;
                visible = entry.isIntersecting;
                if (wasVisible && !visible) {
                    // Settle the mark at its final pose and drop the
                    // compositor hint, so nothing is left animating offscreen.
                    apply();
                    stage.style.willChange = "auto";
                }
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
            // Nothing to do once the mark has scrolled away: `apply` would
            // otherwise write style.transform on every scroll frame for the
            // rest of the page, which is pure main-thread cost.
            if (!visible || ticking) return;
            ticking = true;
            requestAnimationFrame(apply);
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
            {/* Aura and ring live outside the scroll-driven stage: they are the
                mark's atmosphere, not part of the mark, so they must not turn
                and shrink with it. */}
            <div className="plus2d__glow" />
            <div className="plus3d__float">
                <div className="plus3d__stage" ref={stageRef}>
                    <div className="plus2d__ring" />
                    <svg className="plus2d" viewBox={MARK_VIEW_BOX} focusable="false">
                        <path className="plus2d__path" d={MARK_D} />
                    </svg>
                </div>
            </div>
        </div>
    );
}
