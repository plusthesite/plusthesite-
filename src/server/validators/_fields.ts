import { z } from "zod";

/** Shared zod field builders so every validator normalizes input the same way. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trimmed string capped at `max` chars; empty becomes null. */
export const optStr = (max: number) =>
    z
        .preprocess(
            (v) => (v == null ? "" : String(v)),
            z.string().transform((s) => s.trim().slice(0, max))
        )
        .transform((s) => (s.length ? s : null));

/** Required, lowercased, trimmed email validated against {@link EMAIL_RE}. */
export const emailField = z.preprocess(
    (v) => (v == null ? "" : String(v).trim().toLowerCase()),
    z.string().regex(EMAIL_RE)
);

/** Locale narrowed to "id" | "en"; anything but "id" falls back to "en". */
export const localeField = z.preprocess(
    (v) => (v === "id" ? "id" : "en"),
    z.enum(["id", "en"])
);
