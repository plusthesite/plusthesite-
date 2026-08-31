import { getService } from "@/lib/services";

export interface ScorableLead {
    service: string | null;
    phone: string | null;
    email: string | null;
    website?: string | null;
    status: string | null;
    value: number | null;
    source: string | null;
    created_at: string;
}

const STATUS_SCORE: Record<string, number> = { new: 5, contacted: 15, qualified: 25, unqualified: 0, converted: 0 };
const SOURCE_SCORE: Record<string, number> = { referral: 15, "contact-form": 12, linkedin: 10, website: 8, instagram: 7, blog: 7, "google-places": 5, manual: 8 };

/**
 * Heuristic 0–100 lead score so sales works the hottest, highest-value,
 * most-reachable prospects first. Fully derived from existing fields.
 */
export function scoreLead(l: ScorableLead): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Deal value (0–40) - bigger potential revenue ranks higher.
    const value = l.value ?? getService(l.service)?.startingValue ?? 0;
    const vScore = Math.min(40, Math.round(value / 1_250_000));
    if (vScore > 0) { score += vScore; reasons.push(`High value (${vScore})`); }

    // Reachability.
    if (l.phone) { score += 20; reasons.push("Has phone"); }
    if (l.email) { score += 10; reasons.push("Has email"); }
    if (l.website) { score += 10; reasons.push("Has website"); }

    // Funnel stage.
    const st = STATUS_SCORE[l.status ?? "new"] ?? 5;
    if (st > 0) { score += st; if (st >= 15) reasons.push(`${l.status}`); }

    // Lead source quality.
    score += SOURCE_SCORE[l.source ?? ""] ?? 5;

    // Recency - warmer when fresh.
    const days = (Date.now() - new Date(l.created_at).getTime()) / 86_400_000;
    if (days < 7) { score += 10; reasons.push("Fresh (<7d)"); }
    else if (days < 30) score += 5;

    return { score: Math.min(100, score), reasons };
}

export function scoreTier(score: number): { label: string; color: string } {
    if (score >= 70) return { label: "Hot", color: "bg-rose-50 text-rose-700" };
    if (score >= 45) return { label: "Warm", color: "bg-amber-50 text-amber-700" };
    return { label: "Cold", color: "bg-slate-100 text-slate-500" };
}
