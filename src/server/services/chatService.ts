import { ServiceError } from "@/server/http/errors";
import { DbError, NotConfiguredError } from "@/server/repositories/client";
import { getMessages, insertMessage } from "@/server/repositories/chatRepo";
import type { ChatMessageInput } from "@/server/validators/chat";

/** Retrieve a chat session's history. */
export async function getChatHistory(sessionId: string): Promise<{ messages: Record<string, unknown>[] }> {
    try {
        const messages = await getMessages(sessionId);
        return { messages };
    } catch (err) {
        if (err instanceof NotConfiguredError) {
            throw new ServiceError(503, { error: "Database not configured" });
        }
        if (err instanceof DbError) {
            console.error("Chat GET error:", err.dbMessage);
            throw new ServiceError(500, { error: "Failed to fetch messages" });
        }
        throw err;
    }
}

/** Persist a chat message. */
export async function saveChatMessage(msg: ChatMessageInput): Promise<{ message: Record<string, unknown> }> {
    try {
        const message = await insertMessage(msg);
        return { message };
    } catch (err) {
        if (err instanceof NotConfiguredError) {
            throw new ServiceError(503, { error: "Database not configured" });
        }
        if (err instanceof DbError) {
            console.error("Chat POST error:", err.dbMessage);
            throw new ServiceError(500, { error: "Failed to save message" });
        }
        throw err;
    }
}
