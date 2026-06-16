import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/adminStats";
import { formatIDR } from "@/lib/services";

export const dynamic = "force-dynamic";

function buildDigestHtml(stats: Awaited<ReturnType<typeof getDashboardStats>>) {
    const today = stats.newLeads14d.at(-1)?.count ?? 0;
    const hot = stats.hotOpportunities
        .map((o) => `<li><strong>${o.company ?? o.name}</strong> — ${formatIDR(o.value, true)} <em>(${o.stage})</em></li>`)
        .join("") || "<li>No open deals</li>";

    return `<!doctype html><html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
    <h2 style="margin:0 0 4px">plus. — Daily Pipeline Digest</h2>
    <p style="color:#64748b;margin:0 0 20px">${new Date().toLocaleDateString("en-GB", { dateStyle: "full" })}</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr><td style="padding:8px 0;color:#64748b">New leads today</td><td style="text-align:right;font-weight:700">${today}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Open follow-ups${stats.overdueTasks ? ` (<span style="color:#e11d48">${stats.overdueTasks} overdue</span>)` : ""}</td><td style="text-align:right;font-weight:700">${stats.openTasks}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Open pipeline</td><td style="text-align:right;font-weight:700">${formatIDR(stats.openPipeline, true)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Weighted forecast</td><td style="text-align:right;font-weight:700">${formatIDR(stats.weightedPipeline, true)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Won revenue</td><td style="text-align:right;font-weight:700;color:#059669">${formatIDR(stats.wonValue, true)}</td></tr>
    </table>
    <h3 style="margin:0 0 8px">🔥 Hot opportunities</h3>
    <ul style="padding-left:18px;color:#334155">${hot}</ul>
    <p style="margin-top:24px"><a href="https://plusthe.site/admin" style="color:#2563eb">Open dashboard →</a></p>
  </body></html>`;
}

async function send(html: string) {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.ADMIN_DIGEST_EMAIL;
    if (!key || !to) return { sent: false, reason: "RESEND_API_KEY / ADMIN_DIGEST_EMAIL not set" };
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "plus. <digest@plusthe.site>", to, subject: "plus. — Daily Pipeline Digest", html }),
    });
    return { sent: res.ok, status: res.status };
}

// GET — preview the digest in the browser (admin session required).
export async function GET() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const stats = await getDashboardStats();
    return new NextResponse(buildDigestHtml(stats), { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

// POST — send the digest. Trigger from a cron with header `x-cron-secret`.
export async function POST(request: NextRequest) {
    const secret = process.env.CRON_SECRET;
    const provided = request.headers.get("x-cron-secret");
    if (secret && provided === secret) {
        const stats = await getDashboardStats();
        return NextResponse.json(await send(buildDigestHtml(stats)));
    }
    // Fall back to admin session (manual send-now).
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const stats = await getDashboardStats();
    return NextResponse.json(await send(buildDigestHtml(stats)));
}
