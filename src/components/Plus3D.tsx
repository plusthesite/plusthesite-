"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * Extruded 3D plus mark for the hero.
 *
 * The solid is a stack of CSS layers sharing one SVG mask — 44 empty divs and
 * a single copy of the path data, no WebGL and no 3D library. Z steps stay
 * under a pixel so the extruded side reads as one smooth face.
 *
 * Motion is deliberately quiet: a slow idle float, plus a gentle turn and lift
 * as the hero scrolls away. It stays inside the hero so it never competes with
 * the page content below.
 */

/** Paired so every Z step stays sub-pixel (18 / 19 = 0.95px). */
const LAYERS = 20;
const DEPTH = 36;

/** Depth shading: back of the extrusion is dark, the front face is brand blue. */
const BACK = [4, 44, 92];
const FRONT = [12, 116, 235];

const MASK = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEW_BOX}"><path d="${MARK_D}" fill="#000"/></svg>`,
)}")`;

/** Start and end of the turn, measured across one viewport of scrolling. */
const TURN = {
    rotateX: [-14, 8],
    rotateY: [24, -8],
    rotateZ: [-13, -2],
    y: [0, -14],
    scale: [1, 0.86],
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const at = (range: number[], t: number) => range[0] + (range[1] - range[0]) * t;

export default function Plus3D({ className = "" }: { className?: string }) {
    const stageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Cheap wins first: while the hero is off-screen the 44 masked layers
        // keep compositing for nothing, so pause the idle float entirely.
        let running = false;
        let visible = true;

        const sync = () => {
            const shouldRun = visible && window.scrollY < window.innerHeight;
            if (shouldRun === running) return;
            running = shouldRun;
            // The idle-float animation lives on the parent (.plus3d__float).
            const floater = stage.parentElement;
            floater?.classList.toggle("is-running", running);
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
            if (settled && t >= 1) return; // hero fully gone: nothing left to animate
            if (t < 1) settled = false;

            stage.style.transform = [
                `translateY(${at(TURN.y, t)}%)`,
                `rotateX(${at(TURN.rotateX, t)}deg)`,
                `rotateY(${at(TURN.rotateY, t)}deg)`,
                `rotateZ(${at(TURN.rotateZ, t)}deg)`,
                `scale(${at(TURN.scale, t)})`,
            ].join(" ");
            stage.style.opacity = String(1 - t * 0.9);
            if (t >= 1) settled = true;
        };

        // Scroll events fire faster than frames; coalesce to one write per frame.
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
        <div
            className={`plus3d ${className}`}
            style={{ "--mask": MASK } as CSSProperties}
            aria-hidden
        >
            <div className="plus3d__float">
                <div className="plus3d__stage" ref={stageRef}>
                    {Array.from({ length: LAYERS }, (_, index) => {
                        const depth = index / (LAYERS - 1);
                        const color = BACK.map((from, channel) =>
                            Math.round(from + (FRONT[channel] - from) * depth),
                        );

                        return (
                            <div
                                key={index}
                                className="plus3d__layer"
                                style={{
                                    backgroundColor: `rgb(${color.join(" ")})`,
                                    transform: `translateZ(${(depth - 1) * DEPTH}px)`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
