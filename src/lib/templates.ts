/**
 * Quick-message templates for sales outreach (WhatsApp / Email).
 * No sending infrastructure — these build pre-filled wa.me / mailto links the
 * rep clicks to send from their own number / inbox.
 */
import { serviceName } from "@/lib/services";

export interface TemplateVars {
    name?: string | null;
    company?: string | null;
    service?: string | null;
    sender?: string | null;
    locale?: "en" | "id";
}

export interface MessageTemplate {
    templateId: string;
    label: string;
    subjectEn?: string;
    subjectId?: string;
    en: string;
    id: string;
}

export const TEMPLATES: MessageTemplate[] = [
    {
        templateId: "intro",
        label: "Intro",
        subjectEn: "Quick hello from plus.",
        subjectId: "Halo dari plus.",
        en: "Hi {name}, I'm {sender} from plus. (plusthe.site). We help brands like {company} grow with {service}. Could I share a quick overview of how we could help?",
        id: "Halo {name}, saya {sender} dari plus. (plusthe.site). Kami bantu bisnis seperti {company} berkembang lewat {service}. Boleh saya kirimkan gambaran singkat bagaimana kami bisa membantu?",
    },
    {
        templateId: "follow_up",
        label: "Follow-up",
        subjectEn: "Following up — {service}",
        subjectId: "Menindaklanjuti — {service}",
        en: "Hi {name}, just following up on {service} for {company}. Is now a good time for a quick 15-minute call this week?",
        id: "Halo {name}, menindaklanjuti soal {service} untuk {company}. Apakah ada waktu untuk ngobrol singkat 15 menit minggu ini?",
    },
    {
        templateId: "pricing",
        label: "Pricing",
        subjectEn: "{service} — packages & pricing",
        subjectId: "{service} — paket & harga",
        en: "Hi {name}, here's our {service} pricing — flexible monthly plans starting from Rp 2.5jt, in IDR, no hidden fees. Want me to recommend the best fit for {company}?",
        id: "Halo {name}, ini info harga {service} kami — paket bulanan fleksibel mulai Rp 2,5jt, dalam Rupiah, tanpa biaya tersembunyi. Mau saya rekomendasikan paket paling pas untuk {company}?",
    },
    {
        templateId: "proposal",
        label: "Proposal",
        subjectEn: "Proposal for {company} — {service}",
        subjectId: "Proposal untuk {company} — {service}",
        en: "Hi {name}, thank you for your time. I've prepared a {service} proposal tailored for {company}. When can I walk you through it?",
        id: "Halo {name}, terima kasih atas waktunya. Saya sudah siapkan proposal {service} khusus untuk {company}. Kapan saya bisa presentasikan ke Anda?",
    },
];

function fill(text: string, vars: TemplateVars) {
    const locale = vars.locale === "id" ? "id" : "en";
    return text
        .replaceAll("{name}", vars.name?.trim() || (locale === "id" ? "Kak" : "there"))
        .replaceAll("{company}", vars.company?.trim() || (locale === "id" ? "bisnis Anda" : "your business"))
        .replaceAll("{service}", serviceName(vars.service, locale))
        .replaceAll("{sender}", vars.sender?.trim() || "tim plus.");
}

export function renderTemplate(t: MessageTemplate, vars: TemplateVars): { subject: string; body: string } {
    const locale = vars.locale === "id" ? "id" : "en";
    const body = fill(locale === "id" ? t.id : t.en, vars);
    const subjectRaw = locale === "id" ? t.subjectId ?? "" : t.subjectEn ?? "";
    return { subject: fill(subjectRaw, vars), body };
}

