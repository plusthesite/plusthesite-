"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * Extruded 3D plus mark for the hero backdrop.
 *
 * Built from stacked CSS layers that share one SVG mask, so the whole thing is
 * ~40 empty divs and a single copy of the path data — no WebGL, no 3D library.
 * The stack tilts, spins and drifts as the page scrolls; a slow idle float
 * keeps it alive when the visitor is not scrolling.
 */

const LAYERS = 26;

/** Depth shading: back of the extrusion is dark, the front face is brand blue. */
const BACK = [4, 44, 92];
const FRONT = [12, 116, 235];

const MASK = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEW_BOX}"><path d="${MARK_D}" fill="#000"/></svg>`,
)}")`;

/** How far the mark travels between the top of the hero and one screen down. */
const TRAVEL = {
    rotateX: [-14, 26],
    rotateY: [24, -34],
    rotateZ: [-13, 14],
    y: [0, -18],
    scale: [1, 0.72],
};

const lerp = (range: number[], t: number) => range[0] + (range[1] - range[0]) * t;

export default function Plus3D({ className = "" }: { className?: string }) {
    const stageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const apply = () => {
            const span = window.innerHeight || 1;
            const t = Math.min(Math.max(window.scrollY / span, 0), 1);

            stage.style.transform = [
                `translateY(${lerp(TRAVEL.y, t)}%)`,
                `rotateX(${lerp(TRAVEL.rotateX, t)}deg)`,
                `rotateY(${lerp(TRAVEL.rotateY, t)}deg)`,
                `rotateZ(${lerp(TRAVEL.rotateZ, t)}deg)`,
                `scale(${lerp(TRAVEL.scale, t)})`,
            ].join(" ");
            stage.style.opacity = String(1 - t * 0.85);
        };

        apply();
        window.addEventListener("scroll", apply, { passive: true });
        window.addEventListener("resize", apply, { passive: true });

        return () => {
            window.removeEventListener("scroll", apply);
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
                                    transform: `translateZ(${(depth - 1) * 58}px)`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
