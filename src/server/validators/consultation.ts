import { z } from "zod";
import { ServiceError } from "@/server/http/errors";
import { leadSchema } from "@/server/validators/lead";
import { CONSULTATION_NEED, BUDGET_RANGES } from "@/lib/consultationOptions";
import type { ConsultationNeed, BudgetRange } from "@/lib/consultationOptions";

export type { ConsultationNeed, BudgetRange };

function toOptionalEnum<E extends readonly [string, ...string[]]>(e: E) {
    return z
        .preprocess(
            (v) => (v == null || v === "" ? undefined : String(v)),
            z.enum(e).optional()
        );
}

/**
 * consultationSchema = leadSchema.extend({ need?, budget_range? }).
 *
 * `source` is intentionally NOT overridden here: the lead-schema default
 * ("website") is harmless because consultationService always writes
 * `source: "landing-konsultasi"` on the row. Enforcing the source in one place
 * (the service) keeps the client contract minimal — the form sends only real
 * fields, never a source marker.
 *
 * Email is still the only hard requirement, consistent with leadSchema.
 */
export const consultationSchema = leadSchema.extend({
    need: toOptionalEnum(CONSULTATION_NEED),
    budget_range: toOptionalEnum(BUDGET_RANGES),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

/** Parse a consultation-form body. Throws ServiceError(400) on invalid input,
 * matching the original lead route contract. */
export function parseConsultation(body: unknown): ConsultationInput {
    const res = consultationSchema.safeParse(body);
    if (!res.success) {
        throw new ServiceError(400, { error: "invalid_input", issues: res.error.issues });
    }
    return res.data;
}
