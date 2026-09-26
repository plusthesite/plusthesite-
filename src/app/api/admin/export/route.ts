import { NextResponse } from "next/server";
import { route } from "@/server/http/respond";
import { requireAdmin } from "@/server/http/auth";
import { exportTable } from "@/server/services/exportService";

export const dynamic = "force-dynamic";

// GET /api/admin/export?type=leads - download a CSV (admin session required),
// or via cron with header `x-cron-secret` (only supported for type=leads).
export const GET = route(async (request) => {
    const type = new URL(request.url).searchParams.get("type") ?? "";

    const secret = process.env.CRON_SECRET;
    const provided = request.headers.get("x-cron-secret");
    const viaCron = Boolean(secret && provided === secret);

    // Cron-secret bypass is only valid for type=leads; every other type
    // still requires an admin session.
    if (!(viaCron && type === "leads")) await requireAdmin();

    const { filename, csv } = await exportTable(type);

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store",
        },
    });
});
