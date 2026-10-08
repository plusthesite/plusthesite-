import {
    CONSULTATION_NEED,
    BUDGET_RANGES,
    BUDGET_LABELS,
} from "@/lib/consultationOptions";
import type { ConsultationNeed, BudgetRange } from "@/lib/consultationOptions";

export type Locale = "id" | "en";

export interface NeedOption {
    value: ConsultationNeed;
    label: string;
}

export interface BudgetOption {
    value: BudgetRange;
    label: string;
}

export interface ConsultationCopy {
    meta: { title: string; description: string };
    hero: {
        eyebrow: string;
        headline: string;
        subtitle: string;
        cta: string;
        trust: string;
    };
    problems: {
        title: string;
        items: { title: string; body: string }[];
    };
    agenda: {
        title: string;
        rows: { time: string; part: string; detail: string }[];
        noPitch: { title: string; body: string };
        pricing: string;
    };
    form: {
        title: string;
        nameLabel: string;
        companyLabel: string;
        companyPlaceholder: string;
        phoneLabel: string;
        phoneHelper: string;
        emailLabel: string;
        emailHelper: string;
        needLabel: string;
        needPlaceholder: string;
        budgetLabel: string;
        budgetPlaceholder: string;
        submit: string;
        microcopy: string;
        trust: string;
        successTitle: string;
        successBody: string;
        errors: {
            required: string;
            email: string;
            rateLimited: string;
            network: string;
            generic: string;
        };
    };
    faq: { question: string; answer: string }[];
    cta: {
        title: string;
        body: string;
        button: string;
        micro: string;
        contactTitle: string;
        email: string;
        instagram: string;
        closing: string;
    };
}

/** Display label per need, per locale. */
const NEED_LABELS: Record<Locale, Record<ConsultationNeed, string>> = {
    id: {
        chatbot: "AI chatbot",
        website: "Website / landing page",
        crm: "CRM & follow-up",
        content: "Konten & sosial media",
        unsure: "Belum yakin, mau konsultasi dulu",
    },
    en: {
        chatbot: "AI chatbot",
        website: "Website / landing page",
        crm: "CRM & follow-up",
        content: "Content & social media",
        unsure: "Not sure yet, want to talk first",
    },
};

/** Display label per budget band, per locale. The `id` column reuses the
 * canonical BUDGET_LABELS so the form text and the CRM `message` stay in sync. */
const BUDGET_LABELS_EN: Record<BudgetRange, string> = {
    "<2.5": "Below Rp 2,500,000/month",
    "2.5-7.5": "Rp 2,500,000–7,500,000/month",
    "7.5-20": "Rp 7,500,000–20,000,000/month",
    ">20": "Above Rp 20,000,000/month",
    none: "No budget yet",
};

const BUDGET_LABELS_BY_LOCALE: Record<Locale, Record<BudgetRange, string>> = {
    id: BUDGET_LABELS,
    en: BUDGET_LABELS_EN,
};

function needOptions(locale: Locale): NeedOption[] {
    return CONSULTATION_NEED.map((value) => ({
        value,
        label: NEED_LABELS[locale][value],
    }));
}

function budgetOptions(locale: Locale): BudgetOption[] {
    return BUDGET_RANGES.map((value) => ({
        value,
        label: BUDGET_LABELS_BY_LOCALE[locale][value],
    }));
}

