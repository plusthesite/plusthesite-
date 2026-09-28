import ConsultationHero from "@/components/consultation/ConsultationHero";
import ConsultationProblems from "@/components/consultation/ConsultationProblems";
import ConsultationAgenda from "@/components/consultation/ConsultationAgenda";
import ConsultationForm from "@/components/consultation/ConsultationForm";
import ConsultationWhatsAppFloat from "@/components/consultation/ConsultationWhatsAppFloat";
import ConsultationFaq from "@/components/consultation/ConsultationFaq";
import ConsultationCta from "@/components/consultation/ConsultationCta";

export const metadata = {
    title: "Konsultasi Gratis 30 Menit — plus.",
    description:
        "30 menit ngobrol soal website, chatbot, CRM, atau konten AI. Tanpa janjian langsung, rekomendasi tanpa tekanan.",
    alternates: {
        canonical: "https://www.plusthe.site/id/konsultasi",
        languages: { "id-ID": "/id/konsultasi", "en-US": "/en/consultation" },
    },
};

export default function KonsultasiPage() {
    return (
        <main>
            <ConsultationHero locale="id" />
            <ConsultationProblems locale="id" />
            <ConsultationAgenda locale="id" />
            <section className="bg-slate-50 py-16">
                <div className="mx-auto max-w-2xl px-6 lg:px-8">
                    <ConsultationForm locale="id" />
                </div>
            </section>
            <ConsultationWhatsAppFloat />
            <ConsultationFaq locale="id" />
            <ConsultationCta locale="id" />
        </main>
    );
}
