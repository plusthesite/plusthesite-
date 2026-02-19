# plus. — Fitur & Interaksi Lengkap

> Dokumentasi lengkap setiap halaman, fitur, dan interaksi yang tersedia di **plus. AI Marketing Studio**.

---

## 📍 Sitemap

| Route             | Halaman         | Deskripsi                              |
| ----------------- | --------------- | -------------------------------------- |
| `/`               | Landing Page    | Homepage utama — company profile       |
| `/chat-bot`       | AI Chatbot      | Showcase chatbot AI + pricing          |
| `/studio`         | PLUS Pro Studio | Dashboard marketing app (main product) |
| `/digital-agency` | Digital Agency  | Landing page divisi IT/Digital Agency  |
| `/mobile-game`    | Mobile Game     | Landing page divisi game development   |

---

## 1. Landing Page (`/`)

Homepage utama yang menampilkan identitas perusahaan dan produk.

### Sections & Interaksi

| Section         | Komponen                                                                                  | Interaksi                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Hero**        | Full-screen hero dengan background image                                                  | Tombol "See How It Works" → scroll ke Products. Tombol "View Pricing" → scroll ke Pricing |
| **About**       | Profil perusahaan + statistik (AI+, 6+ Products, 5+ AI Tools)                             | Scroll reveal animation                                                                   |
| **Products**    | Grid 3 produk utama (Digital Agency, AI Chatbot, Mobile Game)                             | Klik card → navigasi ke halaman masing-masing                                             |
| **AI Features** | Showcase fitur AI (Content Planner, Visual Generator, Strategy Analyzer, Voice Assistant) | Hover effect + animasi                                                                    |
| **Pricing**     | 3 paket harga (Starter, Professional, Enterprise)                                         | Klik "Choose Plan" → scroll ke kontak                                                     |
| **FAQ**         | Accordion FAQ (5 pertanyaan)                                                              | Klik pertanyaan → expand/collapse jawaban                                                 |
| **Footer**      | Link navigasi + social media + copyright                                                  | Klik link → navigasi                                                                      |

### Navigasi (Navbar)

- Logo **plus.** → kembali ke homepage
- Menu: **About**, **Products**, **AI Features**, **Pricing**, **FAQ**
- Tombol **Get Studio** → navigasi ke `/studio`
- **Dark/Light mode toggle** 🌓

---

## 2. AI Chatbot Page (`/chat-bot`)

Halaman showcase untuk AI chatbot assistant plus.

### Sections & Interaksi

| Section          | Interaksi                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| **Hero**         | Animasi chat demo otomatis — bubble muncul satu per satu mensimulasikan percakapan AI                         |
| **Capabilities** | 4 card fitur (Content Planner, Visual Generator, Strategy Analyzer, Voice Assistant) dengan hover glow effect |
| **Chat Demo**    | Simulasi chat real-time: typing indicator → bubble message muncul bertahap                                    |
| **Pricing**      | 2 paket (Starter $25/mo, Pro $65/mo) dengan fitur comparison. Tombol "Mulai Sekarang" / "Coba Gratis"         |
| **Testimonials** | 3 testimonial carousel dari user                                                                              |
| **FAQ**          | 5 FAQ accordion khusus chatbot                                                                                |
| **CTA**          | Tombol "Mulai Sekarang" dan "Hubungi Kami" → scroll ke kontak/pricing                                         |

---

## 3. PLUS Pro Studio (`/studio`) ⭐ Main Product

Dashboard marketing all-in-one bertenaga AI. Ini adalah fitur utama plus.

### Flow Navigasi

```
Studio Landing → Login → Dashboard
     ↑                       ↓
     └── Logout ←────────────┘
```

### 3.1 Studio Landing

| Elemen           | Interaksi                       |
| ---------------- | ------------------------------- |
| Hero section     | Tombol "Get Started" → ke Login |
| Feature showcase | Preview fitur-fitur Studio      |

### 3.2 Studio Login

| Elemen         | Interaksi                                     |
| -------------- | --------------------------------------------- |
| Form login     | Input email + password (demo: langsung masuk) |
| Tombol "Back"  | Kembali ke Landing                            |
| Tombol "Login" | Masuk ke Dashboard                            |

### 3.3 Studio Dashboard

Dashboard utama dengan sidebar navigation. Fitur dibagi menjadi **Core Tools** dan **Growth Tools**.

#### Sidebar Navigation

| Menu                | Icon       | View                  |
| ------------------- | ---------- | --------------------- |
| 📅 **Planner**      | Calendar   | AI Content Planner    |
| 🎨 **Generator**    | Wand2      | AI Image Generator    |
| 🎯 **Strategy**     | Target     | AI Strategy Analyzer  |
| 📊 **Analytics**    | BarChart3  | Performance Analytics |
| 📣 **KOL**          | Megaphone  | KOL Database          |
| 🔴 **Live Stream**  | Video      | Live Stream Tools     |
| 💳 **Subscription** | CreditCard | Pricing & Plans       |

