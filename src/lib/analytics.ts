/**
 * Thin analytics facade.
 *
 * No analytics provider is provisioned yet (@growth owns GA4). Until then:
 *  - dev/staging: no-op, just console.log so we can trace events.
 *  - production: forward to window.gtag (GA4) when present, else no-op.
 *
 * Swap the production branch when the GA4 measurement ID is decided; the call
 * sites stay unchanged.
 */

export type AnalyticsEvent =
    | "view_consultation"
    | "start_form"
    | "submit_form"
    | "lead_form_start"
    | "lead_form_submit";

export interface EventProps {
    page_path?: string;
    page_type?: string;
    language?: string;
    device_type?: string;
    service?: string;
    source?: string;
    [key: string]: unknown;
}

function deviceType(): string {
    if (typeof navigator === "undefined") return "desktop";
    return /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

export function trackEvent(name: AnalyticsEvent, props?: EventProps): void {
    if (typeof window === "undefined") return;

    if (process.env.NODE_ENV !== "production") {
        console.log(`[analytics] ${name}`, props ?? {});
        return;
    }

    const g = (
        window as unknown as {
            gtag?: (cmd: string, name: string, fields?: Record<string, unknown>) => void;
        }
    ).gtag;
    if (typeof g === "function") g("event", name, props ?? {});
}

/** Stable call-site API consumed by pages (e.g. contact-us, consultation). */
export const EVENTS = {
    viewConsultation: (pagePath?: string) =>
        trackEvent("view_consultation", {
            page_path: pagePath,
            page_type: "consultation",
            device_type: deviceType(),
        }),
    startForm: (pagePath?: string) =>
        trackEvent("start_form", { page_path: pagePath, device_type: deviceType() }),
    submitForm: (service?: string, source?: string) =>
        trackEvent("submit_form", { service, source, device_type: deviceType() }),
    /** contact-us page alias — kept separate from the consultation keys. */
    lead_form_start: (pagePath: string) =>
        trackEvent("start_form", { page_path: pagePath, device_type: deviceType() }),
    lead_form_submit: (service?: string, source?: string) =>
        trackEvent("submit_form", { service, source, device_type: deviceType() }),
};
