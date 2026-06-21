import { z } from "zod";
import { ServiceError } from "@/server/http/errors";
import { EMAIL_RE } from "@/server/validators/_fields";

/** Contact-form payload. Documented as a schema for reference/tests; parsing
 * is done explicitly below to preserve the original error precedence
 * (required-fields message wins over email-format message). */
export const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().regex(EMAIL_RE),
    message: z.string().min(1),
    company: z.string().nullable(),
    phone: z.string().nullable(),
    service: z.string().nullable(),
    locale: z.enum(["id", "en"]),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function parseContact(body: unknown): ContactInput {
    const b = (body ?? {}) as Record<string, unknown>;
    const { name, email, company, phone, service, message, locale } = b;

    if (!name || !email || !message) {
        throw new ServiceError(400, { error: "name, email, and message are required" });
    }
    if (!EMAIL_RE.test(String(email))) {
        throw new ServiceError(400, { error: "Invalid email format" });
    }

    return {
        name: String(name).slice(0, 120),
        email: String(email).trim().toLowerCase().slice(0, 254),
        company: company ? String(company).slice(0, 120) : null,
        phone: phone ? String(phone).slice(0, 40) : null,
        service: service ? String(service).slice(0, 40) : null,
        message: String(message).slice(0, 2000),
        locale: locale === "id" ? "id" : "en",
    };
}