#### Fitur Dashboard Global

- **Dark/Light mode** toggle
- **Notification bell** 🔔 — toast notification system
- **Interactive Tour** — guided tour untuk user baru
- **Documentation modal** — dokumentasi teknis built-in
- **AI Voice Assistant** 🎤 — auto-fill form via voice command
- **Logout** → kembali ke Landing

---

### 3.3.1 📅 AI Content Planner (ViewPlanner)

**AI-powered content calendar generator.**

| Elemen                                                             | Interaksi                                                                               |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Form input: Business Name, Industry, Target Market, Campaign Focus | Isi detail bisnis                                                                       |
| Tombol ⚡ "Auto Fill" (Voice Assistant)                            | Otomatis isi form dengan data demo ("Kopi Senja, F&B, Gen Z")                           |
| Tombol ✨ **Generate Calendar**                                    | Kirim ke **Gemini AI** → generate 6-hari content plan                                   |
| View toggle (List / Grid)                                          | Switch tampilan hasil kalender                                                          |
| Calendar cards                                                     | Setiap card menampilkan: Day, Title, Category (Sales/Awareness/Engagement), Description |

**Tech:** Menggunakan `callGeminiStructured()` dengan schema JSON untuk menghasilkan data terstruktur dari Gemini.

---

### 3.3.2 🎨 AI Image Generator (ViewGenerator)

**AI image generation powered by Gemini 2.0 Flash.**

| Elemen                                 | Interaksi                                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Prompt textarea                        | Tulis deskripsi gambar yang ingin dibuat                                                                    |
| Style selector                         | Pilih dari 8 style: Photorealistic, 3D Render, Anime, Oil Painting, Cyberpunk, Minimalist, Vintage, Pop Art |
| Aspect Ratio                           | Pilih: 1:1, 16:9, 9:16, 4:3                                                                                 |
| Tombol ✨ **Generate Visual**          | Kirim ke Gemini → generate gambar                                                                           |
| Preview area                           | Tampilkan hasil gambar full-size                                                                            |
| Hover overlay: **Save** & **Maximize** | Download gambar (.png) atau fullscreen view                                                                 |

**Tech:** Menggunakan `callGeminiImage()` yang memanggil Gemini 2.0 Flash image generation.

---

### 3.3.3 🎯 AI Strategy Analyzer (ViewStrategy)

**AI-powered marketing strategy & content analysis.**

| Elemen                         | Interaksi                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| Textarea: input caption/konten | Paste caption yang ingin dianalisis                                                         |
| Tombol **Analyze**             | Kirim ke Gemini → mendapat prediksi: Engagement Score, Virality, Sentiment, Recommendations |
| Tombol **Rewrite**             | AI menulis ulang caption agar lebih engaging                                                |
| Results panel                  | Menampilkan skor (gauge visual), tips, dan versi rewrite                                    |

**Tech:** Menggunakan `callGeminiStructured()` untuk analisis dan `callGeminiText()` untuk rewrite.

---

### 3.3.4 📊 Analytics Dashboard (ViewAnalytics)

**Marketing performance overview.**

| Elemen          | Interaksi                                                 |
| --------------- | --------------------------------------------------------- |
| Stat cards (3x) | Total Reach (450K), Engagement (12.5%), Conversion (3.2%) |
| Bar chart       | Audience Growth 12-bulan dengan hover tooltip per bar     |

> Note: Data saat ini mock/static. Siap untuk integrasi data real dari Supabase.

---

### 3.3.5 📣 KOL Database (ViewKOL)

**Influencer search & collaboration tool.**

| Elemen                     | Interaksi                                                                  |
| -------------------------- | -------------------------------------------------------------------------- |
| Filter: Kategori           | Dropdown: Semua, F&B, Fashion, Technology                                  |
| Filter: Harga              | Dropdown: Semua, Micro (<500rb), Macro (>500rb)                            |
| Search box                 | Cari influencer by name                                                    |
| Tombol **Kampanye Baru**   | Placeholder untuk create campaign                                          |
| KOL cards                  | Menampilkan: Avatar, Name, Handle, Tags, Followers, Engagement Rate, Price |
| Tombol **Kontak** per card | Toast notification "Proposal terkirim!"                                    |

**Data source:** Mock data dari `mockData.ts`. Tabel `kol_database` sudah tersedia di Supabase dengan 6 record seed.

---

### 3.3.6 🔴 Live Stream Tools (ViewLiveStream)

**Live streaming control panel & simulator.**

| Elemen              | Interaksi                                              |
| ------------------- | ------------------------------------------------------ |
| Stream preview area | Simulasi live stream view                              |
| Viewer count        | Real-time mock viewer counter                          |
| Chat panel          | Live chat simulation dengan auto-scroll                |
| Input chat          | Kirim pesan ke live chat                               |
| Control buttons     | Mic toggle, Camera toggle, Settings                    |
| Stream stats        | Viewers, Shopping bag (e-commerce integration preview) |

---

