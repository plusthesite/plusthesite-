import { isComingSoon } from "@/lib/services";
import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import { insertContact, upsertAccountByName } from "@/server/repositories/contactRepo";
import type { ContactInput } from "@/server/validators/contact";

/**
 * Save a contact-form submission as ONE lead row (ERD v2: contacts merged into
 * leads, source='contact-form'), best-effort linking the company account.
 */
export async function submitContact(
    input: ContactInput
): Promise<{ success: true; contact: Record<string, unknown> }> {
    try {
        // Link/create the company account (best-effort; table may not exist yet).
        const accountId = input.company ? await upsertAccountByName(input.company) : null;

        // If a future service is not yet live, route the interest to the
        // flagship Digital Agency lane instead of creating an undeliverable segment.
        const service = isComingSoon(input.service) ? "digital-agency" : input.service;

        const contact = await insertContact({
            name: input.name,
            email: input.email,
            phone: input.phone,
            company: input.company,
            account_id: accountId,
            service,
            message: input.message,
            locale: input.locale,
        });

        return { success: true, contact };
    } catch (err) {
        if (err instanceof NotConfiguredError) {
            throw new ServiceError(503, { error: "Database not configured" });
        }
        if (err instanceof DbError) {
            console.error("Contact POST error:", err.dbMessage);
            throw new ServiceError(500, { error: "Failed to save contact", detail: err.dbMessage });
        }
        throw err;
    }
}
