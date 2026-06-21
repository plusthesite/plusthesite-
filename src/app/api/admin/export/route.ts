import { NextResponse } from "next/server";
import { route } from "@/server/http/respond";
import { requireAdmin } from "@/server/http/auth";
import { exportTable } from "@/server/services/exportService";

export const dynamic = "force-dynamic";

// GET /api/admin/export?type=leads — download a CSV (admin session required).
export const GET = route(async (request) => {
    await requireAdmin();

    const type = new URL(request.url).searchParams.get("type") ?? "";
    const { filename, csv } = await exportTable(type);

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store",
        },
    });
});
