// Rule-based "trigger phrase" chatbot — no AI key needed. Intent matching +
// guided quick-replies, the pattern most agency/service sites use. Bilingual.

export interface Intent {
    id: string;
    triggers: string[];                       // lowercase keywords (ID + EN)
    reply: { en: string; id: string };
    quick?: { en: string; id: string }[];     // suggested follow-up chips
    cta?: { label: { en: string; id: string }; href: string }; // path w/o locale
}

const Q = {
    services: { en: "What services?", id: "Layanan apa saja?" },
    pricing: { en: "Pricing?", id: "Berapa harganya?" },
    chatbot: { en: "AI Chatbot", id: "Buat chatbot" },
    app: { en: "Mobile app", id: "Buat aplikasi" },
    contact: { en: "Talk to the team", id: "Hubungi tim" },
    process: { en: "How do you work?", id: "Cara kerjanya?" },
    timeline: { en: "How long does it take?", id: "Berapa lama?" },
    whyus: { en: "Why plus.?", id: "Kenapa pilih plus.?" },
};

export const INTENTS: Intent[] = [
    {
        id: "greeting",
        triggers: ["halo", "hai", "hello", "hi ", "hey", "pagi", "siang", "sore", "malam", "assalam", "permisi"],
        reply: {
            id: "Halo! 👋 Senang Anda mampir. Saya bisa bantu soal layanan, harga, atau hubungkan ke tim. Mau mulai dari mana?",
            en: "Hi! 👋 Glad you stopped by. I can help with services, pricing, or connect you to the team. Where shall we start?",
        },
        quick: [Q.services, Q.pricing, Q.contact],
    },
    {
        id: "services",
        triggers: ["layanan", "jasa", "service", "offer", "produk", "product", "apa saja", "what do you", "bisa apa", "kalian", "menyediakan", "tawarkan"],
        reply: {
            id: "plus. itu satu tim untuk semua kebutuhan digital:\n• 💬 AI Chatbot (WhatsApp & web 24/7)\n• 🎨 Digital Agency (branding, konten, web)\n• 📱 Aplikasi & 🎮 Game mobile\n• 🤝 CRM & Customer Support\n• ✨ AI Generator (gambar/teks/video/musik)\nMau dijelaskan yang mana?",
            en: "plus. is one team for everything digital:\n• 💬 AI Chatbot (WhatsApp & web, 24/7)\n• 🎨 Digital Agency (branding, content, web)\n• 📱 Mobile App & 🎮 Game dev\n• 🤝 CRM & Customer Support\n• ✨ AI generators (image/text/video/music)\nWhich one should I explain?",
        },
        quick: [Q.chatbot, Q.app, Q.pricing],
    },
    {
        id: "pricing",
        triggers: ["harga", "biaya", "berapa", "price", "cost", "tarif", "budget", "paket", "mahal", "murah", "bayar berapa", "rate"],
        reply: {
            id: "Harga kami transparan dalam Rupiah, tanpa kontrak mengikat:\n• Starter — mulai Rp 2,5jt/bln (UMKM)\n• Professional — mulai Rp 7,5jt/bln (paling populer)\n• Enterprise — mulai Rp 20jt/bln\nPaket tahunan hemat ~20%, dan ada penawaran khusus berbasis proyek. Mau saya bantu pilih yang pas?",
            en: "Our pricing is transparent, in IDR, no lock-in:\n• Starter — from Rp 2.5jt/mo (small biz)\n• Professional — from Rp 7.5jt/mo (most popular)\n• Enterprise — from Rp 20jt/mo\nAnnual saves ~20%, and we do project-based quotes too. Want help picking the right fit?",
        },
        quick: [Q.services, Q.contact],
    },
    {
        id: "chatbot",
        triggers: ["chatbot", "chat bot", "bot ", "whatsapp bot", "wa bot", "cs otomatis", "balas otomatis", "auto reply", "customer service ai"],
        reply: {
            id: "AI Chatbot kami menjawab pelanggan otomatis 24/7 di WhatsApp & website — tangani FAQ, terima pesanan, dan atur janji temu. Hemat biaya CS, respons instan. Mulai dari Rp 2,5jt/bln.",
            en: "Our AI Chatbot answers customers automatically 24/7 on WhatsApp & web — handles FAQs, takes orders, books appointments. Cuts support costs, instant replies. From Rp 2.5jt/mo.",
        },
        quick: [Q.pricing, Q.contact],
        cta: { label: { en: "See chatbot page", id: "Lihat halaman chatbot" }, href: "/chat-bot" },
    },
    {
        id: "app",
        triggers: ["aplikasi", "mobile app", " app", "android", "ios", "bikin aplikasi", "buat aplikasi", "pengembangan aplikasi"],
        reply: {
            id: "Kami desain, bangun, dan rilis aplikasi mobile cross-platform (iOS & Android) yang benar-benar dipakai pelanggan — dari konsep sampai App Store. Estimasi & penawaran kami kasih setelah ngobrol singkat soal kebutuhan Anda.",
            en: "We design, build, and ship cross-platform mobile apps (iOS & Android) people actually use — concept to App Store. We give an estimate after a short chat about your needs.",
        },
        quick: [Q.process, Q.contact],
        cta: { label: { en: "See app page", id: "Lihat halaman aplikasi" }, href: "/mobile-app" },
    },
    {
        id: "game",
        triggers: ["game", "permainan", "unity", "unreal", "mobile game"],
        reply: {
            id: "Kami bangun game mobile yang seru dimainkan — gameplay menarik, art rapi, performa mulus di iOS & Android. Dari ide sampai rilis.",
            en: "We build mobile games people love — engaging gameplay, polished art, smooth on iOS & Android. From idea to launch.",
        },
        quick: [Q.pricing, Q.contact],
        cta: { label: { en: "See game page", id: "Lihat halaman game" }, href: "/mobile-game" },
    },
    {
        id: "agency",
        triggers: ["branding", "brand", "logo", "desain", "design", "agency", "agensi", "konten", "content", "social media", "sosmed", "marketing", "website", "web ", "landing page", "company profile"],
        reply: {
            id: "Digital Agency kami: strategi, branding, konten, UI/UX, dan web — satu tim biar brand Anda tampil premium dan konsisten di semua channel. Mulai dari Rp 7,5jt/bln atau berbasis proyek.",
            en: "Our Digital Agency: strategy, branding, content, UI/UX, and web — one team so your brand looks premium and stays consistent everywhere. From Rp 7.5jt/mo or project-based.",
        },
        quick: [Q.pricing, Q.contact],
        cta: { label: { en: "See agency page", id: "Lihat halaman agency" }, href: "/digital-agency" },
    },
    {
        id: "crm",
        triggers: ["crm", "kelola pelanggan", "manajemen pelanggan", "data pelanggan", "pipeline", "kelola lead"],
        reply: {
            id: "CRM kami bantu Anda lacak prospek, follow up tepat waktu, dan tutup lebih banyak deal — bertenaga AI, terhubung WhatsApp. Mulai Rp 12jt (setup) — kami sesuaikan dengan alur sales Anda.",
            en: "Our CRM helps you track prospects, follow up on time, and close more deals — AI-powered, WhatsApp-connected. We tailor it to your sales flow.",
        },
        quick: [Q.pricing, Q.contact],
        cta: { label: { en: "See CRM page", id: "Lihat halaman CRM" }, href: "/crm" },
    },
    {
        id: "aitools",
        triggers: ["generator", "ai image", "ai text", "ai video", "ai music", "gambar ai", "konten ai", "buat gambar", "buat video"],
        reply: {
            id: "AI Generator kami: buat gambar, teks, video, dan musik dalam hitungan menit — produksi konten lebih banyak tanpa nambah tim.",
            en: "Our AI generators: create images, copy, video, and music in minutes — produce more content without a bigger team.",
        },
        quick: [Q.services, Q.contact],
    },
    {
        id: "process",
        triggers: ["cara kerja", "proses", "how it works", "how do you work", "gimana caranya", "tahapan", "langkah", "alur", "workflow"],
        reply: {
            id: "Alurnya simpel: 1) Discovery — pahami tujuan Anda · 2) Strategi & Desain · 3) Bangun & Rilis (cepat, teruji) · 4) Tumbuh & Dukungan. Tanpa ribet, transparan di tiap tahap.",
            en: "Simple flow: 1) Discovery — understand your goals · 2) Strategy & Design · 3) Build & Launch (fast, tested) · 4) Grow & Support. No chaos, transparent at every step.",
        },
        quick: [Q.timeline, Q.contact],
    },
    {
        id: "timeline",
        triggers: ["berapa lama", "lama", "durasi", "how long", "kapan selesai", "timeline", "estimasi waktu", "waktu pengerjaan"],
        reply: {
            id: "Tergantung scope. Sebagai gambaran: chatbot/landing biasanya 1–2 minggu, aplikasi 4–8 minggu. Kami kasih estimasi pasti setelah tahu kebutuhan Anda — boleh ngobrol singkat?",
            en: "Depends on scope. Roughly: a chatbot/landing ~1–2 weeks, an app ~4–8 weeks. We give a firm estimate once we know your needs — shall we have a quick chat?",
        },
        quick: [Q.process, Q.contact],
    },
    {
        id: "contact",
        triggers: ["hubungi", "kontak", "contact", "email", "telepon", "nomor", "ngobrol", "konsultasi", "demo", "bicara", "tanya tim", "minta penawaran", "quote", "proposal"],
        reply: {
            id: "Dengan senang hati! 🙏 Email kami di plusthesite@gmail.com, atau isi form kontak — tim kami balas cepat. Boleh juga ketik nama + email/WhatsApp Anda di sini, nanti kami yang hubungi.",
            en: "Happy to help! 🙏 Email us at plusthesite@gmail.com, or fill the contact form — we reply fast. You can also drop your name + email/WhatsApp here and we'll reach out.",
        },
        cta: { label: { en: "Open contact form", id: "Buka form kontak" }, href: "mailto:plusthesite@gmail.com" },
    },
    {
        id: "location",
        triggers: ["lokasi", "di mana", "dimana", "alamat", "kantor", "location", "where are you", "kota", "kota mana"],
        reply: {
            id: "Kami melayani bisnis di seluruh Indonesia — Jakarta, Surabaya, Bandung, Bali, dan kota lain — secara remote, jadi jarak bukan masalah. 🇮🇩",
            en: "We serve businesses across Indonesia — Jakarta, Surabaya, Bandung, Bali, and beyond — remotely, so distance is no problem. 🇮🇩",
        },
        quick: [Q.services, Q.contact],
    },
    {
        id: "payment",
        triggers: ["pembayaran", "cara bayar", "payment", "transfer", "cicil", "termin", "invoice", "dp"],
        reply: {
            id: "Pembayaran fleksibel: retainer bulanan untuk layanan berjalan, atau termin/milestone untuk proyek. Semua dalam Rupiah, transparan, tanpa biaya tersembunyi.",
            en: "Flexible payment: monthly retainer for ongoing services, or milestone-based for projects. All in IDR, transparent, no hidden fees.",
        },
        quick: [Q.pricing, Q.contact],
    },
    {
        id: "portfolio",
        triggers: ["portfolio", "portofolio", "contoh", "example", "hasil kerja", "klien", "client", "pernah bikin", "case study"],
        reply: {
            id: "Setiap proyek kami custom & rahasia klien kami jaga 🙏. Tapi Anda bisa lihat detail tiap layanan di halaman produk kami, dan baca 90+ artikel wawasan di blog. Mau saya arahkan?",
            en: "Each project is custom and we respect client confidentiality 🙏. You can explore each service on our product pages and read 90+ insight articles on the blog. Want me to point you there?",
        },
        quick: [Q.services, Q.contact],
    },
    {
        id: "human",
        triggers: ["manusia", "orang", "admin", "agent", "bicara dengan orang", "real person", "sales", "tim", "cs"],
        reply: {
            id: "Tentu — tim kami (manusia asli 🙂) siap bantu. Tinggalkan nama + email/WhatsApp di sini, atau buka form kontak, nanti langsung kami follow up.",
            en: "Of course — our (very human 🙂) team is ready. Leave your name + email/WhatsApp here, or open the contact form, and we'll follow up.",
        },
        cta: { label: { en: "Open contact form", id: "Buka form kontak" }, href: "mailto:plusthesite@gmail.com" },
    },
    {
        id: "thanks",
        triggers: ["makasih", "terima kasih", "thanks", "thank you", "thx", "tengkyu", "noted", "appreciate"],
        reply: {
            id: "Sama-sama! 🙏 Kalau ada yang mau ditanyakan lagi soal layanan atau harga, saya di sini. Semoga harimu lancar!",
            en: "You're welcome! 🙏 If anything else comes up about services or pricing, I'm here. Have a great day!",
        },
        quick: [Q.services, Q.pricing],
    },
    {
        id: "about",
        triggers: ["siapa kamu", "kamu siapa", "who are you", "plus itu apa", "apa itu plus", "tentang plus", "about you", "about plus", "kalian siapa", "perusahaan apa", "kamu bot"],
        reply: {
            id: "plus. adalah digital AI-agency: satu tim yang memadukan AI dengan kreator manusia untuk bantu bisnis Indonesia berkembang — dari chatbot, aplikasi, branding, sampai CRM. Saya asistennya, siap bantu Anda. 🙂",
            en: "plus. is a digital AI-agency: one team blending AI with real creatives to help Indonesian businesses grow — from chatbots and apps to branding and CRM. I'm its assistant, here to help. 🙂",
        },
        quick: [Q.services, Q.whyus, Q.contact],
    },
    {
        id: "whyus",
        triggers: ["kenapa pilih", "kenapa harus", "why choose", "why you", "kelebihan", "keunggulan", "beda", "dibanding", "vs", "kompetitor", "bedanya apa", "alasan"],
        reply: {
            id: "Kenapa plus.? 1) Satu tim untuk semua (strategi + kreatif + teknologi) — nggak perlu ganti-ganti vendor. 2) AI + manusia asli, jadi cepat tapi tetap berkualitas. 3) Harga IDR terjangkau & transparan. 4) Bilingual ID/EN. 5) Fokus hasil, bukan sekadar tampil.",
            en: "Why plus.? 1) One team for everything (strategy + creative + tech) — no juggling vendors. 2) AI + real humans, so it's fast but quality. 3) Affordable, transparent IDR pricing. 4) Bilingual ID/EN. 5) Outcome-focused, not just pretty.",
        },
        quick: [Q.pricing, Q.contact],
    },
    {
        id: "consultation",
        triggers: ["konsultasi", "consult", "ngobrol dulu", "tanya dulu", "gratis konsultasi", "free consult", "diskusi", "meeting", "ketemu", "zoom", "call"],
        reply: {
            id: "Konsultasi awal kami gratis, tanpa kewajiban. 🙏 Ceritakan kebutuhan Anda, kami kasih ide & estimasi. Tinggalkan nama + email/WhatsApp di sini, atau buka form kontak — kami atur jadwalnya.",
            en: "Our initial consultation is free, no obligation. 🙏 Tell us your needs and we'll share ideas + an estimate. Drop your name + email/WhatsApp here, or open the contact form and we'll schedule it.",
        },
        cta: { label: { en: "Open contact form", id: "Buka form kontak" }, href: "mailto:plusthesite@gmail.com" },
    },
    {
        id: "discount",
        triggers: ["diskon", "discount", "promo", "potongan", "nego", "kurang", "deal", "penawaran khusus", "bisa kurang"],
        reply: {
            id: "Kami jaga harga tetap jujur 🙂. Paket tahunan otomatis hemat ~20%, dan untuk proyek kami kasih penawaran khusus sesuai scope. Ceritakan kebutuhan & budget Anda, nanti kami carikan opsi yang pas.",
            en: "We keep pricing honest 🙂. Annual plans already save ~20%, and for projects we tailor a quote to scope. Share your needs & budget and we'll find an option that fits.",
        },
        quick: [Q.pricing, Q.contact],
    },
    {
        id: "guarantee",
        triggers: ["garansi", "guarantee", "revisi", "revision", "jaminan", "kalau nggak puas", "refund", "uang kembali", "warranty", "gagal"],
        reply: {
            id: "Kami kerja iteratif dengan revisi terjadwal di tiap tahap, jadi hasilnya sesuai harapan sebelum lanjut. Lingkup revisi kami sepakati di awal biar jelas & adil buat kedua pihak.",
            en: "We work iteratively with scheduled revisions at each stage, so it matches your expectations before we move on. We agree the revision scope upfront so it's clear and fair.",
        },
        quick: [Q.process, Q.contact],
    },
    {
        id: "contract",
        triggers: ["kontrak", "contract", "lock in", "lock-in", "terikat", "ikatan", "minimal berlangganan", "komitmen", "putus kapan"],
        reply: {
            id: "Tanpa kontrak mengikat untuk layanan bulanan — bisa berhenti kapan saja. Untuk proyek, kesepakatannya berbasis milestone yang jelas. Fleksibel & transparan.",
            en: "No lock-in for monthly services — cancel anytime. For projects, the agreement is milestone-based and clear. Flexible and transparent.",
        },
        quick: [Q.pricing, Q.contact],
    },
    {
        id: "maintenance",
        triggers: ["maintenance", "perawatan", "support setelah", "after launch", "setelah jadi", "update", "pemeliharaan", "garansi bug", "fixing"],
        reply: {
            id: "Kami nggak lepas tangan setelah rilis. Ada paket dukungan & pemeliharaan berkelanjutan — pantau, perbaiki, dan terus tingkatkan. Mau saya jelaskan opsinya?",
            en: "We don't disappear after launch. We offer ongoing support & maintenance — monitor, fix, and keep improving. Want me to explain the options?",
        },
        quick: [Q.pricing, Q.contact],
    },
    {
        id: "seo",
        triggers: ["seo", "ranking google", "masuk halaman 1", "page 1", "search engine", "mesin pencari", "google search", "trafik", "traffic organik", "kata kunci"],
        reply: {
            id: "Ya, SEO bagian dari Digital Agency kami — teknis (struktur, kecepatan, schema), konten, dan optimasi lokal Indonesia biar bisnis Anda lebih gampang ditemukan di Google & AI search. Mau dibantu audit singkat?",
            en: "Yes — SEO is part of our Digital Agency: technical (structure, speed, schema), content, and Indonesia-local optimization so you're easier to find on Google & AI search. Want a quick audit?",
        },
        quick: [Q.contact, Q.pricing],
    },
    {
        id: "ads",
        triggers: ["iklan", "ads", "google ads", "facebook ads", "meta ads", "fb ads", "instagram ads", "tiktok ads", "beriklan", "paid ads", "ppc", "adwords"],
        reply: {
            id: "Bisa — kami bantu kelola iklan berbayar (Google, Meta/Instagram, TikTok) yang efektif sesuai budget, plus landing page yang konversinya tinggi. Targetnya bukan sekadar klik, tapi leads/penjualan nyata.",
            en: "Yes — we manage paid ads (Google, Meta/Instagram, TikTok) that work within your budget, plus high-converting landing pages. The goal isn't just clicks, but real leads/sales.",
        },
        quick: [Q.pricing, Q.contact],
    },
    {
        id: "ecommerce",
        triggers: ["toko online", "ecommerce", "e-commerce", "jualan online", "online shop", "marketplace", "olshop", "katalog produk", "keranjang", "checkout"],
        reply: {
            id: "Bisa banget — kami bangun toko online / aplikasi jualan dengan katalog, keranjang, pembayaran, dan integrasi WhatsApp/CRM biar pesanan & pelanggan terkelola rapi. Mau lewat web atau aplikasi?",
            en: "Absolutely — we build online stores / commerce apps with catalog, cart, payments, and WhatsApp/CRM integration so orders & customers stay organized. Prefer web or app?",
        },
        quick: [Q.app, Q.contact],
    },
    {
        id: "security",
        triggers: ["keamanan", "aman", "security", "data aman", "privacy", "privasi", "kerahasiaan", "gdpr", "uu pdp", "bocor", "enkripsi"],
        reply: {
            id: "Keamanan & privasi kami utamakan — data dienkripsi, akses dibatasi sesuai peran, dan kami patuhi praktik perlindungan data (termasuk UU PDP Indonesia). Data klien tidak kami bagikan.",
            en: "Security & privacy are a priority — encrypted data, role-based access, and we follow data-protection best practices (incl. Indonesia's PDP law). Client data is never shared.",
        },
        quick: [Q.services, Q.contact],
    },
    {
        id: "language",
        triggers: ["bahasa", "english", "inggris", "language", "multi bahasa", "bilingual", "bisa inggris", "in english"],
        reply: {
            id: "Kami bekerja dalam Bahasa Indonesia & English — termasuk membuat website/konten dwibahasa. Anda nyaman pakai bahasa apa, kami ikuti. 🙂",
            en: "We work in both Bahasa Indonesia & English — including bilingual websites/content. Whichever you prefer, we'll follow. 🙂",
        },
        quick: [Q.services, Q.contact],
    },
    {
        id: "umkm",
        triggers: ["umkm", "ukm", "usaha kecil", "bisnis kecil", "startup", "baru mulai", "modal kecil", "budget terbatas", "pemula", "small business"],
        reply: {
            id: "Pas banget — banyak klien kami UMKM & startup. Paket Starter mulai Rp 2,5jt/bln dirancang untuk yang baru mulai: 1 layanan pilihan, setup chatbot/landing, konten bulanan. Tumbuh dulu, scale belakangan.",
            en: "Perfect — many of our clients are small businesses & startups. The Starter plan from Rp 2.5jt/mo is built for getting going: 1 service, chatbot/landing setup, monthly content. Start small, scale later.",
        },
        quick: [Q.pricing, Q.contact],
    },
    {
        id: "affirm",
        triggers: ["iya", "yes", "boleh", "mau", "oke", "sip ", "lanjut", "tertarik", "minat", "setuju", "betul", "bener"],
        reply: {
            id: "Mantap! 🙌 Biar saya bantu lebih tepat — boleh tahu Anda tertarik di layanan apa, atau langsung tinggalkan nama + email/WhatsApp supaya tim kami yang hubungi?",
            en: "Great! 🙌 So I can help precisely — which service are you interested in, or just leave your name + email/WhatsApp and our team will reach out?",
        },
        quick: [Q.services, Q.pricing, Q.contact],
    },
    {
        id: "goodbye",
        triggers: ["bye", "dadah", "sampai jumpa", "udahan", "cukup", "sudah cukup", "see you", "nanti aja", "besok aja", "tutup"],
        reply: {
            id: "Baik, terima kasih sudah mampir! 🙏 Kapan pun butuh, saya & tim plus. siap membantu. Sehat & sukses selalu untuk bisnis Anda! 🚀",
            en: "Alright, thanks for stopping by! 🙏 Whenever you need us, plus. is here to help. Wishing you & your business all the best! 🚀",
        },
    },
];

