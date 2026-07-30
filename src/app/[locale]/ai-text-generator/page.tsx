"use client";

import { BookText, Languages, PenTool, SearchCheck, Sparkles, Workflow, FileText } from "lucide-react";
import AIGeneratorLanding from "@/components/AIGeneratorLanding";
import { useLocale } from "@/i18n/I18nProvider";

type Locale = "en" | "id";

const COPY = {
    en: {
        hero: {
            badge: "AI text generation for teams that need faster output with tighter editorial control",
            title: "Draft copy, long-form content, and language variations faster without turning the brand voice into mush.",
            subtitle:
                "This offering is built for teams that want AI writing inside a real content workflow, where direction, editing, and publishing discipline still matter.",
            primaryCta: "Discuss writing workflows",
            secondaryCta: "See where it helps",
            note: "Useful for marketing teams, operators, and content-heavy businesses that need more output without losing clarity.",
            chips: ["Campaign copy", "Long-form drafts", "SEO support", "Localization"],
            panelTitle: "text generation workflow",
            panelSubtitle: "briefing, drafting, review, publishing",
            panelStatus: "Active",
            panelProblemLabel: "What teams struggle with",
            panelProblemBody:
                "Content demand rises faster than editorial capacity, so teams end up publishing rushed copy or stalling production while the queue keeps growing.",
            panelValueLabel: "What this improves",
            panelValueBullets: [
                "Faster first drafts for campaigns and content ops",
                "More room to test message angles before publishing",
                "Cleaner writing support across languages and formats",
            ],
        },
        useCases: {
            eyebrow: "Where it helps",
            title: "Best used when teams need writing throughput with real review standards.",
            subtitle:
                "The value is not replacing judgment. It is helping teams move from blank page to workable draft much faster across multiple content jobs.",
            items: [
                {
                    title: "Campaign copy and offer testing",
                    body: "Generate multiple ad angles, offer framings, subject lines, and call-to-action variants without burning too much operator time.",
                },
                {
                    title: "Long-form drafting support",
                    body: "Move from outline to usable article draft faster so the team can spend more energy on editing, structure, and clarity.",
                },
                {
                    title: "SEO and content operations",
                    body: "Support keyword-led content plans, content refresh cycles, and internal writing queues with faster draft preparation.",
                },
                {
                    title: "Localization and variation work",
                    body: "Prepare content versions for different audiences, channels, or languages while keeping the message frame more consistent.",
                },
            ],
        },
        system: {
            eyebrow: "System approach",
            title: "The text generator works best as a drafting engine inside a sharper editorial process.",
            subtitle:
                "We frame the writing workflow around inputs, review logic, and publishing quality so AI helps reduce drag instead of adding noise.",
            items: [
                {
                    title: "Brief before generation",
                    body: "Better writing starts from clearer instructions about audience, purpose, tone, and the action the text should drive.",
                },
                {
                    title: "Edit with intent",
                    body: "Drafting is fast, but the real leverage comes from stronger selection, rewriting, and message cleanup before publishing.",
                },
                {
                    title: "Fit the output to the channel",
                    body: "Text for ads, email, blog, landing pages, and in-product prompts should be shaped differently instead of one-size-fits-all.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "A cleaner route from content brief to publishable draft.",
            subtitle:
                "The process keeps the team focused on getting to strong working copy faster, then improving it with better judgment and review.",
            steps: [
                {
                    step: "01",
                    title: "Set the message frame",
                    body: "Start from the content purpose, audience, format, and tone so the AI has useful direction before it starts drafting.",
                },
                {
                    step: "02",
                    title: "Generate and compare",
                    body: "Create multiple versions, compare structure and clarity, and keep only the angles worth developing further.",
                },
                {
                    step: "03",
                    title: "Refine for publication",
                    body: "Edit the chosen draft for brand fit, factual alignment, channel style, and the specific action it should drive next.",
                },
            ],
        },
        outputs: {
            eyebrow: "Typical outputs",
            title: "What teams usually want from the text workflow",
            items: [
                "Ad and campaign copy drafts",
                "Landing page messaging variations",
                "Blog and article first drafts",
                "Email and nurture sequence copy",
                "SEO-oriented content preparation",
                "Localized or channel-specific versions",
            ],
        },
        cta: {
            kicker: "plus. ai text generator",
            title: "If the team needs more writing volume without letting every draft turn generic, this is where AI helps.",
            subtitle:
                "We can help shape a workflow where text generation speeds up the draft stage while editing, brand fit, and publishing quality stay in human hands.",
            primary: "Start the writing discussion",
            secondary: "View pricing",
        },
    },
    id: {
        hero: {
            badge: "AI text generation untuk tim yang butuh output lebih cepat dengan kontrol editorial yang lebih rapat",
            title: "Draft copy, konten panjang, dan variasi bahasa lebih cepat tanpa membuat suara brand terasa generik atau berantakan.",
            subtitle:
                "Layanan ini dibangun untuk tim yang ingin AI writing duduk di dalam workflow konten yang nyata, di mana arah pesan, editing, dan disiplin publikasi tetap dijaga.",
            primaryCta: "Bahas workflow penulisan",
            secondaryCta: "Lihat area pakainya",
            note: "Cocok untuk tim marketing, operator, dan bisnis yang berat di konten dan butuh output lebih banyak tanpa mengorbankan kejernihan atau kontrol suara brand.",
            chips: ["Copy campaign", "Draft long-form", "Dukungan SEO", "Lokalisasi"],
            panelTitle: "workflow generasi teks",
            panelSubtitle: "brief, drafting, review, publikasi",
            panelStatus: "Aktif",
            panelProblemLabel: "Yang sering bikin macet",
            panelProblemBody:
                "Permintaan konten sering naik lebih cepat daripada kapasitas editorial, sehingga tim berakhir dengan copy yang terburu-buru atau workflow yang tertahan oleh antrean revisi.",
            panelValueLabel: "Yang jadi lebih baik",
            panelValueBullets: [
                "Draft awal lebih cepat untuk campaign dan operasi konten",
                "Lebih banyak ruang untuk menguji angle pesan sebelum publish",
                "Dukungan penulisan yang lebih rapi lintas bahasa, channel, dan format",
            ],
        },
        useCases: {
            eyebrow: "Area pakai",
            title: "Paling berguna saat tim butuh throughput penulisan dengan standar review yang nyata.",
            subtitle:
                "Nilainya bukan mengganti judgment editorial. Nilainya membantu tim bergerak dari blank page ke draft yang benar-benar bisa dipakai jauh lebih cepat di banyak jenis kerja konten.",
            items: [
                {
                    title: "Copy campaign dan testing offer",
                    body: "Hasilkan banyak angle iklan, framing offer, subject line, dan variasi call-to-action tanpa membakar terlalu banyak waktu operator.",
                },
                {
                    title: "Support drafting long-form",
                    body: "Bergerak dari outline ke draft artikel yang usable lebih cepat supaya energi tim bisa dialihkan ke editing, struktur, akurasi, dan kejernihan pesan.",
                },
                {
                    title: "SEO dan operasi konten",
                    body: "Dukung rencana konten berbasis keyword, siklus refresh konten, dan antrean penulisan internal dengan persiapan draft yang lebih cepat dan lebih terstruktur.",
                },
                {
                    title: "Lokalisasi dan kerja variasi",
                    body: "Siapkan versi konten untuk audiens, channel, atau bahasa berbeda sambil menjaga frame pesannya lebih konsisten.",
                },
            ],
        },
        system: {
            eyebrow: "Pendekatan sistem",
            title: "Text generator paling efektif saat dipakai sebagai mesin draft di dalam proses editorial yang lebih tajam.",
            subtitle:
                "Kami membingkai workflow penulisan di sekitar kualitas input, logika review, dan standar publish supaya AI mengurangi friksi, bukan menambah noise atau repetisi generik.",
            items: [
                {
                    title: "Brief dulu sebelum generate",
                    body: "Tulisan yang lebih baik dimulai dari instruksi yang lebih jelas soal audiens, tujuan, tone, dan aksi yang memang harus didorong teks itu.",
                },
                {
                    title: "Edit dengan niat",
                    body: "Drafting memang cepat, tapi leverage sebenarnya datang dari seleksi, rewriting, dan pembersihan pesan yang lebih kuat sebelum sesuatu dipublikasikan.",
                },
                {
                    title: "Sesuaikan output dengan channel",
                    body: "Teks untuk ads, email, blog, landing page, dan prompt di dalam produk harus dibentuk berbeda, bukan satu ukuran untuk semua.",
                },
            ],
        },
        workflow: {
            eyebrow: "Workflow",
            title: "Jalur yang lebih bersih dari content brief ke draft yang layak dipublish.",
            subtitle:
                "Proses ini menjaga tim tetap fokus untuk sampai ke working copy yang kuat lebih cepat, lalu memperbaikinya dengan judgment, penyuntingan, dan review yang lebih baik.",
            steps: [
                {
                    step: "01",
                    title: "Set frame pesannya",
                    body: "Mulai dari tujuan konten, audiens, format, dan tone supaya AI punya arah yang berguna sebelum mulai drafting.",
                },
                {
                    step: "02",
                    title: "Generate lalu bandingkan",
                    body: "Buat beberapa versi, bandingkan struktur dan kejernihannya, lalu simpan hanya angle yang memang layak dikembangkan lebih lanjut.",
                },
                {
                    step: "03",
                    title: "Rapikan untuk publikasi",
                    body: "Edit draft terpilih untuk kecocokan brand, keselarasan fakta, gaya channel, dan aksi spesifik yang harus didorong berikutnya.",
                },
            ],
        },
        outputs: {
            eyebrow: "Output umum",
            title: "Yang biasanya tim cari dari workflow text ini",
            items: [
                "Draft copy ads dan campaign",
                "Variasi messaging landing page",
                "Draft awal blog dan artikel",
                "Copy email dan nurture sequence",
                "Persiapan konten berorientasi SEO",
                "Versi lokal atau spesifik channel",
            ],
        },
        cta: {
            kicker: "plus. ai text generator",
            title: "Kalau tim butuh volume tulisan lebih tinggi tanpa membiarkan setiap draft jatuh jadi generik, di sinilah AI berguna.",
            subtitle:
                "Kami bisa bantu membentuk workflow di mana text generation mempercepat tahap drafting sementara editing, kecocokan brand, dan kualitas publish tetap berada di tangan tim manusia.",
            primary: "Mulai diskusi penulisan",
            secondary: "Lihat pricing",
        },
    },
} as const;

const THEME = {
    heroBg:
        "bg-[radial-gradient(circle_at_12%_18%,_rgba(255,205,105,0.18),_transparent_30%),radial-gradient(circle_at_82%_18%,_rgba(255,146,79,0.16),_transparent_26%),linear-gradient(180deg,_#26170f_0%,_#3b2416_46%,_#f8f7f3_46%,_#f8f7f3_100%)]",
    panelBg: "bg-white/[0.06]",
    panelAccent: "bg-amber-300/18",
    softBg: "bg-[#fff4df]",
    softButton: "bg-[#fff4df]",
    darkAccent: "text-amber-300",
};

export default function AITextGeneratorPage() {
    const locale = useLocale() as Locale;

    return (
        <AIGeneratorLanding
            copy={COPY[locale]}
            locale={locale}
            theme={THEME}
            cardIcons={[
                <PenTool key="pen" className="h-5 w-5" />,
                <BookText key="book" className="h-5 w-5" />,
                <SearchCheck key="seo" className="h-5 w-5" />,
                <Languages key="lang" className="h-5 w-5" />,
            ]}
            systemIcons={[
                <FileText key="file" className="h-5 w-5" />,
                <Sparkles key="sparkles" className="h-5 w-5" />,
                <Workflow key="workflow" className="h-5 w-5" />,
            ]}
        />
    );
}
