import { adminClient, DbError } from "@/server/repositories/client";
import type { ChatMessageInput } from "@/server/validators/chat";

/** Fetch a session's messages in chronological order. */
export async function getMessages(sessionId: string): Promise<Record<string, unknown>[]> {
    const { data, error } = await adminClient()
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
    if (error) throw new DbError(error.message);
    return (data ?? []) as Record<string, unknown>[];
}

/** Persist a single message, returning the created row. */
export async function insertMessage(msg: ChatMessageInput): Promise<Record<string, unknown>> {
    const { data, error } = await adminClient()
        .from("chat_messages")
        .insert({ session_id: msg.session_id, role: msg.role, content: msg.content })
        .select()
        .single();
    if (error) throw new DbError(error.message);
    return data as Record<string, unknown>;
}
