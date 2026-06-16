import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TABLES: Record<string, { columns: string[] }> = {
    leads: { columns: ["name", "email", "phone", "company", "service", "status", "value", "owner", "source", "created_at"] },
    opportunities: { columns: ["name", "company", "contact_name", "email", "phone", "value", "stage", "probability", "service", "owner", "expected_close", "created_at"] },
    accounts: { columns: ["name", "industry", "website", "phone", "email", "owner", "created_at"] },
    subscribers: { columns: ["email", "locale", "created_at"] },
    contacts: { columns: ["name", "email", "company", "message", "created_at"] },
};

function csvCell(v: unknown): string {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// GET /api/admin/export?type=leads — download a CSV (admin session required).
export async function GET(request: NextRequest) {
    const supabaseAuth = await createSupabaseServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const type = request.nextUrl.searchParams.get("type") ?? "";
    const spec = TABLES[type];
    if (!spec) return NextResponse.json({ error: "invalid type" }, { status: 400 });

    const admin = getSupabaseAdmin();
    if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });

    const { data, error } = await admin.from(type).select(spec.columns.join(",")).order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const rows = (data ?? []) as unknown as Record<string, unknown>[];
    const header = spec.columns.join(",");
    const body = rows.map((r) => spec.columns.map((c) => csvCell(r[c])).join(",")).join("\n");
    const csv = `${header}\n${body}\n`;
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="plus-${type}-${date}.csv"`,
            "Cache-Control": "no-store",
        },
    });
}
