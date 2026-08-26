"use client";

import { useEffect, useRef } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * The plus mark as the pointer.
 *
 * Trails the real pointer with a little easing, swells over anything clickable,
 * and shrinks to a dot while pressing. Mouse-only: coarse pointers keep their
 * native behaviour, and reduced-motion visitors keep the system cursor, since
 * a lagging cursor is exactly the kind of motion that setting asks us to drop.
 */

const INTERACTIVE = 'a,button,[role="button"],summary,label,select,[data-cursor="grow"]';
const TEXT_FIELD = "input,textarea,[contenteditable]";

/** How much of the remaining distance to close each frame. */
const EASE = 0.22;

export default function PlusCursor() {
    const markRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mark = markRef.current;
        if (!mark) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const root = document.documentElement;
        root.classList.add("plus-cursor-on");

        const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const shown = { ...pointer, scale: 1 };
        let target = 1;
        let frame = 0;
        let started = false;

        const draw = () => {
            shown.x += (pointer.x - shown.x) * EASE;
            shown.y += (pointer.y - shown.y) * EASE;
            shown.scale += (target - shown.scale) * EASE;

            mark.style.transform = `translate3d(${shown.x}px, ${shown.y}px, 0) translate(-50%, -50%) scale(${shown.scale})`;
            frame = requestAnimationFrame(draw);
        };

        const onMove = (event: PointerEvent) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;

            if (!started) {
                started = true;
                shown.x = pointer.x;
                shown.y = pointer.y;
                mark.classList.add("plus-cursor--ready");
            }

            const el = event.target as Element | null;
            const overText = !!el?.closest?.(TEXT_FIELD);
            const overLink = !overText && !!el?.closest?.(INTERACTIVE);

            target = overLink ? 1.85 : 1;
            mark.classList.toggle("plus-cursor--soft", overLink);
            mark.classList.toggle("plus-cursor--hidden", overText);
        };

        const onDown = () => {
            target = 0.7;
        };
        const onUp = () => {
            target = 1;
        };
        const onLeave = () => mark.classList.remove("plus-cursor--ready");
        const onEnter = () => mark.classList.add("plus-cursor--ready");

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });
        document.addEventListener("pointerleave", onLeave);
        document.addEventListener("pointerenter", onEnter);
        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            root.classList.remove("plus-cursor-on");
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            document.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("pointerenter", onEnter);
        };
    }, []);

    return (
        <div className="plus-cursor" ref={markRef} aria-hidden>
            <svg viewBox={MARK_VIEW_BOX} focusable="false">
                <path d={MARK_D} />
            </svg>
        </div>
    );
}
