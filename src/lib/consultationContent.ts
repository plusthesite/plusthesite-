/**
 * Copy + content for the free consultation landing page.
 *
 * Drafted from @growth's markdown (2026-09-28-landing-konsultasi-gratis.md).
 * @growth can edit text here without touching component code.
 *
 * Bilingual: keyed by locale. EN entries are rough machine-assisted drafts
 * marked for human review — swap when translation lands.
 *
 * Prices use approved IDR (Rp) values, consistent with the homepage.
 */

export interface ConsultationContent {
    hero: {
        eyebrow: string;
        headline: string;
        subhead: string;
        trust: string;
        cta: string;
    };
    problems: {
        title: string;
        intro: string;
        items: ReadonlyArray<{ id: string; title: string; body: string }>;
    };
    agenda: {
        title: string;
        intro: string;
        items: ReadonlyArray<{ step: number; title: string; desc: string }>;
    };
    form: {
        title: string;
        subtitle: string;
        fields: {
            name: { label: string; placeholder: string };
            company: { label: string; placeholder: string };
            phone: { label: string; placeholder: string; prefix: string };
            email: { label: string; placeholder: string };
            need: { label: string; placeholder: string };
            budget: { label: string; placeholder: string };
            message: { label: string; placeholder: string };
        };
        needOptions: ReadonlyArray<{ value: string; label: string }>;
        budgetOptions: ReadonlyArray<{ value: string; label: string }>;
        submit: string;
        hint: string;
        success: {
            title: string;
            body: string;
        };
    };
    cta: {
        headline: string;
        sub: string;
        cta: string;
    };
    faq: {
        title: string;
        items: ReadonlyArray<{ q: string; a: string }>;
    };
}

