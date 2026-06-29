import { isComingSoon } from "@/lib/services";
import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import { insertContact, upsertAccountByName } from "@/server/repositories/contactRepo";
import { insertLead } from "@/server/repositories/leadRepo";
import type { ContactInput } from "@/server/validators/contact";

/**
 * Save a contact-form submission, then best-effort: link/create the company
 * account and drop a segmented lead into the sales pipeline. The secondary
 * writes never fail the submission.
 */
export async function submitContact(
    input: ContactInput
): Promise<{ success: true; contact: Record<string, unknown> }> {
    try {
        const contact = await insertContact({
            name: input.name,
            email: input.email,
            company: input.company,
            message: input.message,
        });

        // Link/create the company account (best-effort; table may not exist yet).
        const accountId = input.company ? await upsertAccountByName(input.company) : null;

        // Segment into the sales pipeline. Best-effort: never fail the submission.
        // Don't tag a lead with a service we can't yet deliver (e.g. mobile-app
        // is "coming soon") — route that interest to the flagship Digital Agency.
        const leadService = isComingSoon(input.service) ? "digital-agency" : input.service;
        try {
            await insertLead({
                name: input.name,
                email: input.email,
                phone: input.phone,
                company: input.company,
                account_id: accountId,
                service: leadService,
                message: input.message,
                source: "contact-form",
                status: "new",
                locale: input.locale,
            });
        } catch (leadErr) {
            const msg = leadErr instanceof DbError ? leadErr.dbMessage : String(leadErr);
            console.error("Lead insert (non-fatal):", msg);
        }

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
