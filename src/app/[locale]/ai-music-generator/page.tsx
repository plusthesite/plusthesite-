"use client";

import { AudioWaveform, Gamepad2, MicVocal, Music2, Podcast, Sparkles, Workflow } from "lucide-react";
import AIGeneratorLanding from "@/components/AIGeneratorLanding";
import { useLocale } from "@/i18n/I18nProvider";

type Locale = "en" | "id";

const COPY = {
    en: {
        hero: {
            badge: "AI music generation for teams that need faster sound production without generic stock-library feel",
            title: "Create music directions, sonic variations, and production support faster for content, products, and experiences.",
            subtitle:
                "This offering is built for teams that want AI music inside a real audio workflow, where mood, usage context, and final selection still matter.",
            primaryCta: "Discuss music workflows",
            secondaryCta: "See where it helps",
            note: "Useful for content teams, game makers, media operators, and brands that need more sound output without commissioning every cue from zero.",
            chips: ["Mood tracks", "Sound variations", "Content audio", "Prototype support"],
            panelTitle: "music generation workflow",
            panelSubtitle: "brief, prompt, variation, review, release",
            panelStatus: "Active",
            panelProblemLabel: "What teams struggle with",
            panelProblemBody:
                "Audio needs often arrive late in production, but custom scoring is slow and stock music usually feels generic or poorly matched to the content.",
            panelValueLabel: "What this improves",
            panelValueBullets: [
                "Faster sonic direction before expensive music production",
                "More options for content formats and iteration cycles",
                "Cleaner support for teams that need functional audio at scale",
            ],
        },
        useCases: {
            eyebrow: "Where it helps",
            title: "Best used when teams need more usable audio options across repeatable content work.",
            subtitle:
                "The leverage is strongest when AI music supports sound direction, content packaging, or fast-turn production that still needs some taste in the loop.",
            items: [
                {
                    title: "Background tracks for content and promos",
                    body: "Generate music directions for ads, social content, explainers, and presentation layers without relying only on overused stock libraries.",
                },
                {
                    title: "Prototype and concept audio",
                    body: "Support product demos, app prototypes, podcast concepts, and motion drafts with sound that makes the idea feel more complete earlier.",
                },
                {
                    title: "Game and interactive experiments",
                    body: "Prepare mood tracks and audio directions for game scenes, interactions, or internal demos before full soundtrack production begins.",
                },
                {
                    title: "Variation work at useful speed",
                    body: "Generate multiple moods, pacing options, or tonal versions when one content format needs several audio directions quickly.",
                },
            ],
        },
        system: {
            eyebrow: "System approach",
            title: "The music generator is most useful when it supports selection, direction, and iterative production.",
            subtitle:
                "We treat generated audio as part of a broader creative system: what mood it serves, where it will be used, and how it moves into the final asset stack.",
            items: [
                {
                    title: "Start from mood and purpose",
                    body: "The best outputs come from defining how the audio should feel and what the content actually needs from it.",
                },
                {
                    title: "Generate alternatives worth comparing",
                    body: "Variation is useful when the team can evaluate emotional fit, pacing, and usage quality instead of just collecting random tracks.",
                },
                {
                    title: "Move the right track into production",
                    body: "The selected output should support editing, timing, and final packaging instead of staying as an isolated experiment.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "A cleaner route from audio need to usable soundtrack layer.",
            subtitle:
                "The process is about getting to the right sound direction faster, then deciding how far that generated output should go in the final asset.",
            steps: [
                {
                    step: "01",
                    title: "Frame the audio role",
                    body: "Define the format, emotional tone, runtime, and content context so the generation process knows what job the audio must do.",
                },
                {
                    step: "02",
                    title: "Generate and compare",
                    body: "Create multiple music directions, compare fit and pacing, and narrow down the outputs that actually support the content well.",
                },
                {
                    step: "03",
                    title: "Use it in the final stack",
                    body: "Move the chosen track into edit, prototype, or release packaging so the generated output becomes part of a usable media workflow.",
                },
            ],
        },
        outputs: {
            eyebrow: "Typical outputs",
            title: "What teams usually want from the music workflow",
            items: [
                "Content background tracks",
                "Mood references for creative review",
                "Prototype audio for products or apps",
                "Short-form promo music directions",
                "Game or interactive concept audio",
                "Fast-turn tonal variations for one format",
            ],
        },
        cta: {
            kicker: "plus. ai music generator",
            title: "If the team needs more audio output without defaulting to generic stock sound, this is where AI helps.",
            subtitle:
                "We can help shape a workflow where music generation speeds up sound exploration and repeatable production while final selection stays intentional.",
            primary: "Start the music discussion",
            secondary: "View pricing",
        },
    },
    id: {
        hero: {
            badge: "AI music generation untuk tim yang butuh produksi audio lebih cepat tanpa rasa stock-library generik",
            title: "Buat arah musik, variasi sonic, dan support produksi lebih cepat untuk konten, produk, dan experience tanpa kehilangan rasa yang disengaja.",
            subtitle:
                "Layanan ini dibangun untuk tim yang ingin AI music duduk di dalam workflow audio yang nyata, di mana mood, konteks pemakaian, dan seleksi akhir tetap penting.",
            primaryCta: "Bahas workflow musik",
            secondaryCta: "Lihat area pakainya",
            note: "Cocok untuk tim konten, pembuat game, operator media, dan brand yang butuh output audio lebih banyak tanpa harus memesan setiap cue dari nol.",
            chips: ["Mood track", "Variasi sonic", "Audio konten", "Dukungan prototype"],
            panelTitle: "workflow generasi musik",
            panelSubtitle: "brief, prompt, variasi, review, rilis",
            panelStatus: "Aktif",
            panelProblemLabel: "Yang sering bikin macet",
            panelProblemBody:
                "Kebutuhan audio sering datang terlambat di produksi, sementara scoring kustom memakan waktu dan musik stok sering terasa generik atau tidak pas dengan kontennya.",
            panelValueLabel: "Yang jadi lebih baik",
            panelValueBullets: [
                "Arah sonic lebih cepat sebelum produksi musik mahal",
                "Lebih banyak opsi untuk format konten dan siklus iterasi",
                "Dukungan yang lebih rapi untuk tim yang butuh audio fungsional dalam skala",
            ],
        },
        useCases: {
            eyebrow: "Area pakai",
            title: "Paling berguna saat tim butuh lebih banyak opsi audio yang usable di banyak kerja konten berulang.",
            subtitle:
                "Leverage paling kuat muncul saat AI music mendukung arah sound, packaging konten, atau produksi cepat yang tetap butuh taste dan keputusan manusia di dalam loop.",
            items: [
                {
                    title: "Track latar untuk konten dan promo",
                    body: "Hasilkan arah musik untuk ads, konten sosial, explainer, dan layer presentasi tanpa hanya bergantung pada stock library yang terlalu sering dipakai.",
                },
                {
                    title: "Audio prototype dan konsep",
                    body: "Dukung demo produk, prototype app, konsep podcast, dan motion draft dengan sound yang membuat ide terasa lebih utuh sejak fase awal.",
                },
                {
                    title: "Eksperimen game dan interaktif",
                    body: "Siapkan mood track dan arah audio untuk scene game, interaksi, atau demo internal sebelum produksi soundtrack penuh dimulai.",
                },
                {
                    title: "Kerja variasi dengan kecepatan yang berguna",
                    body: "Hasilkan banyak mood, opsi pacing, atau versi tonal saat satu format konten butuh beberapa arah audio dengan cepat.",
                },
            ],
        },
        system: {
            eyebrow: "Pendekatan sistem",
            title: "Music generator paling berguna saat mendukung seleksi, arah, dan produksi iteratif.",
            subtitle:
                "Kami memperlakukan audio hasil generate sebagai bagian dari sistem kreatif yang lebih besar: mood apa yang dilayani, di mana ia dipakai, dan bagaimana ia bergerak ke stack aset final tanpa kehilangan konteks.",
            items: [
                {
                    title: "Mulai dari mood dan tujuan",
                    body: "Output terbaik datang dari mendefinisikan bagaimana audio harus terasa dan apa yang sebenarnya dibutuhkan konten dari audio itu.",
                },
                {
                    title: "Generate alternatif yang layak dibandingkan",
                    body: "Variasi menjadi berguna saat tim bisa menilai emotional fit, pacing, dan kualitas pemakaian, bukan cuma mengumpulkan track acak yang sulit dipilih.",
                },
                {
                    title: "Masukkan track yang tepat ke produksi",
                    body: "Output terpilih harus mendukung editing, timing, dan packaging final, bukan tinggal sebagai eksperimen terisolasi.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "Jalur yang lebih bersih dari kebutuhan audio ke lapisan soundtrack yang usable.",
            subtitle:
                "Proses ini berfokus membawa tim ke arah sound yang tepat lebih cepat, lalu menentukan seberapa jauh output hasil generate memang layak masuk ke aset final.",
            steps: [
                {
                    step: "01",
                    title: "Bingkai peran audionya",
                    body: "Tentukan format, tone emosional, durasi, dan konteks konten supaya proses generation tahu pekerjaan apa yang benar-benar harus dikerjakan audio itu.",
                },
                {
                    step: "02",
                    title: "Generate lalu bandingkan",
                    body: "Buat beberapa arah musik, bandingkan fit dan pacing-nya, lalu sempitkan ke output yang benar-benar mendukung konten dengan baik.",
                },
                {
                    step: "03",
                    title: "Pakai di stack final",
                    body: "Masukkan track terpilih ke edit, prototype, atau packaging rilis supaya output hasil generate menjadi bagian dari workflow media yang usable.",
                },
            ],
        },
        outputs: {
            eyebrow: "Output umum",
            title: "Yang biasanya tim cari dari workflow musik ini",
            items: [
                "Track latar untuk konten",
                "Referensi mood untuk review kreatif",
                "Audio prototype untuk produk atau app",
                "Arah musik promo short-form",
                "Audio konsep untuk game atau interaktif",
                "Variasi tonal cepat untuk satu format",
            ],
        },
        cta: {
            kicker: "plus. ai music generator",
            title: "Kalau tim butuh output audio lebih banyak tanpa jatuh ke sound stok yang generik, di sinilah AI berguna.",
            subtitle:
                "Kami bisa bantu membentuk workflow di mana music generation mempercepat eksplorasi sound dan produksi berulang sementara seleksi akhirnya tetap disengaja dan relevan dengan konteks pakainya.",
            primary: "Mulai diskusi musik",
            secondary: "Lihat pricing",
        },
    },
} as const;

const THEME = {
    heroBg:
        "bg-[radial-gradient(circle_at_12%_18%,_rgba(171,111,255,0.18),_transparent_30%),radial-gradient(circle_at_82%_18%,_rgba(95,132,255,0.16),_transparent_26%),linear-gradient(180deg,_#18112d_0%,_#281d45_100%)]",
    panelBg: "bg-white/[0.06]",
    panelAccent: "bg-violet-300/18",
    softBg: "bg-[#f0ecff]",
    softButton: "bg-[#f0ecff]",
    darkAccent: "text-violet-300",
};

export default function AIMusicGeneratorPage() {
    const locale = useLocale() as Locale;

    return (
        <AIGeneratorLanding
            copy={COPY[locale]}
            locale={locale}
            theme={THEME}
            cardIcons={[
                <Music2 key="music" className="h-5 w-5" />,
                <Podcast key="podcast" className="h-5 w-5" />,
                <Gamepad2 key="game" className="h-5 w-5" />,
                <AudioWaveform key="wave" className="h-5 w-5" />,
            ]}
            systemIcons={[
                <MicVocal key="mic" className="h-5 w-5" />,
                <Sparkles key="sparkles" className="h-5 w-5" />,
                <Workflow key="workflow" className="h-5 w-5" />,
            ]}
        />
    );
}
