import { z } from "zod";
import { ServiceError } from "@/server/http/errors";
import { leadSchema } from "@/server/validators/lead";

/** Business need selected on the free consultation landing form. */
export const CONSULTATION_NEED = [
    "chatbot",
    "website",
    "crm",
    "content",
    "other",
    "unsure",
] as const;

export type ConsultationNeed = (typeof CONSULTATION_NEED)[number];

/** Budget band selected on the form. Not stored in its own column (ERD v2 has
 * no `budget_range` column) — serialized into `message` at write time. */
export const BUDGET_RANGES = ["<2.5", "2.5-7.5", "7.5-20", ">20", "none"] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

/** Human-readable label per band, used when embedding budget into the lead
 * `message` field so sales reps can read it without hunting the form state. */
export const BUDGET_LABELS: Record<BudgetRange, string> = {
    "<2.5": "Rp 0 – 2.500.000",
    "2.5-7.5": "Rp 2.500.000 – 7.500.000",
    "7.5-20": "Rp 7.500.000 – 20.000.000",
    ">20": "> Rp 20.000.000",
    none: "Belum yakin",
};

function toOptionalEnum<E extends readonly [string, ...string[]]>(e: E) {
    return z
        .preprocess(
            (v) => (v == null || v === "" ? undefined : String(v)),
            z.enum(e).optional()
        );
}

/** consultationSchema = leadSchema.extend({
 *   need?, budget_range?  -> mapped by consultationService
 *   source: "landing-konsultasi" (literal)
 * })
 *
 * Email is still the only hard requirement, consistent with leadSchema.
 */
export const consultationSchema = leadSchema.extend({
    need: toOptionalEnum(CONSULTATION_NEED),
    budget_range: toOptionalEnum(BUDGET_RANGES),
    source: z.literal("landing-konsultasi"),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

/** Parse a consultation-form body. Throws ServiceError(400) on invalid input,
 * matching the original lead route contract. */
export function parseConsultation(body: unknown): ConsultationInput {
    const res = consultationSchema.safeParse(body);
    if (!res.success) {
        throw new ServiceError(400, { error: "invalid_email", issues: res.error.issues });
    }
    return res.data;
}
