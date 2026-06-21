import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import { insertSubscriber } from "@/server/repositories/subscriberRepo";
import type { SubscribeInput } from "@/server/validators/subscribe";

/** Subscribe an email to the newsletter. A duplicate is treated as success
 * (idempotent), matching the original route. */
export async function subscribe(input: SubscribeInput): Promise<{ ok: true }> {
    try {
        await insertSubscriber(input.email, input.locale);
        return { ok: true };
    } catch (err) {
        if (err instanceof NotConfiguredError) {
            throw new ServiceError(503, { error: "not_configured" });
        }
        if (err instanceof DbError) {
            throw new ServiceError(500, { error: "db_error" });
        }
        throw err;
    }
}
