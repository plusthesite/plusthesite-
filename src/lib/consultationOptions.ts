/**
 * Shared option constants for the free-consultation landing form.
 *
 * Kept in `lib/` (isomorphic, no zod) so both the server validator and the
 * client content module import the exact same values without dragging server
 * code into the client bundle. See /srv/notes/drafts/growth/
 * 2026-09-28-landing-konsultasi-gratis.md §6 for the approved option set.
 */

/** Business need selected on the form. Matches the five dropdown options in
 * the approved copy — there is deliberately no "other" bucket ("unsure"
 * covers it). */
export const CONSULTATION_NEED = [
    "chatbot",
    "website",
    "crm",
    "content",
    "unsure",
] as const;

export type ConsultationNeed = (typeof CONSULTATION_NEED)[number];

/** Budget band selected on the form. Not stored in its own column (ERD v2 has
 * no `budget_range` column) — serialized into `message` at write time. */
export const BUDGET_RANGES = ["<2.5", "2.5-7.5", "7.5-20", ">20", "none"] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

/** Indonesian label per band. Used as the form dropdown text AND when
 * embedding budget into the lead `message` field (reps read IDR/ID), so a rep
 * can map the message back to exactly what the prospect selected. */
export const BUDGET_LABELS: Record<BudgetRange, string> = {
    "<2.5": "Di bawah Rp 2.500.000/bulan",
    "2.5-7.5": "Rp 2.500.000–7.500.000/bulan",
    "7.5-20": "Rp 7.500.000–20.000.000/bulan",
    ">20": "Di atas Rp 20.000.000/bulan",
    none: "Belum ada anggaran",
};
