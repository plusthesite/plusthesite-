import { NextResponse } from "next/server";
import { getClientIp, readJson, route } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { parseView } from "@/server/validators/view";
import { recordView } from "@/server/services/viewService";

// POST /api/view - bump an article's view counter. Rate limited because the
// endpoint is public and each call is a database write.
export const POST = route(async (request) => {
    enforceRateLimit(`view:${getClientIp(request)}`, 30, 60_000);
    const input = parseView(await readJson(request));
    return NextResponse.json(await recordView(input));
});
