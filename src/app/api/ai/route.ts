import { NextResponse } from "next/server";
import { getClientIp, route } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { parseAiRequest } from "@/server/validators/ai";
import { runAi } from "@/server/services/aiService";

export const POST = route(async (request) => {
    enforceRateLimit(`ai:${getClientIp(request)}`, 10, 60_000, {
        error: "Too many requests. Please try again later.",
    });
    const parsed = parseAiRequest(await request.json());
    return NextResponse.json(await runAi(parsed));
});
