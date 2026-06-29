import { formatIDR } from "@/lib/services";
import type { DashboardStats } from "@/server/services/statsService";

/** Render the daily pipeline digest email body from a dashboard snapshot. */
export function buildDigestHtml(stats: DashboardStats): string {
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

/** Send the digest via Resend. No-ops (reports a reason) when not configured. */
export async function sendDigest(html: string): Promise<{ sent: boolean; reason?: string; status?: number }> {
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
