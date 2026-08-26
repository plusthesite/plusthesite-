"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * Extruded 3D plus mark that travels the page.
 *
 * The solid is a stack of CSS layers sharing one SVG mask — 56 empty divs and a
 * single copy of the path data, no WebGL and no 3D library. Sub-pixel Z steps
 * keep the extruded side smooth instead of staircased.
 *
 * It rides the scroll: starts large beside the hero headline, crosses the page
 * through the margins, and settles small in the bottom-left corner once the FAQ
 * section comes into view.
 */

/** Layer count and depth are paired: 44 / 56 keeps each Z step under 0.8px. */
const LAYERS = 56;
const DEPTH = 44;

/** Widest the mark ever renders. Later stops only scale down, so it stays crisp. */
const MAX_SIZE = 440;
const SIZE_VW = 0.44;

/** Depth shading: back of the extrusion is dark, the front face is brand blue. */
const BACK = [4, 44, 92];
const FRONT = [12, 116, 235];

const MASK = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEW_BOX}"><path d="${MARK_D}" fill="#000"/></svg>`,
)}")`;

type Stop = {
    /** Scroll progress, 0 at the top of the page, 1 when the FAQ is in view. */
    p: number;
    /** Centre of the mark, as a fraction of the viewport. */
    x: number;
    y: number;
    scale: number;
    rx: number;
    ry: number;
    rz: number;
    opacity: number;
};

/**
 * The path. Kept in the page margins so the mark never sits on a paragraph,
 * and faded down once it leaves the hero.
 */
const STOPS: Stop[] = [
    { p: 0, x: 0.78, y: 0.4, scale: 1, rx: -14, ry: 24, rz: -13, opacity: 1 },
    { p: 0.3, x: 0.13, y: 0.3, scale: 0.46, rx: 16, ry: -22, rz: 10, opacity: 0.42 },
    { p: 0.62, x: 0.88, y: 0.68, scale: 0.38, rx: -10, ry: 30, rz: -18, opacity: 0.4 },
    { p: 1, x: 0.1, y: 0.86, scale: 0.34, rx: 9, ry: -25, rz: 13, opacity: 0.55 },
];

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const mix = (from: number, to: number, t: number) => from + (to - from) * t;

/** Ease each leg so the mark glides between stops instead of snapping. */
const ease = (t: number) => t * t * (3 - 2 * t);

function sample(progress: number): Omit<Stop, "p"> {
    let index = 0;
    while (index < STOPS.length - 2 && progress > STOPS[index + 1].p) index += 1;

    const from = STOPS[index];
    const to = STOPS[index + 1];
    const span = to.p - from.p || 1;
    const t = ease(clamp((progress - from.p) / span, 0, 1));

    return {
        x: mix(from.x, to.x, t),
        y: mix(from.y, to.y, t),
        scale: mix(from.scale, to.scale, t),
        rx: mix(from.rx, to.rx, t),
        ry: mix(from.ry, to.ry, t),
        rz: mix(from.rz, to.rz, t),
        opacity: mix(from.opacity, to.opacity, t),
    };
}

export default function Plus3D({ className = "" }: { className?: string }) {
    const moverRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mover = moverRef.current;
        const stage = stageRef.current;
        if (!mover || !stage) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let size = 0;

        const resize = () => {
            size = Math.min(window.innerWidth * SIZE_VW, MAX_SIZE);
            mover.style.width = `${size}px`;
            mover.style.height = `${size}px`;
        };

        /** The run ends once the FAQ heading has cleared the top of the screen. */
        const trackLength = () => {
            const faq = document.getElementById("faq");
            const fallback = document.body.scrollHeight - window.innerHeight;
            if (!faq) return Math.max(fallback, 1);

            const top = faq.getBoundingClientRect().top + window.scrollY;
            return Math.max(top - window.innerHeight * 0.15, 1);
        };

        const apply = () => {
            const progress = reduced ? 0 : clamp(window.scrollY / trackLength(), 0, 1);
            const at = sample(progress);
            const left = at.x * window.innerWidth - size / 2;
            const top = at.y * window.innerHeight - size / 2;

            mover.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${at.scale})`;
            mover.style.opacity = String(at.opacity);
            stage.style.transform = `rotateX(${at.rx}deg) rotateY(${at.ry}deg) rotateZ(${at.rz}deg)`;
        };

        // Place it without easing first, so it does not glide in from the corner.
        mover.style.transition = "none";
        resize();
        apply();
        void mover.offsetWidth;
        mover.style.transition = "";

        const onResize = () => {
            resize();
            apply();
        };

        window.addEventListener("scroll", apply, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });

        return () => {
            window.removeEventListener("scroll", apply);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div
            className={`plus3d ${className}`}
            style={{ "--mask": MASK } as CSSProperties}
            aria-hidden
        >
            <div className="plus3d__mover" ref={moverRef}>
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
        </div>
    );
}