export const consultationContent: Record<"id" | "en", ConsultationContent> = {
    id: {
        hero: {
            eyebrow: "Konsultasi Gratis 30 Menit",
            headline: "Kami datang, buatkan strategi. Anda tinggal datang.",
            subhead:
                "30 menit ngobrol tentang kebutuhan website, chatbot, CRM, atau konten AI. Tanpa janjian langsung — kami bantu pahami kondisi Anda dulu, lalu rekomendasikan solusi yang pas.",
            trust: "Bisa dipercaya. Tanpa spam. Balasan maksimal 1×24 jam kerja.",
            cta: "Jadwalkan Konsultasi Gratis",
        },
        problems: {
            title: "Kami ngerti kapas yang bikin kebingungan.",
            intro: "UMKM di Indonesia kebanyakan nongkrong di tempat yang salah, karena toolnya berisikilo, jualannya kebanyakan, atau timnya nggak nyambung.",
            items: [
                {
                    id: "chaos",
                    title: "Tool-aplikasi berhamburan",
                    body: "Chat, email, telepon, wa, semuanya tersebar. Customer repot, tim bingung mana dulu.",
                },
                {
                    id: "leak",
                    title: "Lead bocor sebelum nyentuh sales",
                    body: "Form terisi, tapi nggak ada follow-up. Wasted traffic, wasted budget iklan.",
                },
                {
                    id: "overpay",
                    title: "Bayar mahal, hasil minim",
                    body: "Bayar paket mahal, tapi ROI-nya tidak kelihatan. ROI-nya ngumpet, atau aslinya tidak ada.",
                },
            ],
        },
        agenda: {
            title: "Apa yang terjadi selama konsultasi?",
            intro: "Tiga langkah. Tiga puluh menit. Tanpa bahan presentasi berat.",
            items: [
                {
                    step: 1,
                    title: "Kenali keadaan",
                    desc: "Kami tanya, Anda jawab. Kami catat di mana sekarang, dan di mana ingin sampai.",
                },
                {
                    step: 2,
                    title: "Temukan celah",
                    desc: "Kami tunjuk 1-3 peluang yang paling berdampak, dengan perkiraan investasi.",
                },
                {
                    step: 3,
                    title: "Sama-sama keputusan",
                    desc: "Kami kasih rekomendasi tanpa tekanan. Anda putuskan laju, kami siap bantu lanjut.",
                },
            ],
        },
        form: {
            title: "Isi cepat, kami yang lanjutkan.",
            subtitle: "Butuh Anda siapkan: nama, usaha, WhatsApp, email, kebutuhan, dan budget. Semua field wajib kecuali budget.",
            fields: {
                name: { label: "Nama lengkap", placeholder: "contoh: Rachdian" },
                company: { label: "Nama usaha", placeholder: "contoh: Kopi Rakyat" },
                phone: { label: "WhatsApp", placeholder: "contoh: 812-3456-7890", prefix: "+62" },
                email: { label: "Email", placeholder: "contoh: kamu@email.com" },
                need: { label: "Kebutuhan utama", placeholder: "Pilih kebutuhan" },
                budget: { label: "Budget perkiraan", placeholder: "Pilih rentang budget" },
                message: { label: "Catatan tambahan", placeholder: "Apa yang ingin kami tahu selain di atas?" },
            },
            needOptions: [
                { value: "chatbot", label: "AI Chat Bot" },
                { value: "website", label: "Website" },
                { value: "crm", label: "CRM Platform" },
                { value: "content", label: "Konten & Strategi" },
                { value: "other", label: "Lainnya" },
                { value: "unsure", label: "Belum yakin" },
            ],
            budgetOptions: [
                { value: "<2.5", label: "< Rp 2.500.000" },
                { value: "2.5-7.5", label: "Rp 2.500.000 – Rp 7.500.000" },
                { value: "7.5-20", label: "Rp 7.500.000 – Rp 20.000.000" },
                { value: ">20", label: "> Rp 20.000.000" },
                { value: "none", label: "Belum yakin" },
            ],
            submit: "Kirim & Dapatkan Konfirmasi",
            hint: "Kami balas maksimal 1×24 jam kerja, Senin–Jumat, 09.00–18.00 WIB.",
            success: {
                title: "Permintaan diterima.",
                body: "Kami sudah terima permintaan Anda. Kami akan hubungi di WhatsApp/email dalam 1×24 jam kerja, Senin–Jumat 09.00–18.00 WIB.",
            },
        },
        cta: {
            headline: "Masih ada yang belum jelaskan?",
            sub: "Kirim langsung ke tim kami di timespace@plus.com.",
            cta: "Email kami",
        },
        faq: {
            title: "Pertanyaan yang sering diajukan",
            items: [
                {
                    q: "Berapa lama konsultasinya?",
                    a: "30 menit, via WhatsApp Voice / Google Meet. Kami pilih yang nyaman untuk Anda.",
                },
                {
                    q: "Harus bayar apa sesuatu?",
                    a: "Tidak. Konsultasi gratis 100%. Kalau cocok, kami kasih harga dan proposal selanjutnya — tanpa tekanan.",
                },
                {
                    q: "Mulai dari berapa harga layanannya?",
                    a:
                        "Solusi AI Chat Bot dari Rp 2.500.000/bulan; Website dari Rp 7.500.000; CRM dari Rp 20.000.000. Harga pasti sesuai kebutuhan Anda.",
                },
                {
                    q: "Saya belum punya budget. Boleh?",
                    a: "Boleh. Kami akan bantu prioritaskan langkah yang paling efisien dulu, yang bisa dijalankan dengan budget kecil.",
                },
            ],
        },
    },
    en: {
        hero: {
            eyebrow: "Free 30-Minute Consultation",
            headline: "We show up, build a strategy. You just show up.",
            subhead:
                "30 minutes to talk website, chatbot, CRM, or AI-powered content. No hard sell — we'll learn your situation first, then recommend what fits.",
            trust: "Reliable. No spam. Reply within one business day, max.",
            cta: "Book Free Consultation",
        },
        problems: {
            title: "We get the pain points that cause the confusion.",
            intro: "Most Indonesian SMEs get stuck on the wrong things — tools that fight each other, leads that slip, or paying for complexity that doesn't return.",
            items: [
                {
                    id: "chaos",
                    title: "Tools scattered everywhere",
                    body: "Chat, email, phone, WA — spread across channels. Support reps strain, teams lose context.",
                },
                {
                    id: "leak",
                    title: "Leads leak before sales touch them",
                    body: "Form is filled but there's no follow-up. Wasted traffic, wasted ad budget.",
                },
                {
                    id: "overpay",
                    title: "Pay a lot, get little",
                    body: "You paid for a complex stack but ROI is invisible — it's hidden, or simply not there.",
                },
            ],
        },
        agenda: {
            title: "What happens during the consultation?",
            intro: "Three steps. Thirty minutes. No heavy slides.",
            items: [
                {
                    step: 1,
                    title: "Learn your situation",
                    desc: "We ask, you answer. We take stock of where you are and where you want to go.",
                },
                {
                    step: 2,
                    title: "Identify the opportunity",
                    desc: "We point to 1–3 high-impact opportunities with a rough investment estimate.",
                },
                {
                    step: 3,
                    title: "Decide together",
                    desc: "We give a no-pressure recommendation. You decide the pace; we stand ready to execute.",
                },
            ],
        },
        form: {
            title: "Quick fill, we handle the rest.",
            subtitle: "You'll need: name, company, WhatsApp, email, need, and budget. All required except budget.",
            fields: {
                name: { label: "Full name", placeholder: "e.g. Rachdian" },
                company: { label: "Company name", placeholder: "e.g. Kopi Rakyat" },
                phone: { label: "WhatsApp", placeholder: "e.g. 812-3456-7890", prefix: "+62" },
                email: { label: "Email", placeholder: "e.g. kamu@email.com" },
                need: { label: "Primary need", placeholder: "Select a need" },
                budget: { label: "Budget range", placeholder: "Select a budget range" },
                message: { label: "Additional notes", placeholder: "Anything else we should know?" },
            },
            needOptions: [
                { value: "chatbot", label: "AI Chat Bot" },
                { value: "website", label: "Website" },
                { value: "crm", label: "CRM Platform" },
                { value: "content", label: "Content & Strategy" },
                { value: "other", label: "Other" },
                { value: "unsure", label: "Not sure yet" },
            ],
            budgetOptions: [
                { value: "<2.5", label: "< Rp 2.500.000" },
                { value: "2.5-7.5", label: "Rp 2.500.000 – Rp 7.500.000" },
                { value: "7.5-20", label: "Rp 7.500.000 – Rp 20.000.000" },
                { value: ">20", label: "> Rp 20.000.000" },
                { value: "none", label: "Not sure yet" },
            ],
            submit: "Send & Get Confirmation",
            hint: "We reply within one business day, Mon–Fri, 09:00–18:00 WIB.",
            success: {
                title: "Request received.",
                body: "We've received your request. We'll contact you via WhatsApp/email within one business day, Mon–Fri 09:00–18:00 WIB.",
            },
        },
        cta: {
            headline: "Still have something to ask?",
            sub: "Drop us a line directly at timespace@plus.com.",
            cta: "Email us",
        },
        faq: {
            title: "Frequently asked questions",
            items: [
                {
                    q: "How long is the consultation?",
                    a: "30 minutes, via WhatsApp Voice or Google Meet. We pick what's comfortable for you.",
                },
                {
                    q: "Do I have to pay for anything?",
                    a: "No. It's a 100% free consultation. If it's a fit, we'll share pricing and the next steps — no pressure.",
                },
                {
                    q: "What's the starting price of your services?",
                    a:
                        "AI Chat Bot from Rp 2.500.000/month; Website from Rp 7.500.000; CRM from Rp 20.000.000. Final pricing is tailored to your need.",
                },
                {
                    q: "What if I don't have a budget yet?",
                    a: "That's fine. We'll help you prioritize the highest-leverage step you can run on a small budget first.",
                },
            ],
        },
    },
} as const;

export default consultationContent;