const ID: ConsultationCopy = {
    meta: {
        title: "Konsultasi Gratis 30 Menit",
        description:
            "Audit singkat, 3 rekomendasi konkret, tanpa pitch. Untuk UMKM yang operasionalnya masih manual. Gratis, online, tanpa kewajiban lanjut.",
    },
    hero: {
        eyebrow: "Gratis · 30 menit · Online",
        headline: "Konsultasi Gratis 30 Menit: Audit Singkat, 3 Rekomendasi Konkret, Tanpa Pitch",
        subtitle:
            "Cocok untuk UMKM dan bisnis yang sudah jalan tapi operasionalnya masih manual. Tidak perlu siapkan apa pun. Cukup bawa cerita soal kondisi bisnis Anda sekarang.",
        cta: "Ambil Slot 30 Menit",
        trust: "Gratis. Tidak ada kewajiban lanjut. Data Anda tidak kami bagikan.",
    },
    problems: {
        title: "Kalau Salah Satu Ini Terjadi, Call 30 Menit Itu Layak Diambil",
        items: [
            {
                title: "Chat masuk tengah malam, besok pagi calon pembeli sudah hilang",
                body: "Pertanyaan soal harga dan stok datang jam 21.00. Admin baru balas jam 09.00. Di antara dua waktu itu, calon pembeli sudah tanya ke tiga toko lain dan mungkin sudah transfer ke salah satunya.",
            },
            {
                title: "Lead tersebar di empat tempat, tidak ada yang tahu statusnya",
                body: "IG DM, WhatsApp, marketplace, dan DM TikTok jalan sendiri-sendiri. Tidak ada satu daftar pun yang menunjukkan siapa sudah di-follow-up dan siapa belum. Waktu staf resign, riwayat percakapan ikut hilang.",
            },
            {
                title: "Semua dikerjakan manual, jadi tidak ada yang sempat mengukur",
                body: "Konten diposting, iklan jalan, chat dibalas satu-satu. Tidak ada angka yang menjawab pertanyaan sederhana: dari mana pelanggan datang, dan berapa biayanya untuk mendapat satu pembeli.",
            },
        ],
    },
    agenda: {
        title: "Isi 30 Menitnya, Per Menit",
        rows: [
            {
                time: "0–8 menit",
                part: "Audit singkat",
                detail: "Kami petakan channel chat Anda, volume pesan, dan alat yang dipakai sekarang",
            },
            {
                time: "8–18 menit",
                part: "3 rekomendasi konkret",
                detail: "Prioritas pengerjaan, alat yang dipakai, estimasi waktu setup",
            },
            {
                time: "18–25 menit",
                part: "Estimasi ROI",
                detail: "Hitung bersama pakai angka Anda: volume lead, ticket size, dan persentase yang tidak ter-follow-up",
            },
            {
                time: "25–30 menit",
                part: "Tanya jawab",
                detail: "Pertanyaan bebas, plus langkah berikutnya kalau Anda mau lanjut",
            },
        ],
        noPitch: {
            title: "Soal “tanpa pitch” — apa artinya",
            body: "Kami tidak akan memaksa Anda memilih paket di akhir call. Kalau dari cerita Anda ternyata yang paling dibutuhkan bukan layanan kami, itu akan kami bilang apa adanya. Anda tetap pulang membawa catatan rekomendasinya.",
        },
        pricing:
            "Kalau nanti Anda memang butuh bantuan lebih lanjut, paket kami mulai dari Rp 2.500.000/bulan (Starter), Rp 7.500.000/bulan (Professional), dan Rp 20.000.000/bulan (Enterprise). Semua harga IDR, sebelum pajak. Kami bahas hanya kalau Anda yang tanya.",
    },
    form: {
        title: "Ambil Slot 30 Menit Anda",
        nameLabel: "Nama Anda",
        companyLabel: "Nama perusahaan / usaha",
        companyPlaceholder: "Contoh: Kopi Ranu Jaya",
        phoneLabel: "WhatsApp",
        phoneHelper: "Kami hubungi lewat WhatsApp untuk konfirmasi jadwal",
        emailLabel: "Email",
        emailHelper: "Konfirmasi jadwal dan ringkasan call dikirim ke email ini",
        needLabel: "Kebutuhan",
        needPlaceholder: "Pilih kebutuhan Anda",
        budgetLabel: "Range budget (Opsional)",
        budgetPlaceholder: "Pilih range budget",
        submit: "Kirim & Pilih Jadwal",
        microcopy: "Kami balas maksimal 1×24 jam kerja, Senin–Jumat, 09.00–18.00 WIB.",
        trust: "Data Anda hanya kami pakai untuk menjadwalkan call ini. Tidak dibagikan ke pihak lain. Tidak ada spam, tidak ada email berantai.",
        successTitle: "Terima kasih. Kami sudah terima permintaan Anda.",
        successBody:
            "Kami akan hubungi Anda lewat email maksimal 1×24 jam kerja (Senin–Jumat, 09.00–18.00 WIB) untuk mengonfirmasi jadwal call.",
        errors: {
            required: "Lengkapi nama, usaha, WhatsApp, email, dan kebutuhan dulu ya.",
            email: "Format email belum benar. Coba periksa lagi.",
            rateLimited: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.",
            network: "Gagal terhubung. Periksa koneksi lalu coba lagi.",
            generic: "Ada yang salah saat mengirim. Coba lagi sebentar lagi.",
        },
    },
    faq: [
        {
            question: "Beneran gratis? Ada biaya tersembunyi?",
            answer:
                "Gratis. Tidak ada biaya, tidak ada kewajiban lanjut. Kami pakai call ini untuk mengenal bisnis Anda. Kalau setelah call Anda merasa butuh layanan kami, itu keputusan Anda, bukan syarat.",
        },
        {
            question: "Saya tidak paham teknis. Nanti saya bingung?",
            answer:
                "Justru itu gunanya. Kami jelaskan pakai bahasa sehari-hari, tanpa istilah teknis. Kalau ada bagian yang belum jelas, tanya saja, kami ulang.",
        },
        {
            question: "Budget saya kecil. Masih relevan?",
            answer:
                "Masih. Paket paling ringan kami mulai dari Rp 2.500.000/bulan, dan di call itu kami bahas mana yang paling masuk akal dengan anggaran Anda, termasuk opsi kerjakan bertahap.",
        },
        {
            question: "Ini cuma pitching jualan, ya?",
            answer:
                "Bukan. 30 menit itu 8 menit audit, 10 menit rekomendasi, 7 menit hitung ROI, dan 5 menit tanya jawab. Kami sebut harga hanya kalau Anda yang tanya. Kalau memang tidak cocok, kami bilang tidak cocok.",
        },
        {
            question: "Saya harus siapkan apa sebelum call?",
            answer:
                "Tidak ada. Kalau ada, cukup siapkan tiga angka kasar: berapa chat/lead masuk per hari, berapa rata-rata nilai satu transaksi, dan siapa yang sekarang membalas chat. Angka kira-kira pun cukup.",
        },
    ],
    cta: {
        title: "Satu Call, Tiga Rekomendasi",
        body: "30 menit. Tidak perlu siapkan apa pun. Kalau setelah call Anda merasa belum waktunya, tidak masalah.",
        button: "Ambil Slot 30 Menit",
        micro: "Gratis · Online · Tanpa pitch",
        contactTitle: "Preferensi kontak lain",
        email: "Lebih enak lewat email dulu? Kirim ke plusthesite@gmail.com.",
        instagram: "Instagram: instagram.com/plusthe.site",
        closing:
            "Call ini dibuat supaya Anda keluar dengan catatan yang bisa langsung dieksekusi, bukan dengan rasa tertarik tapi bingung harus mulai dari mana.",
    },
};

