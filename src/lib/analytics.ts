/**
 * Thin analytics facade.
 *
 * No analytics provider is provisioned yet (@growth owns GA4). Until then:
 *  - dev/staging: no-op, just console.log so we can trace events.
 *  - production: forward to window.gtag (GA4) when present, else no-op.
 *
 * Swap the production branch when the GA4 measurement ID is decided; the call
 * sites (trackEvent("submit_form", ...)) stay unchanged.
 */

export type AnalyticsEvent = "view_consultation" | "start_form" | "submit_form";

export interface EventProps {
    page_path?: string;
    page_type?: string;
    language?: string;
    device_type?: string;
    [key: string]: unknown;
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
