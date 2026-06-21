import { z } from "zod";
import { ServiceError } from "@/server/http/errors";
import { emailField, localeField } from "@/server/validators/_fields";

/** Newsletter subscription payload. */
export const subscribeSchema = z.object({
    email: emailField,
    locale: localeField,
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;

export function parseSubscribe(body: unknown): SubscribeInput {
    const res = subscribeSchema.safeParse(body);
    if (!res.success) throw new ServiceError(400, { error: "invalid_email" });
    return res.data;
}