const EN: ConsultationCopy = {
    meta: {
        title: "Free 30-Minute Consultation",
        description:
            "A quick audit, 3 concrete recommendations, no pitch. For businesses still running on manual operations. Free, online, no obligation.",
    },
    hero: {
        eyebrow: "Free · 30 minutes · Online",
        headline: "Free 30-Minute Consultation: A Quick Audit, 3 Concrete Recommendations, No Pitch",
        subtitle:
            "For SMEs and businesses that are already running but still doing operations manually. Nothing to prepare. Just bring the story of where your business stands today.",
        cta: "Grab Your 30-Minute Slot",
        trust: "Free. No obligation to continue. Your data is never shared.",
    },
    problems: {
        title: "If Any of This Happens, That 30-Minute Call Is Worth Taking",
        items: [
            {
                title: "A chat comes in at midnight, and by morning the buyer is gone",
                body: "Price and stock questions arrive at 9 PM. Your admin only replies at 9 AM. In between, the buyer has already asked three other shops and may have paid one of them.",
            },
            {
                title: "Leads are scattered across four places and no one knows their status",
                body: "IG DMs, WhatsApp, marketplaces, and TikTok DMs each run on their own. There's no single list showing who's been followed up and who hasn't. When a staff member resigns, the conversation history disappears with them.",
            },
            {
                title: "Everything is done manually, so no one has time to measure",
                body: "Content gets posted, ads run, chats are answered one by one. No number answers the simple question: where do customers come from, and what does it cost to get one buyer.",
            },
        ],
    },
    agenda: {
        title: "What the 30 Minutes Looks Like, Minute by Minute",
        rows: [
            {
                time: "0–8 min",
                part: "Quick audit",
                detail: "We map your chat channels, message volume, and the tools you use today",
            },
            {
                time: "8–18 min",
                part: "3 concrete recommendations",
                detail: "Work priorities, the tools involved, and estimated setup time",
            },
            {
                time: "18–25 min",
                part: "ROI estimate",
                detail: "We calculate together with your numbers: lead volume, ticket size, and the share that isn't followed up",
            },
            {
                time: "25–30 min",
                part: "Q&A",
                detail: "Open questions, plus next steps if you want to continue",
            },
        ],
        noPitch: {
            title: "About “no pitch” — what it means",
            body: "We won't push you to pick a plan at the end of the call. If it turns out what you need most isn't one of our services, we'll tell you straight. You still leave with your notes and recommendations.",
        },
        pricing:
            "If you later do want more help, our packages start at Rp 2.500.000/month (Starter), Rp 7.500.000/month (Professional), and Rp 20.000.000/month (Enterprise). All prices in IDR, before tax. We only discuss this if you ask.",
    },
    form: {
        title: "Grab Your 30-Minute Slot",
        nameLabel: "Your name",
        companyLabel: "Company / business name",
        companyPlaceholder: "e.g. Kopi Ranu Jaya",
        phoneLabel: "WhatsApp",
        phoneHelper: "We'll reach you on WhatsApp to confirm the schedule",
        emailLabel: "Email",
        emailHelper: "Schedule confirmation and the call summary are sent to this address",
        needLabel: "What do you need",
        needPlaceholder: "Choose what you need",
        budgetLabel: "Budget range (optional)",
        budgetPlaceholder: "Select a budget range",
        submit: "Send & Pick a Slot",
        microcopy: "We reply within 1 business day at most, Mon–Fri, 09.00–18.00 WIB.",
        trust: "Your data is only used to schedule this call. It's not shared with any third party. No spam, no chain email.",
        successTitle: "Thank you. We've received your request.",
        successBody:
            "We'll reach out by email within 1 business day (Mon–Fri, 09.00–18.00 WIB) to confirm your call slot.",
        errors: {
            required: "Please complete your name, business, WhatsApp, email, and need first.",
            email: "That email doesn't look right. Please check it.",
            rateLimited: "Too many attempts. Please try again in a few minutes.",
            network: "Couldn't connect. Check your connection and try again.",
            generic: "Something went wrong while sending. Please try again shortly.",
        },
    },
    faq: [
        {
            question: "Is it really free? Any hidden fees?",
            answer:
                "Free. No fee, no obligation to continue. We use this call to get to know your business. If after the call you feel you need our services, that's your decision, not a condition.",
        },
        {
            question: "I'm not technical. Will I get confused?",
            answer:
                "That's exactly the point. We explain in everyday language, no technical jargon. If anything is unclear, just ask and we'll go over it again.",
        },
        {
            question: "My budget is small. Is this still relevant?",
            answer:
                "Yes. Our lightest package starts at Rp 2.500.000/month, and in the call we'll talk through what makes the most sense for your budget, including doing it in stages.",
        },
        {
            question: "This is just a sales pitch, right?",
            answer:
                "No. The 30 minutes is 8 minutes audit, 10 minutes recommendations, 7 minutes ROI, and 5 minutes Q&A. We only mention pricing if you ask. If it's genuinely not a fit, we'll say it's not a fit.",
        },
        {
            question: "What do I need to prepare before the call?",
            answer:
                "Nothing. If anything, prepare three rough numbers: how many chats/leads come in per day, the average value of one transaction, and who currently replies to chats. Rough numbers are fine.",
        },
    ],
    cta: {
        title: "One Call, Three Recommendations",
        body: "30 minutes. Nothing to prepare. If after the call you feel it's not the right time, that's okay.",
        button: "Grab Your 30-Minute Slot",
        micro: "Free · Online · No pitch",
        contactTitle: "Other ways to reach us",
        email: "Prefer email first? Write to plusthesite@gmail.com.",
        instagram: "Instagram: instagram.com/plusthe.site",
        closing:
            "This call is designed so you leave with notes you can act on right away — not interested but unsure where to start.",
    },
};

const COPY: Record<Locale, ConsultationCopy> = { id: ID, en: EN };

/** Resolve the localized copy plus its pre-built need/budget option lists. */
export function getConsultation(locale: string): ConsultationCopy & {
    needOptions: NeedOption[];
    budgetOptions: BudgetOption[];
} {
    const copy = COPY[locale === "id" ? "id" : "en"];
    return {
        ...copy,
        needOptions: needOptions(locale === "id" ? "id" : "en"),
        budgetOptions: budgetOptions(locale === "id" ? "id" : "en"),
    };
}
