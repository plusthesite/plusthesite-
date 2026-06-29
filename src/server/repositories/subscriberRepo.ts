import { adminClient, DbError } from "@/server/repositories/client";

/** Postgres unique-violation code — a duplicate subscribe is idempotent. */
const UNIQUE_VIOLATION = "23505";

export interface InsertSubscriberResult {
    duplicated: boolean;
}

/** Insert a subscriber. A duplicate email resolves successfully (idempotent);
 * any other DB error throws {@link DbError}. */
export async function insertSubscriber(
    email: string,
    locale: "id" | "en"
): Promise<InsertSubscriberResult> {
    const { error } = await adminClient().from("subscribers").insert({ email, locale });

    if (error) {
        if (error.code === UNIQUE_VIOLATION) return { duplicated: true };
        throw new DbError(error.message);
    }
    return { duplicated: false };
}
