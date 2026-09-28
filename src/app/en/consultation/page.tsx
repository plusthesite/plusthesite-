import ConsultationHero from "@/components/consultation/ConsultationHero";
import ConsultationProblems from "@/components/consultation/ConsultationProblems";
import ConsultationAgenda from "@/components/consultation/ConsultationAgenda";
import ConsultationForm from "@/components/consultation/ConsultationForm";
import ConsultationWhatsAppFloat from "@/components/consultation/ConsultationWhatsAppFloat";
import ConsultationFaq from "@/components/consultation/ConsultationFaq";
import ConsultationCta from "@/components/consultation/ConsultationCta";

export const metadata = {
    title: "Free 30-Minute Consultation — plus.",
    description:
        "30 minutes to talk website, chatbot, CRM, or AI-powered content. No hard sell, just a no-pressure recommendation.",
    alternates: {
        canonical: "https://www.plusthe.site/en/consultation",
        languages: { "en-US": "/en/consultation", "id-ID": "/id/konsultasi" },
    },
};

export default function ConsultationPage() {
    return (
        <main>
            <ConsultationHero locale="en" />
            <ConsultationProblems locale="en" />
            <ConsultationAgenda locale="en" />
            <section className="bg-slate-50 py-16">
                <div className="mx-auto max-w-2xl px-6 lg:px-8">
                    <ConsultationForm locale="en" />
                </div>
            </section>
            <ConsultationWhatsAppFloat />
            <ConsultationFaq locale="en" />
            <ConsultationCta locale="en" />
        </main>
    );
}
