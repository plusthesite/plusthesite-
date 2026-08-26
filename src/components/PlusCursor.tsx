"use client";

import { useEffect, useRef } from "react";
import { MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * The plus mark as the pointer — lightweight build.
 *
 * Position is written straight from pointermove (a compositor-only
 * transform), the grow-on-hover is a CSS transition on a nested element, and
 * there is no drop-shadow filter and no rAF loop: nothing runs between mouse
 * moves. Hover swaps the fill blue -> black (white -> blue in dark theme).
 * Mouse-only; coarse pointers and reduced-motion visitors keep the native
 * cursor.
 */

const INTERACTIVE = 'a,button,[role="button"],summary,label,select,[data-cursor="grow"]';
const TEXT_FIELD = "input,textarea,[contenteditable]";

export default function PlusCursor() {
    const markRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mark = markRef.current;
        if (!mark) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const root = document.documentElement;
        root.classList.add("plus-cursor-on");

        let overLink = false;
        let overText = false;
        let started = false;

        const onMove = (event: PointerEvent) => {
            mark.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;

            if (!started) {
                started = true;
                mark.classList.add("plus-cursor--ready");
            }

            const el = event.target as Element | null;
            const nextText = !!el?.closest?.(TEXT_FIELD);
            const nextLink = !nextText && !!el?.closest?.(INTERACTIVE);

            // Class writes only on state changes, not on every move.
            if (nextLink !== overLink) {
                overLink = nextLink;
                mark.classList.toggle("plus-cursor--hover", overLink);
            }
            if (nextText !== overText) {
                overText = nextText;
                mark.classList.toggle("plus-cursor--hidden", overText);
            }
        };

        const onLeave = () => mark.classList.remove("plus-cursor--ready");
        const onEnter = () => mark.classList.add("plus-cursor--ready");
        const onDown = () => mark.classList.add("plus-cursor--press");
        const onUp = () => mark.classList.remove("plus-cursor--press");

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });
        document.addEventListener("pointerleave", onLeave);
        document.addEventListener("pointerenter", onEnter);

        return () => {
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
            <div className="plus-cursor__scale">
                <svg viewBox={MARK_VIEW_BOX} focusable="false">
                    <path d={MARK_D} />
                </svg>
            </div>
        </div>
    );
}
