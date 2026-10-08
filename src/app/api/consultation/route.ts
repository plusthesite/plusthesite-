import { NextResponse } from "next/server";
import { getClientIp, readJson, route } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { parseConsultation } from "@/server/validators/consultation";
import { createConsultationLead } from "@/server/services/consultationService";

// POST /api/consultation - save a free-consultation lead capture.
// Rate-limited per IP; writes via the service-role client (bypasses RLS).
export const dynamic = "force-dynamic";

export const POST = route(async (request) => {
    enforceRateLimit(`consultation:${getClientIp(request)}`, 5, 60_000, {
        error: "Too many requests. Please try again later.",
    });

    const input = parseConsultation(await readJson(request));
    await createConsultationLead(input);
    return NextResponse.json({ ok: true }, { status: 201 });
});
