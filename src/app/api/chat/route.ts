import { NextResponse } from "next/server";
import { getClientIp, route, ServiceError } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { parseChatMessage, parseSessionId } from "@/server/validators/chat";
import { getChatHistory, saveChatMessage } from "@/server/services/chatService";

export const dynamic = "force-dynamic";

// GET /api/chat?session_id=xxx - retrieve chat history
export const GET = route(async (request) => {
    enforceRateLimit(`chat-get:${getClientIp(request)}`, 60, 60_000);
    const sessionId = parseSessionId(new URL(request.url).searchParams.get("session_id"));
    return NextResponse.json(await getChatHistory(sessionId));
});

// POST /api/chat - save a chat message. Public and unauthenticated, so the
// write is rate limited per IP.
export const POST = route(async (request) => {
    enforceRateLimit(`chat-post:${getClientIp(request)}`, 30, 60_000);

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        throw new ServiceError(500, { error: "Failed to save message" });
    }
    const msg = parseChatMessage(body);
    return NextResponse.json(await saveChatMessage(msg), { status: 201 });
});
