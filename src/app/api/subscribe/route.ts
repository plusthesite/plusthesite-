import { NextResponse } from "next/server";
import { getClientIp, readJson, route } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { parseSubscribe } from "@/server/validators/subscribe";
import { subscribe } from "@/server/services/subscribeService";

export const POST = route(async (request) => {
    enforceRateLimit(`subscribe:${getClientIp(request)}`, 5, 60_000);
    const input = parseSubscribe(await readJson(request));
    return NextResponse.json(await subscribe(input));
});
