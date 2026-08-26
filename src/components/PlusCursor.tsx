"use client";

import { useEffect, useRef } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * The plus mark as the pointer.
 *
 * Sits exactly on the pointer — no positional easing, because a mark that
 * trails the hand reads as lag rather than polish. Only the scale is eased, so
 * growing over a link still feels soft. Mouse-only: coarse pointers keep their
 * native behaviour, and reduced-motion visitors keep the system cursor.
 */

const INTERACTIVE = 'a,button,[role="button"],summary,label,select,[data-cursor="grow"]';
const TEXT_FIELD = "input,textarea,[contenteditable]";

/** Scale is the only eased channel: share of the gap closed each frame. */
const SCALE_EASE = 0.3;

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
        let scale = 1;
        let target = 1;
        let frame = 0;
        let started = false;

        const paint = () => {
            mark.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        };

        const draw = () => {
            scale += (target - scale) * SCALE_EASE;
            paint();
            frame = requestAnimationFrame(draw);
        };

        const onMove = (event: PointerEvent) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            paint();

            if (!started) {
                started = true;
                mark.classList.add("plus-cursor--ready");
            }

            const el = event.target as Element | null;
            const overText = !!el?.closest?.(TEXT_FIELD);
            const overLink = !overText && !!el?.closest?.(INTERACTIVE);

            target = overLink ? 1.7 : 1;
            mark.classList.toggle("plus-cursor--invert", overLink);
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
