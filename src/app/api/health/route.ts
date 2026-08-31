import { NextResponse } from "next/server";
import { checkHealth } from "@/server/services/healthService";

export const dynamic = "force-dynamic";

// GET /api/health - check Supabase connection
export async function GET() {
    const { status, body } = await checkHealth();
    return NextResponse.json(body, { status });
}
