"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/I18nProvider";

/**
 * Floating WhatsApp button — gated by two flags so a dead link can NEVER be
 * rendered (per @plus decision: block WA button until owner decides on number).
 *   NEXT_PUBLIC_CONSULTATION_WHATSAPP_BUTTON=true AND NEXT_PUBLIC_WA_NUMBER set.
 */
export default function ConsultationWhatsAppFloat() {
    const enabled = process.env.NEXT_PUBLIC_CONSULTATION_WHATSAPP_BUTTON === "true";
    const wa = process.env.NEXT_PUBLIC_WA_NUMBER;
    const locale = useLocale();

    if (!enabled || !wa) return null;

    const label =
        locale === "id"
            ? "Butuh bantuan? Chat kami"
            : "Need help? Chat with us";

    return (
        <Link
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 dark:ring-2 dark:ring-white"
        >
            <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12.04 2C6.5 2 2 6.34 2 11.61c0 2.02.56 3.93 1.59 5.54L1 22l5.09-1.33c1.52.83 3.27 1.29 5.07 1.29 5.54 0 10.04-4.36 10.04-9.82S17.58 2 12.04 2Zm5.72 8.18c-.31-.65-1.82-1.24-2.65-1.24-.77 0-1.32.32-1.56 1.32-.24.99-.14 1.58-.07 1.78.16.48 1.03 1.2 1.28 1.46.25.25.32.42.13.71-.17.29-1.18 2.05-1.52 2.49-.32.4-.57.47-.93.26-.34-.19-1.04-.57-1.26-1.17-.2-.58-.31-.84-.67-1.19-.36-.35-.67-.41-.92-.44-.64-.18-1.09-.33-1.09-.84 0-.54.48-.99 1.05-1.19 1.2-.47 2.32 1.24 2.86 1.6.27.23.61.42.72.54.47.38 1.24.29 1.59.17.35-.13.1.06 0 0"></path>
            </svg>
            <span className="hidden sm:inline">{label}</span>
        </Link>
    );
}
