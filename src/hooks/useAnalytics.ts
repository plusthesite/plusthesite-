import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent, type EventProps } from "@/lib/analytics";
import { useLocale } from "@/i18n/I18nProvider";

function deviceType(): string {
    if (typeof navigator === "undefined") return "desktop";
    return /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

/** Fire view_consultation when the page mounts. */
export function usePageAnalytics(pagePath: string, pageType: string) {
    const locale = useLocale();
    useEffect(() => {
        trackEvent("view_consultation", {
            page_path: pagePath,
            page_type: pageType,
            language: locale,
            device_type: deviceType(),
        });
    }, [pagePath, pageType, locale]);
}

/** Track form engagement (start/submit) for the consultation funnel. */
export function useFormAnalytics() {
    const locale = useLocale();

    const track = (name: AnalyticsEvent, extra?: EventProps) =>
        trackEvent(name, {
            language: locale,
            device_type: deviceType(),
            ...extra,
        });

    return {
        trackStartForm: () => track("start_form"),
        trackSubmit: () => track("submit_form"),
    };
}
