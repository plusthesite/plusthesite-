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
        subjectEn: "A couple of ideas for {company}",
        subjectId: "Beberapa ide untuk {company}",
        // Warm, specific, explains how we found them, low-pressure. Edit the
        // opening line to mention something specific you noticed before sending.
        en: "Hi, this is {sender} from plus. (plusthe.site). I came across {company} on Google and really liked what you're doing. Quick question — for {service}, do you handle that in-house, or still figuring it out? I have a few small ideas that might help. Happy to share briefly, no strings attached.",
        id: "Halo, selamat siang 🙏 Saya {sender} dari plus. (plusthe.site). Saya menemukan {company} lewat Google dan kelihatannya menarik. Izin bertanya — untuk urusan {service}, selama ini ditangani sendiri atau masih dicari solusinya? Kebetulan saya punya beberapa ide kecil yang mungkin berguna. Kalau berkenan, boleh saya share singkat — tanpa kewajiban apa pun.",
    },
    {
        templateId: "follow_up",
        label: "Follow-up",
        subjectEn: "Following up — {service}",
        subjectId: "Lanjut obrolan {service}",
        en: "Hi {company}, just circling back on {service}. No rush at all — if you have 10 minutes this week I'd love to chat, or I can sum it up right here. Whichever's easiest for you?",
        id: "Halo {company} 🙏 mau lanjut obrolan kita soal {service}. Santai saja, tidak buru-buru — kalau ada waktu luang 10 menit minggu ini saya senang ngobrol, atau saya rangkum lewat sini juga boleh. Mana yang lebih nyaman buat Anda?",
    },
    {
        templateId: "pricing",
        label: "Pricing",
        subjectEn: "{service} — a quick overview",
        subjectId: "{service} — gambaran singkat",
        en: "Hi {company}, about {service} — our plans are flexible and transparent (from Rp 2.5jt/month, no lock-in). Honestly though, before talking numbers I'd rather understand your needs first so the recommendation actually fits. Mind sharing a bit about your current setup?",
        id: "Halo {company}, soal {service} — paket kami fleksibel dan transparan (mulai Rp 2,5jt/bln, tanpa kontrak mengikat). Tapi jujur, sebelum bicara angka saya lebih suka paham dulu kebutuhan Anda biar rekomendasinya benar-benar pas. Boleh cerita sedikit kondisi sekarang?",
    },
    {
        templateId: "proposal",
        label: "Proposal",
        subjectEn: "A short {service} summary for {company}",
        subjectId: "Ringkasan {service} untuk {company}",
        en: "Hi {company}, thanks so much for your time earlier. I've put together a short summary and a {service} recommendation tailored to you. Want me to send the file here first, or would a quick 10-minute walkthrough be easier?",
        id: "Halo {company}, terima kasih ya sudah menyempatkan ngobrol 🙏 Saya sudah siapkan ringkasan singkat dan rekomendasi {service} yang disesuaikan dengan kebutuhan Anda. Saya kirim filenya dulu di sini, atau lebih enak saya jelaskan langsung 10 menit?",
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

