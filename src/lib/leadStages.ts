export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';

export const STAGE_WEIGHTS: Record<LeadStage, number> = {
  new: 10,
  contacted: 25,
  qualified: 40,
  proposal_sent: 60,
  negotiation: 80,
  won: 100,
  lost: 0,
};

export const STAGE_LABELS: Record<LeadStage, string> = {
  new: 'Baru',
  contacted: 'Dihubungi',
  qualified: 'Terkualifikasi',
  proposal_sent: 'Proposal Terkirim',
  negotiation: 'Negosiasi',
  won: 'Menang',
  lost: 'Kalah',
};

export const AUTO_TRANSITIONS: Record<LeadStage, LeadStage[]> = {
  new: ['contacted', 'qualified'],
  contacted: ['qualified'],
  qualified: ['proposal_sent'],
  proposal_sent: ['negotiation'],
  negotiation: ['won', 'lost'],
};

export function isValidTransition(from: LeadStage, to: LeadStage): boolean {
  const allowed = AUTO_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

export function getNextStages(current: LeadStage): LeadStage[] {
  return AUTO_TRANSITIONS[current] ?? [];
}

export function stageToScore(stage: LeadStage): number {
  return STAGE_WEIGHTS[stage] ?? 0;
}