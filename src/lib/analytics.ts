export const track = (event: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', event, params);
};

export const EVENTS = {
  lead_form_start: (source_page: string) => track('lead_form_start', { source_page }),
  lead_form_submit: (service: string, stage: string) => track('lead_form_submit', { service, stage }),
  wa_click: (source_page: string, project_slug?: string) => track('wa_click', { source_page, project_slug }),
  calendly_book: (service: string) => track('calendly_book', { service }),
  proposal_view: (proposal_id: string) => track('proposal_view', { proposal_id }),
  proposal_accept: (proposal_id: string, value: number) => track('proposal_accept', { proposal_id, value }),
  project_view: (project_slug: string, source: string) =>
    track('project_view', { project_slug, source }),
  sample_download: (project_slug: string) =>
    track('sample_download', { project_slug }),
  lead_magnet_download: (magnet_slug: string, source_page: string) =>
    track('lead_magnet_download', { magnet_slug, source_page }),
};