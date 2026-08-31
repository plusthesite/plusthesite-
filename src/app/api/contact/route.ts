import { NextResponse } from "next/server";
import { getClientIp, route, ServiceError } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { parseContact } from "@/server/validators/contact";
import { submitContact } from "@/server/services/contactService";

export const dynamic = "force-dynamic";

// POST /api/contact - save a contact form submission, then segment it into the
// sales pipeline. Uses the service-role client (server-side) to bypass RLS.
export const POST = route(async (request) => {
    enforceRateLimit(`contact:${getClientIp(request)}`, 5, 60_000, {
        error: "Too many requests. Please try again later.",
    });

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        throw new ServiceError(500, { error: "Failed to save contact", detail: "invalid JSON body" });
    }

    const input = parseContact(body);
    return NextResponse.json(await submitContact(input), { status: 201 });
});