### 3.3.7 💳 Subscription & Pricing (ViewSubscription)

**Plan selection & custom pricing calculator.**

| Elemen                        | Interaksi                                                          |
| ----------------------------- | ------------------------------------------------------------------ |
| Plan cards (4x)               | Free, Starter, Pro, Enterprise — klik "Pilih" → toast notification |
| A La Carte calculator         | Check/uncheck fitur individual → harga otomatis dihitung           |
| Summary panel                 | Menampilkan fitur terpilih + total harga bulanan                   |
| Tombol **Langganan Sekarang** | Active jika ada fitur dipilih → toast confirmation                 |

**Pricing dalam IDR** — ditampilkan dengan format `Rp xxx.xxx`.

---

## 4. Digital Agency Page (`/digital-agency`)

Landing page untuk divisi IT & Digital Agency.

### Sections & Interaksi

| Section         | Interaksi                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Hero**        | Stats counter (150+ Solutions, 500+ Customers, 80+ Services, 200+ Designs) + CTA buttons                           |
| **Services**    | 3 service cards (Web/App Development, Content & Design, Innovative Solutions) dengan hover effects                 |
| **Portfolio**   | 2 project showcase cards dengan gambar                                                                             |
| **Stats**       | Animated counter section                                                                                           |
| **Testimonial** | Single testimonial quote                                                                                           |
| **CTA**         | Contact form: Name, Email, Company, Message. Tombol **Send Message** → POST ke `/api/contact` → simpan ke Supabase |

---

## 5. Mobile Game Page (`/mobile-game`)

Landing page untuk divisi game development.

### Sections & Interaksi

| Section          | Interaksi                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| **Hero**         | Animated game genre carousel + CTA                                                                     |
| **Features**     | 6 feature cards (Cross-Platform, Multiplayer, Real-time Analytics, AI-Powered, Cloud Save, Live Ops)   |
| **Showcase**     | Game genre cards: Racing, RPG, Puzzle, Action — dengan gambar & overlay                                |
| **Stats**        | 4 stat counters                                                                                        |
| **Testimonials** | 3 testimonial cards                                                                                    |
| **CTA**          | Contact form + technology stack display (Unity, Unreal, Godot, Firebase, AWS, PlayFab, Photon, Nakama) |

---

## 🔌 API Endpoints

| Method | Endpoint                   | Fungsi                        | Supabase Table             |
| ------ | -------------------------- | ----------------------------- | -------------------------- |
| `GET`  | `/api/health`              | Cek koneksi Supabase          | `kol_database` (read test) |
| `POST` | `/api/contact`             | Simpan contact form           | `contacts`                 |
| `POST` | `/api/chat`                | Simpan chat message           | `chat_messages`            |
| `GET`  | `/api/chat?session_id=xxx` | Ambil chat history by session | `chat_messages`            |

### Contoh Request

**Contact Form:**

```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Startup XYZ",    // opsional
  "message": "Saya tertarik dengan layanan AI marketing"
}
```

**Chat Message:**

```bash
POST /api/chat
Content-Type: application/json

{
  "session_id": "sess_abc123",
  "role": "user",              // "user" atau "assistant"
  "content": "Bantu saya buat content plan"
}
```

---

## 🎨 Design System

| Aspek          | Detail                                                    |
| -------------- | --------------------------------------------------------- |
| **Framework**  | Next.js 16.1 + Turbopack                                  |
| **Styling**    | Vanilla CSS + CSS Custom Properties                       |
| **Theme**      | Dark/Light mode via `ThemeProvider`                       |
| **Icons**      | Lucide React                                              |
| **Fonts**      | System defaults + Google Fonts                            |
| **Images**     | Unsplash (external) + Supabase Storage                    |
| **Animations** | CSS `@keyframes` + scroll reveal (`useScrollReveal` hook) |
| **AI Engine**  | Google Gemini 2.0 Flash (`@google/genai`)                 |
| **Database**   | Supabase (PostgreSQL via REST API)                        |

---

## 🗃️ Database Schema (Supabase)

| Tabel              | Kolom Utama                                                               | Fungsi                |
| ------------------ | ------------------------------------------------------------------------- | --------------------- |
| `chat_messages`    | session_id, role, content, created_at                                     | Riwayat chat AI       |
| `contacts`         | name, email, company, message, status                                     | Form submission       |
| `kol_database`     | name, handle, category, followers, engagement_rate, price, tags, verified | Data influencer       |
| `analytics_events` | event_type, page, metadata, session_id                                    | Tracking user actions |

---

## 🌐 Environment Variables

| Variable                        | Scope  | Fungsi                  |
| ------------------------------- | ------ | ----------------------- |
| `NEXT_PUBLIC_GEMINI_API_KEY`    | Client | Gemini AI (public)      |
| `GEMINI_API_KEY`                | Server | Gemini AI (server-side) |
| `NEXT_PUBLIC_SUPABASE_URL`      | Client | Supabase project URL    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Supabase anonymous key  |
