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
 * It rides the scroll along a single arc: large beside the hero headline, down
 * the right margin, across to the bottom-left corner by the time the FAQ is in
 * view, then faded out entirely before the footer.
 */

/** Paired so every Z step stays under a pixel (36 / 44 = 0.84px) while
 *  keeping the composited stack small enough not to tax the GPU on scroll. */
const LAYERS = 44;
const DEPTH = 36;

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
 * One sweeping arc from the hero down to the bottom-left corner, with the
 * rotation always turning the same way so it reads as a slow tumble rather
 * than a shape snapping between corners. Stops stay in the page margins.
 */
const STOPS: Stop[] = [
    { p: 0, x: 0.78, y: 0.4, scale: 1, rx: -14, ry: 24, rz: -13, opacity: 1 },
    { p: 0.36, x: 0.87, y: 0.63, scale: 0.44, rx: -2, ry: -10, rz: -3, opacity: 0.3 },
    { p: 0.72, x: 0.34, y: 0.76, scale: 0.37, rx: 8, ry: -40, rz: 7, opacity: 0.24 },
    { p: 1, x: 0.085, y: 0.875, scale: 0.31, rx: 16, ry: -62, rz: 15, opacity: 0.46 },
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
            return Math.max(top - window.innerHeight * 0.35, 1);
        };

        /** Holds full strength while the mark is parked by the FAQ, then fades
         *  as the footer climbs the screen so it never lands on the dark panel. */
        const footerFade = () => {
            const footer = document.querySelector("footer");
            if (!footer) return 1;

            const top = footer.getBoundingClientRect().top;
            const gone = window.innerHeight * 0.35;
            return clamp((top - gone) / (window.innerHeight * 0.65), 0, 1);
        };

        const apply = () => {
            const progress = reduced ? 0 : clamp(window.scrollY / trackLength(), 0, 1);
            const at = sample(progress);
            const left = at.x * window.innerWidth - size / 2;
            const top = at.y * window.innerHeight - size / 2;

            mover.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${at.scale})`;
            mover.style.opacity = String(at.opacity * footerFade());
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
