export type Language = "en" | "id";

export const translations = {
  en: {
    /* ── Navbar ── */
    navbar: {
      about: "About",
      products: "Products",
      aiFeatures: "AI Features",
      pricing: "Pricing",
      home: "Home",
      contactUs: "Contact Us",
      viewPricing: "View Pricing",
      ourProducts: "Our Products",
      viewAllProducts: "View All Products",
      new: "New",
      // Product dropdown descriptions
      productItems: {
        aiChatBot: "Smart AI-powered chatbot",
        customerSupport: "Smarter support decisions",
        mobileApp: "Mobile-first experiences",
        crmPlatform: "Client management tools",
        digitalAgency: "Full-service digital solutions",
        mobileGame: "Immersive gaming experiences",
      },
    },

    /* ── Hero ── */
    hero: {
      badge: "Indonesia\u2019s No.1 Digital AI-gency",
      heading1: "Build Smarter Brands.",
      heading2: "Faster.",
      subtitle: "With AI + Human Creativity",
      description:
        "One integrated platform for brands that want to move fast, stay consistent, and still look premium \u2014 powered by AI and real creative minds.",
      ctaPrimary: "See How It Works",
      ctaSecondary: "View Pricing",
    },

    /* ── About ── */
    about: {
      badge: "About Plus",
      heading1: "Driven by",
      heading2: "Innovation",
      description:
        "plus. is a forward-thinking IT solutions provider dedicated to empowering businesses through innovative technology and tailored services. We bridge the gap between technology and business needs, providing solutions that enhance efficiency and drive growth.",
      statAI: "AI+",
      statAILabel: "Powered",
      statProducts: "6+",
      statProductsLabel: "Products",
      statTools: "5+",
      statToolsLabel: "AI Tools",
    },

    /* ── Features / Products ── */
    features: {
      badge: "Our Products",
      heading: "AI Products That Empower",
      description:
        "Accelerating progress in artificial intelligence \u2014 innovative solutions designed to empower your business and enhance efficiency.",
      products: [
        {
          title: "AI Chat Bot",
          description:
            "Your smartest AI chatbot \u2014 always ready to assist. Experience seamless conversations, instant answers, and 24/7 support for your customers.",
        },
        {
          title: "Customer Support",
          description:
            "Smart tools for smarter customer support decisions. Enhance operations with tailored solutions that meet unique client needs.",
        },
        {
          title: "Mobile App",
          description:
            "Mobile magic \u2014 empowering businesses through technology. We develop & create digital experiences that drive growth.",
        },
        {
          title: "CRM Platform",
          description:
            "Empower your business with our CRM technology. Enhancing operations, managing clients, and driving sustainable growth.",
        },
        {
          title: "Digital Agency",
          description:
            "Full-service digital agency for brands that want to grow. From strategy to execution, we craft tailored digital solutions.",
        },
        {
          title: "Mobile Game",
          description:
            "Engaging mobile game development that captivates players. From concept to launch, we build immersive gaming experiences.",
        },
      ],
    },

    /* ── AI Features ── */
    aiFeatures: {
      badge: "AI Features",
      heading: "Powered by Artificial Intelligence",
      description:
        "From image generation to music creation \u2014 our AI tools help you build smarter and faster.",
      items: [
        {
          title: "AI Image Generator",
          description:
            "Create beautiful art with artificial intelligence. Three APIs integrated: OpenAI, Stable Diffusion and Stability AI \u2014 100+ models combined.",
        },
        {
          title: "AI Text Generator",
          description:
            "Write smarter and save time with AI-powered tools. Generate copy, content, and creative writing that connects with your audience.",
        },
        {
          title: "AI Chat Bot",
          description:
            "Personal AI Chat Bot \u2014 cost-effective, 24/7 availability, and flexible. Seamless conversations and instant answers for any need.",
        },
        {
          title: "AI Video Generator",
          description:
            "AI video that works while you sleep. Text-to-Video generation for seamless integration and engaging multimedia content.",
        },
        {
          title: "AI Music Generator",
          description:
            "Create music generated using text. Text-to-Music generation API for seamless integration and engaging audio content creation.",
        },
      ],
      servicesBadge: "IT Solutions",
      servicesHeading: "Digital Strategies That Drive Growth",
      services: [
        {
          title: "Cloud Solutions",
          description:
            "Tailored cloud services to enhance your business operations and scalability.",
        },
        {
          title: "Marketing Solutions",
          description:
            "Customized marketing strategies that yield impactful results and drive engagement.",
        },
        {
          title: "Innovative Solutions",
          description:
            "Cutting-edge services that enable businesses to excel in the digital realm.",
        },
      ],
    },

    /* ── Pricing ── */
    pricing: {
      badge: "Pricing",
      heading: "Choose the Right Plan for You",
      description:
        "Simple, transparent pricing that grows with your business.",
      monthly: "Monthly",
      annual: "Annual",
      recommended: "Recommended",
      whatsIncluded: "What\u2019s included",
      choosePlan: "Choose Plan",
      monthlyPlans: [
        {
          name: "Starter",
          description: "Best for getting started",
          features: [
            "Explore our diverse offerings",
            "Innovative tech solutions",
            "Tailored service packages",
            "Flexible payment plans",
          ],
        },
        {
          name: "Professional",
          description: "Most popular choice",
          features: [
            "Comprehensive features included",
            "Innovative tech solutions",
            "Tailored digital strategies",
            "Comprehensive support services",
          ],
        },
        {
          name: "Premium",
          description: "For large-scale operations",
          features: [
            "Innovative tech solutions",
            "Tailored for you",
            "Tailored solutions for every need",
            "Transparent pricing with no surprises",
          ],
        },
      ],
      annualPlans: [
        {
          name: "Basic",
          description: "Best for getting started",
          features: [
            "Comprehensive IT support",
            "Tailored solutions available",
            "Innovative IT solutions",
            "Tailored service packages",
          ],
        },
        {
          name: "Professional",
          description: "Most popular choice",
          features: [
            "Innovative IT solutions",
            "Tailored service plans",
            "Innovative IT solutions",
            "Tailored service packages",
          ],
        },
        {
          name: "Premium",
          description: "For large-scale operations",
          features: [
            "Empowering your business",
            "Innovative solutions offered",
            "Tailored for your needs",
            "Transparent pricing",
          ],
        },
      ],
    },

    /* ── FAQ ── */
    faq: {
      badge: "FAQ",
      heading: "Frequently Asked Questions",
      description:
        "Everything you need to know about plus. and our services.",
      items: [
        {
          question: "What services does plus. provide?",
          answer:
            "plus. specializes in AI-powered digital solutions including Chat Bot, Customer Support tools, Mobile App development, CRM platforms, Digital Agency services, and Mobile Game development. We also offer cloud solutions, cybersecurity services, and digital marketing.",
        },
        {
          question: "What AI features are available on the platform?",
          answer:
            "We offer 5 AI-powered tools: AI Image Generator (with 100+ models from OpenAI, Stable Diffusion & Stability AI), AI Text Generator, Personal AI Chat Bot, AI Video Generator, and AI Music Generator \u2014 all designed to help you build smarter and faster.",
        },
        {
          question: "What pricing plans do you offer?",
          answer:
            "We offer flexible monthly and annual plans. Monthly: Starter ($25), Professional ($50, recommended), and Premium ($500). Annual plans are also available with adjusted pricing. We also offer Service Plus packages starting at $45 for installation up to $699 for full website packages.",
        },
        {
          question: "How can I reach plus. for support?",
          answer:
            "You can reach us via email at support@plusthe.site or through our Contact Us page. Our team is dedicated to providing innovative solutions and exceptional customer support to meet your unique business needs.",
        },
        {
          question:
            "Do you offer customization and website development?",
          answer:
            "Yes! Our Service Plus packages include theme installation ($45), ready-to-use website setup with content replacement up to 6 pages ($469), and full website package with SEO & speed optimization ($699). All packages include professional customization.",
        },
      ],
    },

    /* ── Footer ── */
    footer: {
      tagline:
        "One integrated platform for brands that want to move fast, stay consistent, and still look premium \u2014 powered by AI and real creative minds.",
      productsLabel: "Products",
      companyLabel: "Company",
      connectLabel: "Connect",
      contactUs: "Contact Us \u2192",
      copyright: "All rights reserved.",
      // Company link labels
      aboutUs: "About Us",
      ourWork: "Our Work",
      services: "Services",
      blog: "Blog",
    },
  },

  id: {
    /* ── Navbar ── */
    navbar: {
      about: "Tentang",
      products: "Produk",
      aiFeatures: "Fitur AI",
      pricing: "Harga",
      home: "Beranda",
      contactUs: "Hubungi Kami",
      viewPricing: "Lihat Harga",
      ourProducts: "Produk Kami",
      viewAllProducts: "Lihat Semua Produk",
      new: "Baru",
      productItems: {
        aiChatBot: "Chatbot pintar berbasis AI",
        customerSupport: "Keputusan dukungan lebih cerdas",
        mobileApp: "Pengalaman mobile-first",
        crmPlatform: "Alat manajemen klien",
        digitalAgency: "Solusi digital lengkap",
        mobileGame: "Pengalaman gaming imersif",
      },
    },

    /* ── Hero ── */
    hero: {
      badge: "AI-gency Digital No.1 Indonesia",
      heading1: "Bangun Brand Lebih Cerdas.",
      heading2: "Lebih Cepat.",
      subtitle: "Dengan AI + Kreativitas Manusia",
      description:
        "Satu platform terintegrasi untuk brand yang ingin bergerak cepat, tetap konsisten, dan tetap terlihat premium \u2014 didukung AI dan kreativitas nyata.",
      ctaPrimary: "Lihat Cara Kerjanya",
      ctaSecondary: "Lihat Harga",
    },

    /* ── About ── */
    about: {
      badge: "Tentang Plus",
      heading1: "Didorong oleh",
      heading2: "Inovasi",
      description:
        "plus. adalah penyedia solusi IT berpikiran maju yang berdedikasi memberdayakan bisnis melalui teknologi inovatif dan layanan yang disesuaikan. Kami menjembatani kesenjangan antara teknologi dan kebutuhan bisnis, menyediakan solusi yang meningkatkan efisiensi dan mendorong pertumbuhan.",
      statAI: "AI+",
      statAILabel: "Bertenaga",
      statProducts: "6+",
      statProductsLabel: "Produk",
      statTools: "5+",
      statToolsLabel: "Alat AI",
    },

    /* ── Features / Products ── */
    features: {
      badge: "Produk Kami",
      heading: "Produk AI yang Memberdayakan",
      description:
        "Mempercepat kemajuan dalam kecerdasan buatan \u2014 solusi inovatif yang dirancang untuk memberdayakan bisnis Anda dan meningkatkan efisiensi.",
      products: [
        {
          title: "AI Chat Bot",
          description:
            "Chatbot AI tercanggih Anda \u2014 selalu siap membantu. Rasakan percakapan yang mulus, jawaban instan, dan dukungan 24/7 untuk pelanggan Anda.",
        },
        {
          title: "Customer Support",
          description:
            "Alat cerdas untuk keputusan dukungan pelanggan yang lebih baik. Tingkatkan operasi dengan solusi yang disesuaikan untuk kebutuhan unik klien.",
        },
        {
          title: "Mobile App",
          description:
            "Keajaiban mobile \u2014 memberdayakan bisnis melalui teknologi. Kami mengembangkan & menciptakan pengalaman digital yang mendorong pertumbuhan.",
        },
        {
          title: "CRM Platform",
          description:
            "Berdayakan bisnis Anda dengan teknologi CRM kami. Meningkatkan operasi, mengelola klien, dan mendorong pertumbuhan berkelanjutan.",
        },
        {
          title: "Digital Agency",
          description:
            "Agensi digital layanan lengkap untuk brand yang ingin berkembang. Dari strategi hingga eksekusi, kami merancang solusi digital yang disesuaikan.",
        },
        {
          title: "Mobile Game",
          description:
            "Pengembangan game mobile yang menarik dan memikat pemain. Dari konsep hingga peluncuran, kami membangun pengalaman gaming yang imersif.",
        },
      ],
    },

    /* ── AI Features ── */
    aiFeatures: {
      badge: "Fitur AI",
      heading: "Didukung Kecerdasan Buatan",
      description:
        "Dari pembuatan gambar hingga penciptaan musik \u2014 alat AI kami membantu Anda membangun lebih cerdas dan lebih cepat.",
      items: [
        {
          title: "AI Image Generator",
          description:
            "Ciptakan seni indah dengan kecerdasan buatan. Tiga API terintegrasi: OpenAI, Stable Diffusion dan Stability AI \u2014 100+ model tergabung.",
        },
        {
          title: "AI Text Generator",
          description:
            "Tulis lebih cerdas dan hemat waktu dengan alat bertenaga AI. Hasilkan copy, konten, dan tulisan kreatif yang terhubung dengan audiens Anda.",
        },
        {
          title: "AI Chat Bot",
          description:
            "Chat Bot AI Personal \u2014 hemat biaya, tersedia 24/7, dan fleksibel. Percakapan mulus dan jawaban instan untuk setiap kebutuhan.",
        },
        {
          title: "AI Video Generator",
          description:
            "Video AI yang bekerja saat Anda tidur. Pembuatan Teks-ke-Video untuk integrasi yang mulus dan konten multimedia yang menarik.",
        },
        {
          title: "AI Music Generator",
          description:
            "Buat musik menggunakan teks. API pembuatan Teks-ke-Musik untuk integrasi yang mulus dan pembuatan konten audio yang menarik.",
        },
      ],
      servicesBadge: "Solusi IT",
      servicesHeading: "Strategi Digital yang Mendorong Pertumbuhan",
      services: [
        {
          title: "Solusi Cloud",
          description:
            "Layanan cloud yang disesuaikan untuk meningkatkan operasi bisnis dan skalabilitas Anda.",
        },
        {
          title: "Solusi Marketing",
          description:
            "Strategi pemasaran yang disesuaikan yang menghasilkan dampak dan mendorong keterlibatan.",
        },
        {
          title: "Solusi Inovatif",
          description:
            "Layanan mutakhir yang memungkinkan bisnis unggul di ranah digital.",
        },
      ],
    },

    /* ── Pricing ── */
    pricing: {
      badge: "Harga",
      heading: "Pilih Paket yang Tepat untuk Anda",
      description:
        "Harga sederhana dan transparan yang tumbuh bersama bisnis Anda.",
      monthly: "Bulanan",
      annual: "Tahunan",
      recommended: "Direkomendasikan",
      whatsIncluded: "Yang termasuk",
      choosePlan: "Pilih Paket",
      monthlyPlans: [
        {
          name: "Starter",
          description: "Terbaik untuk memulai",
          features: [
            "Jelajahi penawaran beragam kami",
            "Solusi teknologi inovatif",
            "Paket layanan yang disesuaikan",
            "Rencana pembayaran fleksibel",
          ],
        },
        {
          name: "Professional",
          description: "Pilihan paling populer",
          features: [
            "Fitur komprehensif termasuk",
            "Solusi teknologi inovatif",
            "Strategi digital yang disesuaikan",
            "Layanan dukungan komprehensif",
          ],
        },
        {
          name: "Premium",
          description: "Untuk operasi skala besar",
          features: [
            "Solusi teknologi inovatif",
            "Disesuaikan untuk Anda",
            "Solusi untuk setiap kebutuhan",
            "Harga transparan tanpa kejutan",
          ],
        },
      ],
      annualPlans: [
        {
          name: "Basic",
          description: "Terbaik untuk memulai",
          features: [
            "Dukungan IT komprehensif",
            "Solusi yang disesuaikan tersedia",
            "Solusi IT inovatif",
            "Paket layanan yang disesuaikan",
          ],
        },
        {
          name: "Professional",
          description: "Pilihan paling populer",
          features: [
            "Solusi IT inovatif",
            "Rencana layanan yang disesuaikan",
            "Solusi IT inovatif",
            "Paket layanan yang disesuaikan",
          ],
        },
        {
          name: "Premium",
          description: "Untuk operasi skala besar",
          features: [
            "Memberdayakan bisnis Anda",
            "Solusi inovatif ditawarkan",
            "Disesuaikan untuk kebutuhan Anda",
            "Harga transparan",
          ],
        },
      ],
    },

    /* ── FAQ ── */
    faq: {
      badge: "FAQ",
      heading: "Pertanyaan yang Sering Diajukan",
      description:
        "Semua yang perlu Anda ketahui tentang plus. dan layanan kami.",
      items: [
        {
          question: "Layanan apa yang disediakan plus.?",
          answer:
            "plus. mengkhususkan diri dalam solusi digital bertenaga AI termasuk Chat Bot, alat Customer Support, pengembangan Mobile App, platform CRM, layanan Digital Agency, dan pengembangan Mobile Game. Kami juga menawarkan solusi cloud, layanan cybersecurity, dan digital marketing.",
        },
        {
          question: "Fitur AI apa yang tersedia di platform?",
          answer:
            "Kami menawarkan 5 alat bertenaga AI: AI Image Generator (dengan 100+ model dari OpenAI, Stable Diffusion & Stability AI), AI Text Generator, Personal AI Chat Bot, AI Video Generator, dan AI Music Generator \u2014 semuanya dirancang untuk membantu Anda membangun lebih cerdas dan cepat.",
        },
        {
          question: "Paket harga apa yang ditawarkan?",
          answer:
            "Kami menawarkan paket bulanan dan tahunan yang fleksibel. Bulanan: Starter ($25), Professional ($50, direkomendasikan), dan Premium ($500). Paket tahunan juga tersedia dengan harga yang disesuaikan. Kami juga menawarkan paket Service Plus mulai dari $45 untuk instalasi hingga $699 untuk paket website lengkap.",
        },
        {
          question: "Bagaimana cara menghubungi plus. untuk dukungan?",
          answer:
            "Anda dapat menghubungi kami melalui email di support@plusthe.site atau melalui halaman Hubungi Kami. Tim kami berdedikasi menyediakan solusi inovatif dan dukungan pelanggan luar biasa untuk memenuhi kebutuhan bisnis unik Anda.",
        },
        {
          question:
            "Apakah Anda menawarkan kustomisasi dan pengembangan website?",
          answer:
            "Ya! Paket Service Plus kami termasuk instalasi tema ($45), setup website siap pakai dengan penggantian konten hingga 6 halaman ($469), dan paket website lengkap dengan optimasi SEO & kecepatan ($699). Semua paket termasuk kustomisasi profesional.",
        },
      ],
    },

    /* ── Footer ── */
    footer: {
      tagline:
        "Satu platform terintegrasi untuk brand yang ingin bergerak cepat, tetap konsisten, dan tetap terlihat premium \u2014 didukung AI dan kreativitas nyata.",
      productsLabel: "Produk",
      companyLabel: "Perusahaan",
      connectLabel: "Terhubung",
      contactUs: "Hubungi Kami \u2192",
      copyright: "Hak cipta dilindungi.",
      aboutUs: "Tentang Kami",
      ourWork: "Karya Kami",
      services: "Layanan",
      blog: "Blog",
    },
  },
} as const;

// Use a mapped type so both locales are assignable to Translations
export type Translations = {
  [K in keyof (typeof translations)["en"]]: (typeof translations)["en"][K];
};
