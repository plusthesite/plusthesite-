import { ReactNode } from "react";

/**
 * Social proof section for the consultation landing.
 *
 * Gated by NEXT_PUBLIC_CONSISTATION_SOCIAL_PROOF — defaults to hidden until
 * real testimonials / logos are approved by the owner. When hidden, renders
 * nothing (not even a placeholder) so there is no "coming soon" gap.
 */
interface Props {
    children?: ReactNode;
}

export default function ConsultationSocialProof({ children }: Props) {
    const enabled = process.env.NEXT_PUBLIC_CONSULTATION_SOCIAL_PROOF === "true";
    if (!enabled || !children) return null;
    return (
        <section className="bg-white py-16 text-slate-950 dark:bg-[#0B1120] dark:text-white">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">{children}</div>
        </section>
    );
}
