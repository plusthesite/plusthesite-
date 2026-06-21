import { NextResponse } from "next/server";
import { route, ServiceError } from "@/server/http/respond";
import { parseChatMessage, parseSessionId } from "@/server/validators/chat";
import { getChatHistory, saveChatMessage } from "@/server/services/chatService";

export const dynamic = "force-dynamic";

// GET /api/chat?session_id=xxx — retrieve chat history
export const GET = route(async (request) => {
    const sessionId = parseSessionId(new URL(request.url).searchParams.get("session_id"));
    return NextResponse.json(await getChatHistory(sessionId));
});

// POST /api/chat — save a chat message
export const POST = route(async (request) => {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        throw new ServiceError(500, { error: "Failed to save message" });
    }
    const msg = parseChatMessage(body);
    return NextResponse.json(await saveChatMessage(msg), { status: 201 });
});
