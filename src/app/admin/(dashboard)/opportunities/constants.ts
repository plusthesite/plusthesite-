export const STAGES = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"] as const;
export type Stage = (typeof STAGES)[number];

/** Default win-probability per stage — keeps the weighted pipeline sensible. */
export const STAGE_PROBABILITY: Record<Stage, number> = {
    new: 10,
    contacted: 25,
    qualified: 45,
    proposal: 60,
    negotiation: 80,
    won: 100,
    lost: 0,
};
