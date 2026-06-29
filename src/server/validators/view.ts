import { z } from "zod";
import { ServiceError } from "@/server/http/errors";

/** Article view-count ping payload. */
export const viewSchema = z.object({
    slug: z.preprocess(
        (v) => (v == null ? "" : String(v)),
        z.string().transform((s) => s.trim().slice(0, 200))
    ),
});

export type ViewInput = z.infer<typeof viewSchema>;

export function parseView(body: unknown): ViewInput {
    const res = viewSchema.safeParse(body);
    if (!res.success || !res.data.slug) {
        throw new ServiceError(400, { error: "invalid_slug" });
    }
    return res.data;
}
