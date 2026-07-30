// Rule-based trigger phrase chatbot.
// Bilingual quick replies and stable intent matching, no external AI key needed.

export interface Intent {
  id: string;
  triggers: string[];
  reply: { en: string; id: string };
  quick?: { en: string; id: string }[];
  cta?: { label: { en: string; id: string }; href: string };
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
    triggers: [
      "halo",
      "hai",
      "hello",
      "hi ",
      "hey",
      "pagi",
      "siang",
      "sore",
      "malam",
      "assalam",
      "permisi",
    ],
    reply: {
      id: "Halo. Senang Anda mampir. Saya bisa bantu soal layanan, harga, atau menghubungkan Anda ke tim. Mau mulai dari mana?",
      en: "Hi. Glad you stopped by. I can help with services, pricing, or connect you to the team. Where shall we start?",
    },
    quick: [Q.services, Q.pricing, Q.contact],
  },
  {
    id: "services",
    triggers: [
      "layanan",
      "jasa",
      "service",
      "offer",
      "produk",
      "product",
      "apa saja",
      "what do you",
      "bisa apa",
      "kalian",
      "menyediakan",
      "tawarkan",
    ],
    reply: {
      id: "plus. adalah satu tim untuk kebutuhan digital: AI Chatbot, Digital Agency, aplikasi mobile, game mobile, CRM, customer support, dan AI generator. Mau saya jelaskan yang mana dulu?",
      en: "plus. is one team for digital work: AI Chatbot, Digital Agency, mobile apps, mobile games, CRM, customer support, and AI generators. Which one should I explain first?",
    },
    quick: [Q.chatbot, Q.app, Q.pricing],
  },
  {
    id: "pricing",
    triggers: [
      "harga",
      "biaya",
      "berapa",
      "price",
      "cost",
      "tarif",
      "budget",
      "paket",
      "mahal",
      "murah",
      "bayar berapa",
      "rate",
    ],
    reply: {
      id: "Harga kami transparan dalam Rupiah, tanpa kontrak mengikat: Starter mulai Rp 2,5 juta per bulan, Professional mulai Rp 7,5 juta per bulan, dan Enterprise mulai Rp 20 juta per bulan. Paket tahunan lebih hemat sekitar 20 persen, dan kami juga bisa buat penawaran berbasis proyek.",
      en: "Our pricing is transparent in IDR, with no lock-in: Starter starts from Rp 2.5 million per month, Professional from Rp 7.5 million per month, and Enterprise from Rp 20 million per month. Annual plans save around 20 percent, and we also handle project-based quotes.",
    },
    quick: [Q.services, Q.contact],
  },
  {
    id: "chatbot",
    triggers: [
      "chatbot",
      "chat bot",
      "bot ",
      "whatsapp bot",
      "wa bot",
      "cs otomatis",
      "balas otomatis",
      "auto reply",
      "customer service ai",
    ],
    reply: {
      id: "AI Chatbot kami membantu menjawab pelanggan 24 jam di WhatsApp dan website, menangani FAQ, menangkap lead, menerima pesanan, dan mengatur janji temu. Cocok untuk tim yang butuh respons cepat tanpa menambah beban manual.",
      en: "Our AI Chatbot helps answer customers 24/7 on WhatsApp and the web, handling FAQs, capturing leads, taking orders, and booking appointments. It fits teams that need fast replies without adding manual load.",
    },
    quick: [Q.pricing, Q.contact],
    cta: {
      label: { en: "See chatbot page", id: "Lihat halaman chatbot" },
      href: "/chat-bot",
    },
  },
  {
    id: "app",
    triggers: [
      "aplikasi",
      "mobile app",
      " app",
      "android",
      "ios",
      "bikin aplikasi",
      "buat aplikasi",
      "pengembangan aplikasi",
    ],
    reply: {
      id: "Kami mendesain, membangun, dan merilis aplikasi mobile lintas platform untuk iOS dan Android, dari konsep sampai siap diluncurkan. Estimasi dan penawaran kami sesuaikan setelah ngobrol singkat soal kebutuhan Anda.",
      en: "We design, build, and ship cross-platform mobile apps for iOS and Android, from concept to launch-ready delivery. We shape the estimate after a short conversation about your needs.",
    },
    quick: [Q.process, Q.contact],
    cta: {
      label: { en: "See app page", id: "Lihat halaman aplikasi" },
      href: "/mobile-app",
    },
  },
  {
    id: "game",
    triggers: ["game", "permainan", "unity", "unreal", "mobile game"],
    reply: {
      id: "Kami membangun game mobile dengan gameplay yang rapi, art yang matang, dan performa yang stabil di iOS maupun Android. Prosesnya bisa dimulai dari ide, prototipe, hingga rilis.",
      en: "We build mobile games with polished gameplay, thoughtful art direction, and stable performance on both iOS and Android. The process can start from concept, prototype, and continue through launch.",
    },
    quick: [Q.pricing, Q.contact],
    cta: {
      label: { en: "See game page", id: "Lihat halaman game" },
      href: "/mobile-game",
    },
  },
  {
    id: "agency",
    triggers: [
      "branding",
      "brand",
      "logo",
      "desain",
      "design",
      "agency",
      "agensi",
      "konten",
      "content",
      "social media",
      "sosmed",
      "marketing",
      "website",
      "web ",
      "landing page",
      "company profile",
    ],
    reply: {
      id: "Digital Agency kami menggabungkan strategi, branding, konten, UI atau UX, dan web dalam satu ritme kerja. Tujuannya agar brand Anda tampil lebih premium, konsisten, dan siap tumbuh di berbagai channel.",
      en: "Our Digital Agency combines strategy, branding, content, UI or UX, and web delivery inside one working rhythm. The goal is to help your brand look more premium, more consistent, and ready to grow across channels.",
    },
    quick: [Q.pricing, Q.contact],
    cta: {
      label: { en: "See agency page", id: "Lihat halaman agency" },
      href: "/digital-agency",
    },
  },
  {
    id: "crm",
    triggers: [
      "crm",
      "kelola pelanggan",
      "manajemen pelanggan",
      "data pelanggan",
      "pipeline",
      "kelola lead",
    ],
    reply: {
      id: "CRM kami membantu tim melacak prospek, menjaga follow-up tetap rapi, dan menutup lebih banyak deal dengan alur yang lebih jelas. Sistemnya bisa disesuaikan dengan proses sales Anda.",
      en: "Our CRM helps teams track prospects, keep follow-ups organized, and close more deals with a clearer operating flow. The setup can be tailored to your sales process.",
    },
    quick: [Q.pricing, Q.contact],
    cta: {
      label: { en: "See CRM page", id: "Lihat halaman CRM" },
      href: "/crm",
    },
  },
  {
    id: "aitools",
    triggers: [
      "generator",
      "ai image",
      "ai text",
      "ai video",
      "ai music",
      "gambar ai",
      "konten ai",
      "buat gambar",
      "buat video",
    ],
    reply: {
      id: "AI generator kami membantu membuat gambar, teks, video, dan musik dalam waktu lebih singkat, sehingga tim bisa memproduksi lebih banyak output tanpa menambah kerumitan operasional.",
      en: "Our AI generators help create images, text, video, and music faster, so teams can ship more output without adding operational chaos.",
    },
    quick: [Q.services, Q.contact],
  },
  {
    id: "process",
    triggers: [
      "cara kerja",
      "proses",
      "how it works",
      "how do you work",
      "gimana caranya",
      "tahapan",
      "langkah",
      "alur",
      "workflow",
    ],
    reply: {
      id: "Alurnya sederhana: discovery untuk memahami tujuan, lalu strategi dan desain, lalu build dan launch, kemudian growth dan support. Kami jaga tiap tahap tetap transparan dan mudah diikuti.",
      en: "The flow is simple: discovery to understand your goals, then strategy and design, then build and launch, followed by growth and support. We keep each step transparent and easy to follow.",
    },
    quick: [Q.timeline, Q.contact],
  },
  {
    id: "timeline",
    triggers: [
      "berapa lama",
      "lama",
      "durasi",
      "how long",
      "kapan selesai",
      "timeline",
      "estimasi waktu",
      "waktu pengerjaan",
    ],
    reply: {
      id: "Timeline tergantung scope. Sebagai gambaran, chatbot atau landing page biasanya sekitar 1 sampai 2 minggu, sementara aplikasi bisa sekitar 4 sampai 8 minggu. Kami bisa beri estimasi yang lebih pasti setelah tahu kebutuhannya.",
      en: "The timeline depends on scope. As a rough guide, a chatbot or landing page usually takes around 1 to 2 weeks, while an app can take around 4 to 8 weeks. We can give a firmer estimate once we know the actual needs.",
    },
    quick: [Q.process, Q.contact],
  },
  {
    id: "contact",
    triggers: [
      "hubungi",
      "kontak",
      "contact",
      "email",
      "telepon",
      "nomor",
      "ngobrol",
      "konsultasi",
      "demo",
      "bicara",
      "tanya tim",
      "minta penawaran",
      "quote",
      "proposal",
    ],
    reply: {
      id: "Tentu. Anda bisa email ke plusthesite@gmail.com, isi form kontak, atau tinggalkan nama plus email atau WhatsApp di sini supaya tim kami yang follow up.",
      en: "Absolutely. You can email plusthesite@gmail.com, open the contact form, or leave your name plus email or WhatsApp here so our team can follow up.",
    },
    cta: {
      label: { en: "Open contact form", id: "Buka form kontak" },
      href: "/contact-us",
    },
  },
  {
    id: "location",
    triggers: [
      "lokasi",
      "di mana",
      "dimana",
      "alamat",
      "kantor",
      "location",
      "where are you",
      "kota",
      "kota mana",
    ],
    reply: {
      id: "Kami melayani bisnis di berbagai kota di Indonesia secara remote maupun kolaborasi terjadwal, jadi lokasi bukan hambatan besar selama scope dan ritmenya jelas.",
      en: "We work with businesses across Indonesia through remote collaboration and scheduled delivery, so location is usually not a major blocker as long as the scope and rhythm are clear.",
    },
    quick: [Q.services, Q.contact],
  },
  {
    id: "payment",
    triggers: [
      "pembayaran",
      "cara bayar",
      "payment",
      "transfer",
      "cicil",
      "termin",
      "invoice",
      "dp",
    ],
    reply: {
      id: "Pembayaran kami fleksibel: retainer bulanan untuk layanan berjalan, atau termin berbasis milestone untuk proyek. Semua dibahas transparan di awal.",
      en: "Our payment structure is flexible: monthly retainers for ongoing services, or milestone-based terms for projects. Everything is discussed transparently upfront.",
    },
    quick: [Q.pricing, Q.contact],
  },
  {
    id: "portfolio",
    triggers: [
      "portfolio",
      "portofolio",
      "contoh",
      "example",
      "hasil kerja",
      "klien",
      "client",
      "pernah bikin",
      "case study",
    ],
    reply: {
      id: "Banyak proyek kami bersifat custom dan menjaga kerahasiaan klien. Tapi Anda tetap bisa lihat arah kerja kami lewat halaman produk dan blog yang berisi puluhan artikel insight.",
      en: "Many of our projects are custom and respect client confidentiality. But you can still see our thinking through the product pages and a blog filled with practical insight articles.",
    },
    quick: [Q.services, Q.contact],
  },
  {
    id: "human",
    triggers: [
      "manusia",
      "orang",
      "admin",
      "agent",
      "bicara dengan orang",
      "real person",
      "sales",
      "tim",
      "cs",
    ],
    reply: {
      id: "Tentu. Tim kami siap bantu langsung. Tinggalkan nama plus email atau WhatsApp di sini, atau buka form kontak, nanti kami follow up.",
      en: "Of course. Our team can help directly. Leave your name plus email or WhatsApp here, or open the contact form, and we will follow up.",
    },
    cta: {
      label: { en: "Open contact form", id: "Buka form kontak" },
      href: "/contact-us",
    },
  },
  {
    id: "thanks",
    triggers: [
      "makasih",
      "terima kasih",
      "thanks",
      "thank you",
      "thx",
      "tengkyu",
      "noted",
      "appreciate",
    ],
    reply: {
      id: "Sama-sama. Kalau ada yang ingin Anda tanyakan lagi soal layanan atau harga, saya siap bantu.",
      en: "You are welcome. If anything else comes up about services or pricing, I am here to help.",
    },
    quick: [Q.services, Q.pricing],
  },
  {
    id: "about",
    triggers: [
      "siapa kamu",
      "kamu siapa",
      "who are you",
      "plus itu apa",
      "apa itu plus",
      "tentang plus",
      "about you",
      "about plus",
      "kalian siapa",
      "perusahaan apa",
      "kamu bot",
    ],
    reply: {
      id: "plus. adalah digital AI-agency yang memadukan AI dengan tim manusia untuk membantu bisnis berkembang lewat chatbot, aplikasi, branding, konten, dan CRM. Saya adalah asistennya.",
      en: "plus. is a digital AI-agency that blends AI with a human team to help businesses grow through chatbots, apps, branding, content, and CRM. I am its assistant.",
    },
    quick: [Q.services, Q.whyus, Q.contact],
  },
  {
    id: "whyus",
    triggers: [
      "kenapa pilih",
      "kenapa harus",
      "why choose",
      "why you",
      "kelebihan",
      "keunggulan",
      "beda",
      "dibanding",
      "vs",
      "kompetitor",
      "bedanya apa",
      "alasan",
    ],
    reply: {
      id: "Nilai plus. ada pada ritme kerja yang menyatukan strategi, kreatif, dan teknologi dalam satu tim. Hasilnya lebih cepat bergerak, lebih konsisten, dan lebih mudah dikelola dibanding model yang terpisah-pisah.",
      en: "The strength of plus. is a working rhythm that combines strategy, creative, and technology inside one team. The result is faster movement, better consistency, and easier coordination than a fragmented setup.",
    },
    quick: [Q.pricing, Q.contact],
  },
  {
    id: "consultation",
    triggers: [
      "konsultasi",
      "consult",
      "ngobrol dulu",
      "tanya dulu",
      "gratis konsultasi",
      "free consult",
      "diskusi",
      "meeting",
      "ketemu",
      "zoom",
      "call",
    ],
    reply: {
      id: "Konsultasi awal bisa dimulai tanpa kewajiban. Ceritakan kebutuhan Anda, lalu kami bantu mengarahkan opsi, scope awal, dan estimasinya.",
      en: "An initial consultation can start with no obligation. Tell us what you need, and we will help shape the right option, early scope, and estimate.",
    },
    cta: {
      label: { en: "Open contact form", id: "Buka form kontak" },
      href: "/contact-us",
    },
  },
  {
    id: "discount",
    triggers: [
      "diskon",
      "discount",
      "promo",
      "potongan",
      "nego",
      "kurang",
      "deal",
      "penawaran khusus",
      "bisa kurang",
    ],
    reply: {
      id: "Kami menjaga harga tetap jujur. Paket tahunan biasanya lebih hemat, dan untuk proyek kami bisa menyesuaikan penawaran berdasarkan scope yang realistis.",
      en: "We keep pricing honest. Annual plans usually save more, and for projects we can shape the quote around a realistic scope.",
    },
    quick: [Q.pricing, Q.contact],
  },
  {
    id: "guarantee",
    triggers: [
      "garansi",
      "guarantee",
      "revisi",
      "revision",
      "jaminan",
      "kalau nggak puas",
      "refund",
      "uang kembali",
      "warranty",
      "gagal",
    ],
    reply: {
      id: "Kami bekerja iteratif dengan revisi yang dibahas per tahap, jadi arah hasilnya bisa dikontrol sebelum bergerak lebih jauh. Ruang revisi disepakati sejak awal agar jelas untuk kedua pihak.",
      en: "We work iteratively with revisions discussed at each stage, so the direction stays controllable before moving further. Revision scope is agreed upfront to keep expectations clear on both sides.",
    },
    quick: [Q.process, Q.contact],
  },
  {
    id: "contract",
    triggers: [
      "kontrak",
      "contract",
      "lock in",
      "lock-in",
      "terikat",
      "ikatan",
      "minimal berlangganan",
      "komitmen",
      "putus kapan",
    ],
    reply: {
      id: "Untuk layanan bulanan kami menjaga fleksibilitas tanpa lock-in berat. Untuk proyek, struktur kerjanya biasanya berbasis milestone yang jelas.",
      en: "For monthly services we keep things flexible without heavy lock-in. For projects, the structure is usually milestone-based and clearly defined.",
    },
    quick: [Q.pricing, Q.contact],
  },
  {
    id: "maintenance",
    triggers: [
      "maintenance",
      "perawatan",
      "support setelah",
      "after launch",
      "setelah jadi",
      "update",
      "pemeliharaan",
      "garansi bug",
      "fixing",
    ],
    reply: {
      id: "Kami juga menangani support setelah rilis, termasuk monitoring, perbaikan, dan pengembangan lanjutan sesuai kebutuhan tim Anda.",
      en: "We also handle post-launch support, including monitoring, fixes, and follow-on improvements based on what your team needs.",
    },
    quick: [Q.pricing, Q.contact],
  },
  {
    id: "seo",
    triggers: [
      "seo",
      "ranking google",
      "masuk halaman 1",
      "page 1",
      "search engine",
      "mesin pencari",
      "google search",
      "trafik",
      "traffic organik",
      "kata kunci",
    ],
    reply: {
      id: "SEO juga termasuk dalam layanan agency kami, mulai dari struktur teknis, konten, schema, sampai optimasi yang relevan untuk pasar Indonesia dan AI search.",
      en: "SEO is also part of our agency work, covering technical structure, content, schema, and optimization that fits both Indonesia-focused search and AI search.",
    },
    quick: [Q.contact, Q.pricing],
  },
  {
    id: "ads",
    triggers: [
      "iklan",
      "ads",
      "google ads",
      "facebook ads",
      "meta ads",
      "fb ads",
      "instagram ads",
      "tiktok ads",
      "beriklan",
      "paid ads",
      "ppc",
      "adwords",
    ],
    reply: {
      id: "Kami bisa membantu paid ads di Google, Meta, Instagram, atau TikTok, lalu menyambungkannya ke landing page dan alur follow-up yang lebih rapi agar hasilnya tidak berhenti di klik.",
      en: "We can help with paid ads across Google, Meta, Instagram, or TikTok, then connect them to cleaner landing pages and follow-up flows so the result does not stop at clicks.",
    },
    quick: [Q.pricing, Q.contact],
  },
  {
    id: "ecommerce",
    triggers: [
      "toko online",
      "ecommerce",
      "e-commerce",
      "jualan online",
      "online shop",
      "marketplace",
      "olshop",
      "katalog produk",
      "keranjang",
      "checkout",
    ],
    reply: {
      id: "Kami juga bisa membangun sistem jualan berbasis web atau aplikasi, lengkap dengan katalog, checkout, alur pembayaran, dan integrasi WhatsApp atau CRM.",
      en: "We can also build commerce systems on the web or mobile, including catalog, checkout, payment flow, and WhatsApp or CRM integration.",
    },
    quick: [Q.app, Q.contact],
  },
  {
    id: "security",
    triggers: [
      "keamanan",
      "aman",
      "security",
      "data aman",
      "privacy",
      "privasi",
      "kerahasiaan",
      "gdpr",
      "uu pdp",
      "bocor",
      "enkripsi",
    ],
    reply: {
      id: "Keamanan dan privasi kami prioritaskan melalui akses berbasis peran, praktik perlindungan data yang rapi, dan pembatasan distribusi data klien.",
      en: "Security and privacy are a priority through role-based access, disciplined data-protection practices, and tight control over client data distribution.",
    },
    quick: [Q.services, Q.contact],
  },
  {
    id: "language",
    triggers: [
      "bahasa",
      "english",
      "inggris",
      "language",
      "multi bahasa",
      "bilingual",
      "bisa inggris",
      "in english",
    ],
    reply: {
      id: "Kami bekerja dalam Bahasa Indonesia dan English, termasuk untuk website, konten, dan kolaborasi harian.",
      en: "We work in both Bahasa Indonesia and English, including websites, content, and day-to-day collaboration.",
    },
    quick: [Q.services, Q.contact],
  },
  {
    id: "umkm",
    triggers: [
      "umkm",
      "ukm",
      "usaha kecil",
      "bisnis kecil",
      "startup",
      "baru mulai",
      "modal kecil",
      "budget terbatas",
      "pemula",
      "small business",
    ],
    reply: {
      id: "Banyak klien kami berasal dari UMKM dan startup. Biasanya kami mulai dari scope yang paling penting dulu supaya biaya tetap masuk akal dan hasil tetap terasa.",
      en: "Many of our clients are small businesses and startups. We usually begin with the highest-leverage scope first so the budget stays realistic while the result still feels meaningful.",
    },
    quick: [Q.pricing, Q.contact],
  },
  {
    id: "affirm",
    triggers: [
      "iya",
      "yes",
      "boleh",
      "mau",
      "oke",
      "sip ",
      "lanjut",
      "tertarik",
      "minat",
      "setuju",
      "betul",
      "bener",
    ],
    reply: {
      id: "Baik. Biar saya bantu lebih tepat, Anda bisa pilih layanan yang paling relevan atau tinggalkan nama plus email atau WhatsApp supaya tim kami yang menindaklanjuti.",
      en: "Great. To help more precisely, you can pick the most relevant service or leave your name plus email or WhatsApp so our team can follow up.",
    },
    quick: [Q.services, Q.pricing, Q.contact],
  },
  {
    id: "goodbye",
    triggers: [
      "bye",
      "dadah",
      "sampai jumpa",
      "udahan",
      "cukup",
      "sudah cukup",
      "see you",
      "nanti aja",
      "besok aja",
      "tutup",
    ],
    reply: {
      id: "Baik, terima kasih sudah mampir. Kalau nanti Anda butuh bantuan lagi, saya dan tim plus. siap membantu.",
      en: "Alright, thanks for stopping by. If you need help again later, the plus. team and I are ready to help.",
    },
  },
];

export const INITIAL_QUICK = [Q.services, Q.pricing, Q.chatbot, Q.contact];

const FALLBACK: Intent["reply"] = {
  id: "Maaf, saya belum paham maksudnya. Saya bisa bantu soal layanan, harga, cara kerja, atau menghubungkan Anda ke tim. Anda juga bisa tinggalkan nama plus email atau WhatsApp di sini.",
  en: "Sorry, I did not fully catch that. I can help with services, pricing, how we work, or connect you to the team. You can also leave your name plus email or WhatsApp here.",
};

export function matchIntent(text: string): Intent | null {
  const t = ` ${text.toLowerCase().replace(/[^\p{L}\p{N}\s@.]/gu, " ")} `;
  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    for (const trig of intent.triggers) {
      if (t.includes(trig)) {
        score += trig.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  return bestScore > 0 ? best : null;
}

export function fallbackReply(locale: "en" | "id") {
  return FALLBACK[locale];
}

export const detectEmail = (s: string) =>
  s.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0] ?? null;

export const detectPhone = (s: string) =>
  s.match(/(?:\+?62|0)8[0-9]{7,12}/)?.[0] ?? null;
