import { NextResponse } from "next/server";
import { getClientIp, readJson, route } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { getLeadsDashboard, updateLeadStage, addLeadNote, exportLeadsCSV } from "@/server/services/leadService";

export const GET = route(async (request) => {
    enforceRateLimit(`leads:get:${getClientIp(request)}`, 30, 60_000);

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage") ?? undefined;
    const source = searchParams.get("source") ?? undefined;
    const dateFrom = searchParams.get("dateFrom") ?? undefined;
    const dateTo = searchParams.get("dateTo") ?? undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;
    const format = searchParams.get("format"); // "csv" for export

    const leads = await getLeadsDashboard({ stage, source, dateFrom, dateTo, limit, offset });

    if (format === "csv") {
        const csv = await exportLeadsCSV({ stage, source, dateFrom, dateTo, limit: 10000 });
        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        });
    }

    return NextResponse.json({ leads, total: leads.length });
});

export const PATCH = route(async (request) => {
    enforceRateLimit(`leads:patch:${getClientIp(request)}`, 20, 60_000);

    const body = await readJson(request);
    const { leadId, stage, note } = body;

    if (!leadId) {
        return NextResponse.json({ error: "leadId required" }, { status: 400 });
    }

    if (stage) {
        await updateLeadStage(leadId, stage);
    }

    if (note) {
        await addLeadNote(leadId, note);
    }

    return NextResponse.json({ ok: true });
});