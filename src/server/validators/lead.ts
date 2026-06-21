import { z } from "zod";
import { ServiceError } from "@/server/http/errors";
import { emailField, localeField, optStr } from "@/server/validators/_fields";

/** Public lead-capture payload (chat widget, landing forms). */
export const leadSchema = z.object({
    email: emailField,
    name: optStr(120),
    phone: optStr(40),
    company: optStr(120),
    service: optStr(40),
    message: optStr(2000),
    locale: localeField,
    source: z
        .preprocess(
            (v) => (v == null ? "website" : String(v)),
            z.string().transform((s) => s.trim().slice(0, 40))
        )
        .transform((s) => s || "website"),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Parse a lead body. Email is the only hard constraint, mirroring the
 * original route which only rejected a malformed email. */
export function parseLead(body: unknown): LeadInput {
    const res = leadSchema.safeParse(body);
    if (!res.success) throw new ServiceError(400, { error: "invalid_email" });
    return res.data;
}