export const INITIAL_QUICK = [Q.services, Q.pricing, Q.chatbot, Q.contact];

const FALLBACK: Intent["reply"] = {
    id: "Maaf, saya belum paham 🙏. Saya bisa bantu soal layanan, harga, cara kerja, atau hubungkan ke tim. Coba pilih di bawah, atau ketik nama + email/WhatsApp Anda untuk dihubungi.",
    en: "Sorry, I didn't quite get that 🙏. I can help with services, pricing, how we work, or connect you to the team. Pick below, or drop your name + email/WhatsApp to be contacted.",
};

/** Match the best intent by counting trigger hits in the normalized text. */
export function matchIntent(text: string): Intent | null {
    const t = ` ${text.toLowerCase().replace(/[^\p{L}\p{N}\s@.]/gu, " ")} `;
    let best: Intent | null = null;
    let bestScore = 0;
    for (const intent of INTENTS) {
        let score = 0;
        for (const trig of intent.triggers) if (t.includes(trig)) score += trig.length; // longer match = stronger
        if (score > bestScore) { bestScore = score; best = intent; }
    }
    return bestScore > 0 ? best : null;
}

export function fallbackReply(locale: "en" | "id") { return FALLBACK[locale]; }
export const detectEmail = (s: string) => s.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0] ?? null;
export const detectPhone = (s: string) => s.match(/(?:\+?62|0)8[0-9]{7,12}/)?.[0] ?? null;
