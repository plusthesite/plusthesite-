import { z } from "zod";
import { ServiceError } from "@/server/http/errors";

export const CHAT_ROLES = ["user", "assistant"] as const;

/** Caps on the public, unauthenticated chat write. Without them a single POST
 * can push an arbitrarily large row into the database. */
const MAX_SESSION_ID = 100;
const MAX_CONTENT = 4000;

/** A chat message to persist. */
export const chatMessageSchema = z.object({
    session_id: z.string().min(1).max(MAX_SESSION_ID),
    role: z.enum(CHAT_ROLES),
    content: z.string().min(1).max(MAX_CONTENT),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

/** Parse a chat message, preserving the original required-then-role error order. */
export function parseChatMessage(body: unknown): ChatMessageInput {
    const b = (body ?? {}) as Record<string, unknown>;

    if (!b.session_id || !b.role || !b.content) {
        throw new ServiceError(400, { error: "session_id, role, and content are required" });
    }
    if (!CHAT_ROLES.includes(b.role as (typeof CHAT_ROLES)[number])) {
        throw new ServiceError(400, { error: 'role must be "user" or "assistant"' });
    }

    return {
        session_id: String(b.session_id).slice(0, MAX_SESSION_ID),
        role: b.role as (typeof CHAT_ROLES)[number],
        content: String(b.content).slice(0, MAX_CONTENT),
    };
}

/** Validate the `session_id` query param for chat-history reads. */
export function parseSessionId(sessionId: string | null): string {
    if (!sessionId) {
        throw new ServiceError(400, { error: "session_id is required" });
    }
    return sessionId.slice(0, MAX_SESSION_ID);
}
