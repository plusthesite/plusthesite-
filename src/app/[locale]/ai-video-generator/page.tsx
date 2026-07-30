"use client";

import { Captions, Clapperboard, LayoutTemplate, Mic2, Sparkles, UserRound, Workflow } from "lucide-react";
import AIGeneratorLanding from "@/components/AIGeneratorLanding";
import { useLocale } from "@/i18n/I18nProvider";

type Locale = "en" | "id";

const COPY = {
    en: {
        hero: {
            badge: "AI video generation for teams that need more content velocity without wrecking the edit room",
            title: "Turn scripts, visual ideas, and repeatable formats into faster video production workflows.",
            subtitle:
                "This offering is built for teams that want AI video as part of a real content engine, not as a shortcut that creates flashy output with no operational fit.",
            primaryCta: "Discuss video workflows",
            secondaryCta: "See where it helps",
            note: "Useful for content teams, marketers, educators, and operators who need more video surface area with tighter turnaround.",
            chips: ["Script-to-video", "Social cuts", "Subtitle flow", "Format scaling"],
            panelTitle: "video generation workflow",
            panelSubtitle: "script, scene, draft, edit, export",
            panelStatus: "Active",
            panelProblemLabel: "What teams struggle with",
            panelProblemBody:
                "Video demand keeps growing, but scripting, editing, subtitle work, and multi-format output still eat more time than most teams can sustain.",
            panelValueLabel: "What this improves",
            panelValueBullets: [
                "Faster first-pass video creation for repeatable formats",
                "Less manual drag on subtitle and repurposing work",
                "More room to test video concepts before full production spend",
            ],
        },
        useCases: {
            eyebrow: "Where it helps",
            title: "Best used when teams need faster video throughput across recurring content formats.",
            subtitle:
                "The leverage is strongest when AI video supports regular production needs like promos, explainers, social clips, or internal learning content.",
            items: [
                {
                    title: "Promotional and campaign video drafts",
                    body: "Prepare fast concept videos and repeatable promo cuts before investing heavier editing time into the final version.",
                },
                {
                    title: "Education and explainer content",
                    body: "Support scripted training clips, product explainers, and structured information videos with faster turnaround.",
                },
                {
                    title: "Short-form social adaptation",
                    body: "Rework messaging into vertical or platform-specific video cuts more efficiently when the team needs regular publishing cadence.",
                },
                {
                    title: "Operational support for content teams",
                    body: "Use AI to reduce friction around assembly, subtitles, formatting, and repetitive versioning that slows teams down.",
                },
            ],
        },
        system: {
            eyebrow: "System approach",
            title: "The video generator works better when it serves a repeatable production pipeline.",
            subtitle:
                "We think about video generation around format discipline, review rhythm, and how draft output becomes something the team can actually publish well.",
            items: [
                {
                    title: "Structure the format first",
                    body: "The strongest results usually come from repeatable content structures, not from treating every video like a blank creative experiment.",
                },
                {
                    title: "Use AI for the heavy repetition",
                    body: "Draft assembly, visual prep, captioning, and versioning are where AI can remove a lot of boring production drag.",
                },
                {
                    title: "Keep the final review human",
                    body: "Narrative pacing, message accuracy, and brand fit still benefit from strong editorial control before publishing.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "A cleaner route from script idea to publishable video output.",
            subtitle:
                "The aim is not to remove production thinking. It is to shorten the repetitive path between raw input and a version worth reviewing.",
            steps: [
                {
                    step: "01",
                    title: "Frame the video format",
                    body: "Start from purpose, platform, script shape, and expected runtime so the generation process is aimed at a real publishing need.",
                },
                {
                    step: "02",
                    title: "Generate and assemble",
                    body: "Draft visuals, scene structure, narration support, and captions into a first usable video layer more quickly.",
                },
                {
                    step: "03",
                    title: "Edit for release",
                    body: "Review the generated version for pacing, clarity, quality, and final channel fit before it goes live.",
                },
            ],
        },
        outputs: {
            eyebrow: "Typical outputs",
            title: "What teams usually want from the video workflow",
            items: [
                "Campaign and promo video drafts",
                "Short-form social content versions",
                "Explainer or walkthrough clips",
                "Subtitle and caption-ready outputs",
                "Repeated format content for publishing cadence",
                "Faster pre-edit versions for final production",
            ],
        },
        cta: {
            kicker: "plus. ai video generator",
            title: "If the team needs more video output without multiplying production chaos, this is where AI helps.",
            subtitle:
                "We can help shape a workflow where video generation speeds up repeatable production while editing judgment and publish quality stay under control.",
            primary: "Start the video discussion",
            secondary: "View pricing",
        },
    },
    id: {
        hero: {
            badge: "AI video generation untuk tim yang butuh kecepatan konten lebih tinggi tanpa merusak ruang edit",
            title: "Ubah skrip, ide visual, dan format berulang menjadi workflow produksi video yang lebih cepat.",
            subtitle:
                "Layanan ini dibangun untuk tim yang ingin AI video menjadi bagian dari content engine nyata, bukan jalan pintas yang menghasilkan output mencolok tanpa kecocokan operasional.",
            primaryCta: "Bahas workflow video",
            secondaryCta: "Lihat area pakainya",
            note: "Cocok untuk tim konten, marketer, edukator, dan operator yang butuh lebih banyak permukaan video dengan turnaround lebih rapat.",
            chips: ["Script-to-video", "Potongan sosial", "Alur subtitle", "Scaling format"],
            panelTitle: "workflow video generation",
            panelSubtitle: "script, scene, draft, edit, export",
            panelStatus: "Active",
            panelProblemLabel: "Yang sering bikin macet",
            panelProblemBody:
                "Permintaan video terus naik, tapi scripting, editing, subtitle, dan output multi-format masih memakan waktu lebih banyak daripada yang bisa ditahan kebanyakan tim.",
            panelValueLabel: "Yang jadi lebih baik",
            panelValueBullets: [
                "Pembuatan video first-pass lebih cepat untuk format berulang",
                "Friksi manual lebih kecil di subtitle dan repurposing",
                "Lebih banyak ruang untuk menguji konsep video sebelum biaya produksi penuh",
            ],
        },
        useCases: {
            eyebrow: "Area pakai",
            title: "Paling berguna saat tim butuh throughput video lebih cepat di banyak format konten berulang.",
            subtitle:
                "Leverage paling kuat muncul saat AI video mendukung kebutuhan produksi rutin seperti promo, explainer, klip sosial, atau konten pembelajaran internal.",
            items: [
                {
                    title: "Draft video promo dan campaign",
                    body: "Siapkan video konsep cepat dan potongan promo berulang sebelum menginvestasikan waktu edit yang lebih berat ke versi final.",
                },
                {
                    title: "Konten edukasi dan explainer",
                    body: "Dukung klip training yang terskrip, explainer produk, dan video informasi terstruktur dengan turnaround yang lebih cepat.",
                },
                {
                    title: "Adaptasi short-form sosial",
                    body: "Ubah pesan menjadi potongan video vertikal atau spesifik platform dengan lebih efisien saat tim butuh cadence publish rutin.",
                },
                {
                    title: "Support operasional untuk tim konten",
                    body: "Pakai AI untuk mengurangi friksi di assembly, subtitle, formatting, dan versioning berulang yang memperlambat tim.",
                },
            ],
        },
        system: {
            eyebrow: "Pendekatan sistem",
            title: "Video generator bekerja lebih baik saat melayani pipeline produksi yang berulang dan terstruktur.",
            subtitle:
                "Kami memikirkan video generation di sekitar disiplin format, ritme review, dan cara output draft berubah menjadi sesuatu yang benar-benar bisa dipublish dengan baik.",
            items: [
                {
                    title: "Susun formatnya dulu",
                    body: "Hasil paling kuat biasanya datang dari struktur konten yang berulang, bukan menganggap setiap video sebagai eksperimen kreatif kosong.",
                },
                {
                    title: "Gunakan AI untuk repetisi yang berat",
                    body: "Assembly draft, persiapan visual, captioning, dan versioning adalah area di mana AI bisa menghilangkan banyak beban produksi yang membosankan.",
                },
                {
                    title: "Jaga review final tetap manusia",
                    body: "Pacing narasi, akurasi pesan, dan kecocokan brand tetap lebih baik jika dijaga oleh kontrol editorial yang kuat sebelum publish.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "Jalur yang lebih bersih dari ide skrip ke output video yang layak dipublish.",
            subtitle:
                "Targetnya bukan menghapus pemikiran produksi. Targetnya memendekkan jalur repetitif antara input mentah dan versi yang layak direview.",
            steps: [
                {
                    step: "01",
                    title: "Bingkai format videonya",
                    body: "Mulai dari tujuan, platform, bentuk skrip, dan durasi yang diharapkan supaya proses generation mengarah ke kebutuhan publish yang nyata.",
                },
                {
                    step: "02",
                    title: "Generate lalu rakit",
                    body: "Buat draft visual, struktur scene, dukungan narasi, dan caption menjadi lapisan video pertama yang usable dengan lebih cepat.",
                },
                {
                    step: "03",
                    title: "Edit untuk rilis",
                    body: "Tinjau versi hasil generate untuk pacing, kejernihan, kualitas, dan kecocokan channel akhir sebelum tayang.",
                },
            ],
        },
        outputs: {
            eyebrow: "Output umum",
            title: "Yang biasanya tim cari dari workflow video ini",
            items: [
                "Draft video campaign dan promo",
                "Versi konten short-form sosial",
                "Klip explainer atau walkthrough",
                "Output siap caption dan subtitle",
                "Konten format berulang untuk cadence publish",
                "Versi pre-edit lebih cepat untuk produksi final",
            ],
        },
        cta: {
            kicker: "plus. ai video generator",
            title: "Kalau tim butuh output video lebih banyak tanpa melipatgandakan kekacauan produksi, di sinilah AI berguna.",
            subtitle:
                "Kami bisa bantu membentuk workflow di mana video generation mempercepat produksi berulang sementara judgment edit dan kualitas publish tetap terkendali.",
            primary: "Mulai diskusi video",
            secondary: "Lihat pricing",
        },
    },
} as const;

const THEME = {
    heroBg:
        "bg-[radial-gradient(circle_at_12%_18%,_rgba(255,123,123,0.18),_transparent_30%),radial-gradient(circle_at_82%_18%,_rgba(255,186,90,0.16),_transparent_26%),linear-gradient(180deg,_#26120f_0%,_#3f1d17_46%,_#f8f7f3_46%,_#f8f7f3_100%)]",
    panelBg: "bg-white/[0.06]",
    panelAccent: "bg-red-300/18",
    softBg: "bg-[#fff1ea]",
    softButton: "bg-[#fff1ea]",
    darkAccent: "text-red-300",
};

export default function AIVideoGeneratorPage() {
    const locale = useLocale() as Locale;

    return (
        <AIGeneratorLanding
            copy={COPY[locale]}
            locale={locale}
            theme={THEME}
            cardIcons={[
                <Clapperboard key="clapper" className="h-5 w-5" />,
                <UserRound key="user" className="h-5 w-5" />,
                <LayoutTemplate key="layout" className="h-5 w-5" />,
                <Captions key="captions" className="h-5 w-5" />,
            ]}
            systemIcons={[
                <Workflow key="workflow" className="h-5 w-5" />,
                <Sparkles key="sparkles" className="h-5 w-5" />,
                <Mic2 key="mic" className="h-5 w-5" />,
            ]}
        />
    );
}
