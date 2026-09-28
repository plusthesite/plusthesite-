/**
 * Canonical lead/opportunity stage definitions for plus CRM.
 *
 * The stage set mirrors the live CHECK constraints defined in
 * `supabase/erd-v2-phase1.sql`:
 *   - leads_status_chk  -> ('new','contacting','qualified','proposal','won','lost','converted')
 *   - opportunities_stage_chk -> ('new','qualified','proposal','negotiation','won','lost')
 *
 * IMPORTANT: before adding a stage that will be written to `leads.status` or
 * `opportunities.stage`, extend the matching CHECK constraint in a new
 * migration (e.g. erd-v2-phase4.sql) and deploy — otherwise the insert is
 * rejected by the DB. `discovery_requested` is NOT yet a valid live status;
 * consultation leads currently insert as `status='new'` and are filterable by
 * `source='landing-konsultasi'`. See /srv/notes/00-HQ/tasks.md (tag @plus).
 */

export const LEAD_STAGES = [
    "new",
    "contacting",
    "qualified",
    "proposal",
    "won",
    "lost",
    "converted",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

/** Opportunity stage set (subset — no `contacting`/`converted` on opps). */
export const OPPORTUNITY_STAGES = [
    "new",
    "qualified",
    "proposal",
    "negotiation",
    "won",
    "lost",
] as const;

export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

/** Scoring weight per stage — used by the lead-scoring helper when present. */
export const STAGE_WEIGHTS: Record<LeadStage, number> = {
    new: 5,
    contacting: 10,
    qualified: 30,
    proposal: 50,
    won: 100,
    lost: 0,
    converted: 100,
};

export function isValidLeadStage(value: unknown): value is LeadStage {
    return LEAD_STAGES.includes(value as LeadStage);
}

export function isValidOpportunityStage(value: unknown): value is OpportunityStage {
    return OPPORTUNITY_STAGES.includes(value as OpportunityStage);
}
