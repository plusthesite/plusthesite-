import { ServiceError } from "@/server/http/errors";

export type AiAction = "structured" | "text" | "image";

export interface AiRequest {
    action: string;
    prompt: string;
    /** Gemini responseSchema, required only for the "structured" action. */
    schema?: unknown;
}

/** Parse an AI proxy request. Only `prompt` is required up front; the action
 * and per-action requirements (e.g. schema) are validated by the service so
 * the original error ordering is preserved. */
export function parseAiRequest(body: unknown): AiRequest {
    const b = (body ?? {}) as Record<string, unknown>;
    const prompt = b.prompt;

    if (!prompt) {
        throw new ServiceError(400, { error: "Prompt is required" });
    }

    return {
        action: typeof b.action === "string" ? b.action : "",
        prompt: String(prompt),
        schema: b.schema,
    };
}
