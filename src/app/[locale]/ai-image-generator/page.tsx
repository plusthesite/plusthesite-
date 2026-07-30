"use client";

import { Brush, ImagePlus, Layers3, ScanSearch, Sparkles, Workflow } from "lucide-react";
import AIGeneratorLanding from "@/components/AIGeneratorLanding";
import { useLocale } from "@/i18n/I18nProvider";

type Locale = "en" | "id";

const COPY = {
    en: {
        hero: {
            badge: "AI image generation for creative teams that need speed without cheap-looking output",
            title: "Generate visual directions, campaign assets, and concept frames faster without losing art direction.",
            subtitle:
                "This offering is shaped for teams that need AI image generation as part of a real creative workflow, not as a random prompt toy with no production discipline.",
            primaryCta: "Discuss image workflows",
            secondaryCta: "See where it helps",
            note: "Useful for marketing teams, content operators, and design-heavy businesses that need more volume without lowering taste.",
            chips: ["Concept frames", "Campaign visuals", "Variation testing", "Creative support"],
            panelTitle: "image generation workflow",
            panelSubtitle: "prompting, variation, refinement, handoff",
            panelStatus: "Active",
            panelProblemLabel: "What teams struggle with",
            panelProblemBody:
                "Visual production gets stuck between rough ideas, slow iteration, and too much manual asset variation when campaigns need to move quickly.",
            panelValueLabel: "What this improves",
            panelValueBullets: [
                "Faster creative exploration before full design production",
                "More visual directions for campaigns and content testing",
                "Cleaner handoff from AI output into final brand work",
            ],
        },
        useCases: {
            eyebrow: "Where it helps",
            title: "Best used when teams need visual range, not just novelty.",
            subtitle:
                "The value is strongest when AI images support brand work, concepting, or campaign production with real review standards behind them.",
            items: [
                {
                    title: "Concept exploration for campaigns",
                    body: "Generate multiple visual directions early so teams can decide faster before spending more time on final design production.",
                },
                {
                    title: "Asset variation at useful scale",
                    body: "Produce alternate compositions, styles, and visual treatments for content and promo testing without rebuilding everything manually.",
                },
                {
                    title: "Moodboards and references that move faster",
                    body: "Turn rough creative intent into clearer visual anchors for teams, collaborators, and clients who need to react quickly.",
                },
                {
                    title: "Support for design-heavy teams",
                    body: "Use AI output as an acceleration layer while keeping final selection, polish, and brand fit under human control.",
                },
            ],
        },
        system: {
            eyebrow: "System approach",
            title: "The image generator works better when it sits inside a review process, not outside it.",
            subtitle:
                "We think about AI images as part of creative operations: how prompts are shaped, how options are reviewed, and how good outputs become usable assets.",
            items: [
                {
                    title: "Prompting with intent",
                    body: "The input should reflect brand direction, content goals, and visual constraints instead of vague prompt experimentation.",
                },
                {
                    title: "Selection with taste",
                    body: "The real leverage comes from narrowing outputs into the few directions that are actually worth taking forward.",
                },
                {
                    title: "Handoff into production",
                    body: "Strong outputs should move into editing, layout, brand adaptation, and campaign deployment without extra chaos.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "A practical path from rough idea to usable visual asset.",
            subtitle:
                "The process helps teams avoid treating generation as the finish line. The finish line is a visual that can actually be used well.",
            steps: [
                {
                    step: "01",
                    title: "Frame the visual need",
                    body: "Define the campaign context, content goal, tone, and asset type so the generation process starts with more useful boundaries.",
                },
                {
                    step: "02",
                    title: "Generate and refine",
                    body: "Create multiple directions, compare them, and refine toward the outputs that feel closest to the actual brief.",
                },
                {
                    step: "03",
                    title: "Move into final execution",
                    body: "Carry the chosen output into editing, layout, or content production so the work ends in a real deployable asset.",
                },
            ],
        },
        outputs: {
            eyebrow: "Typical outputs",
            title: "What teams usually want from the image workflow",
            items: [
                "Campaign concept frames",
                "Social visual variations",
                "Product and promo mockups",
                "Moodboards and art direction references",
                "Rough visual assets for internal alignment",
                "Faster inputs for final design production",
            ],
        },
        cta: {
            kicker: "plus. ai image generator",
            title: "If the team needs more visual output without collapsing quality control, this is where AI helps.",
            subtitle:
                "We can help shape a workflow where image generation speeds up creative production while keeping review, selection, and final quality grounded.",
            primary: "Start the image discussion",
            secondary: "View pricing",
        },
    },
    id: {
        hero: {
            badge: "AI image generation untuk tim kreatif yang butuh cepat tanpa hasil murahan",
            title: "Hasilkan arah visual, aset campaign, dan concept frame lebih cepat tanpa kehilangan art direction.",
            subtitle:
                "Layanan ini dibentuk untuk tim yang butuh AI image generation sebagai bagian dari workflow kreatif yang nyata, bukan sekadar prompt toy tanpa disiplin produksi.",
            primaryCta: "Bahas workflow visual",
            secondaryCta: "Lihat area pakainya",
            note: "Cocok untuk tim marketing, operator konten, dan bisnis yang kuat di desain dan butuh volume lebih tanpa menurunkan taste atau kontrol kualitas visual.",
            chips: ["Concept frame", "Visual campaign", "Uji variasi", "Dukungan kreatif"],
            panelTitle: "workflow generasi visual",
            panelSubtitle: "prompting, variasi, refinement, handoff",
            panelStatus: "Aktif",
            panelProblemLabel: "Yang sering bikin macet",
            panelProblemBody:
                "Produksi visual sering tersangkut di antara ide mentah, iterasi yang lambat, dan terlalu banyak variasi aset manual saat campaign harus bergerak cepat.",
            panelValueLabel: "Yang jadi lebih baik",
            panelValueBullets: [
                "Eksplorasi kreatif lebih cepat sebelum desain final penuh",
                "Lebih banyak arah visual untuk testing campaign dan konten",
                "Handoff lebih rapi dari output AI ke eksekusi brand final",
            ],
        },
        useCases: {
            eyebrow: "Area pakai",
            title: "Paling berguna saat tim butuh jangkauan visual, bukan sekadar novelty.",
            subtitle:
                "Nilainya paling terasa saat gambar AI mendukung kerja brand, concepting, atau produksi campaign dengan standar review yang nyata di belakangnya.",
            items: [
                {
                    title: "Eksplorasi konsep untuk campaign",
                    body: "Hasilkan banyak arah visual di awal supaya tim bisa memutuskan lebih cepat sebelum menghabiskan lebih banyak waktu di produksi desain final.",
                },
                {
                    title: "Variasi aset dalam skala yang berguna",
                    body: "Buat komposisi, style, dan treatment visual alternatif untuk testing konten dan promo tanpa harus membangun semuanya ulang secara manual.",
                },
                {
                    title: "Moodboard dan referensi yang bergerak lebih cepat",
                    body: "Ubah niat kreatif yang masih kasar menjadi anchor visual yang lebih jelas untuk tim, kolaborator, dan klien yang perlu bereaksi cepat.",
                },
                {
                    title: "Support untuk tim desain intensif",
                    body: "Pakai output AI sebagai lapisan percepatan sambil menjaga seleksi final, polish, dan kecocokan brand tetap di tangan manusia.",
                },
            ],
        },
        system: {
            eyebrow: "Pendekatan sistem",
            title: "Image generator bekerja lebih baik saat duduk di dalam proses review, bukan di luar itu.",
            subtitle:
                "Kami melihat gambar AI sebagai bagian dari operasi kreatif: bagaimana prompt dibentuk, bagaimana opsi direview, dan bagaimana output yang kuat berubah jadi aset yang benar-benar bisa dipakai.",
            items: [
                {
                    title: "Prompting dengan niat yang jelas",
                    body: "Input seharusnya mencerminkan arah brand, tujuan konten, dan batasan visual, bukan eksperimen prompt yang kabur.",
                },
                {
                    title: "Seleksi dengan taste",
                    body: "Leverage yang sebenarnya datang dari menyempitkan output ke sedikit arah yang benar-benar layak diteruskan.",
                },
                {
                    title: "Handoff ke produksi",
                    body: "Output yang kuat harus bisa masuk ke editing, layout, adaptasi brand, dan deployment campaign tanpa menambah kekacauan baru.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "Jalur praktis dari ide kasar ke aset visual yang benar-benar bisa dipakai.",
            subtitle:
                "Proses ini membantu tim berhenti menganggap generation sebagai garis akhir. Garis akhirnya adalah visual yang benar-benar berguna.",
            steps: [
                {
                    step: "01",
                    title: "Bingkai kebutuhan visualnya",
                    body: "Tentukan konteks campaign, tujuan konten, tone, dan jenis aset supaya proses generation berangkat dari batasan yang lebih berguna dan lebih terarah.",
                },
                {
                    step: "02",
                    title: "Generate lalu rapikan",
                    body: "Buat banyak arah, bandingkan, lalu rapikan ke output yang paling dekat dengan brief sebenarnya.",
                },
                {
                    step: "03",
                    title: "Masuk ke eksekusi final",
                    body: "Bawa output terpilih ke editing, layout, atau produksi konten supaya kerja akhirnya berujung ke aset yang benar-benar bisa dipasang.",
                },
            ],
        },
        outputs: {
            eyebrow: "Output umum",
            title: "Yang biasanya tim cari dari workflow image ini",
            items: [
                "Concept frame campaign",
                "Variasi visual sosial",
                "Mockup produk dan promo",
                "Moodboard dan referensi art direction",
                "Aset visual kasar untuk alignment internal",
                "Input yang lebih cepat untuk produksi desain final",
            ],
        },
        cta: {
            kicker: "plus. ai image generator",
            title: "Kalau tim butuh output visual lebih banyak tanpa menjatuhkan quality control, di sinilah AI berguna.",
            subtitle:
                "Kami bisa bantu membentuk workflow di mana image generation mempercepat produksi kreatif sambil menjaga review, seleksi, dan kualitas akhir tetap terarah.",
            primary: "Mulai diskusi visual",
            secondary: "Lihat pricing",
        },
    },
} as const;

const THEME = {
    heroBg:
        "bg-[radial-gradient(circle_at_12%_18%,_rgba(255,124,176,0.18),_transparent_30%),radial-gradient(circle_at_82%_18%,_rgba(255,195,112,0.16),_transparent_26%),linear-gradient(180deg,_#22111d_0%,_#36182a_46%,_#f8f7f3_46%,_#f8f7f3_100%)]",
    panelBg: "bg-white/[0.06]",
    panelAccent: "bg-pink-300/18",
    softBg: "bg-[#fff0f5]",
    softButton: "bg-[#fff0f5]",
    darkAccent: "text-pink-300",
};

export default function AIImageGeneratorPage() {
    const locale = useLocale() as Locale;

    return (
        <AIGeneratorLanding
            copy={COPY[locale]}
            locale={locale}
            theme={THEME}
            cardIcons={[
                <ImagePlus key="image-plus" className="h-5 w-5" />,
                <Layers3 key="layers" className="h-5 w-5" />,
                <ScanSearch key="scan" className="h-5 w-5" />,
                <Brush key="brush" className="h-5 w-5" />,
            ]}
            systemIcons={[
                <Sparkles key="sparkles" className="h-5 w-5" />,
                <Brush key="brush-system" className="h-5 w-5" />,
                <Workflow key="workflow" className="h-5 w-5" />,
            ]}
        />
    );
}
