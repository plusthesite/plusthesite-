import { NextResponse } from "next/server";
import { getClientIp, readJson, route } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { parseLead } from "@/server/validators/lead";
import { createLead } from "@/server/services/leadService";

export const POST = route(async (request) => {
    enforceRateLimit(`lead:${getClientIp(request)}`, 5, 60_000);
    const input = parseLead(await readJson(request));
    return NextResponse.json(await createLead(input));
});
