import { NextResponse } from "next/server";
import { route } from "@/server/http/respond";
import { requireAdmin } from "@/server/http/auth";
import { getDashboardStats } from "@/server/services/statsService";
import { buildDigestHtml, sendDigest } from "@/server/services/digestService";

export const dynamic = "force-dynamic";

// GET - preview the digest in the browser (admin session required).
export const GET = route(async () => {
    await requireAdmin();
    const stats = await getDashboardStats();
    return new NextResponse(buildDigestHtml(stats), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
});

// POST - send the digest. Trigger from a cron with header `x-cron-secret`, or
// manually with an admin session.
export const POST = route(async (request) => {
    const secret = process.env.CRON_SECRET;
    const provided = request.headers.get("x-cron-secret");
    const viaCron = Boolean(secret && provided === secret);
    if (!viaCron) await requireAdmin();

    const stats = await getDashboardStats();
    return NextResponse.json(await sendDigest(buildDigestHtml(stats)));
});
