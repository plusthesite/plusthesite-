import Link from "next/link";
import { SalesFunnel } from "./SalesFunnel";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    n: 1,
    title: "Buka Priority",
    desc: "Lead sudah diurutkan otomatis. Kerjakan dari atas, mulai dari yang paling panas.",
    href: "/admin/priority",
  },
  {
    n: 2,
    title: "Sapa dengan konteks",
    desc: "Pakai Quick Message, lalu personalisasi pembuka sebelum kirim.",
    href: "/admin/leads",
  },
  {
    n: 3,
    title: "Catat hasil percakapan",
    desc: "Masukkan update ke activity log supaya follow-up berikutnya tidak kehilangan konteks.",
    href: null,
  },
  {
    n: 4,
    title: "Convert bila sudah layak",
    desc: "Kalau ada minat nyata, ubah jadi opportunity dan jadwalkan task berikutnya.",
    href: "/admin/opportunities",
  },
];

const STAGES = [
  {
    title: "New",
    tone: "border-t-slate-300",
    task: "Lead baru. Kirim pesan pembuka yang ringan dan personal.",
  },
  {
    title: "Contacted",
    tone: "border-t-sky-400",
    task: "Percakapan sudah dimulai. Fokus gali kebutuhan, bukan buru-buru jualan.",
  },
  {
    title: "Qualified",
    tone: "border-t-indigo-400",
    task: "Sudah cocok secara kebutuhan. Mulai arahkan ke opportunity.",
  },
  {
    title: "Proposal",
    tone: "border-t-violet-400",
    task: "Penawaran terkirim. Tekankan hasil, bukan daftar fitur panjang.",
  },
  {
    title: "Negotiation",
    tone: "border-t-amber-400",
    task: "Bahas harga dan scope. Tawarkan opsi, jangan langsung obral diskon.",
  },
  {
    title: "Closed Won",
    tone: "border-t-emerald-400",
    task: "Deal masuk. Kirim invoice, jadwalkan kickoff, dan handoff ke tim eksekusi.",
  },
];

const TRUST = [
  {
    title: "Tanya dulu, jangan langsung jualan",
    desc: "Tujuan pesan pertama adalah dibalas. Ajukan satu pertanyaan yang relevan tentang bisnis mereka.",
  },
  {
    title: "Bikin pesan terasa personal",
    desc: "Sebut detail nyata seperti layanan, kota, atau konteks bisnis. Template mentah terlalu mudah terbaca.",
  },
  {
    title: "Pakai nama sendiri",
    desc: "Orang lebih mudah percaya pada orang, bukan akun anonim. Ramah dan cepat balas lebih penting dari formalitas berlebihan.",
  },
];

const QUESTIONS = [
  {
    title: "Apa yang sedang dibutuhkan",
    prompt:
      "Apa yang paling bikin repot sekarang, dan idealnya ingin seperti apa?",
  },
  {
    title: "Bagaimana konteks budget",
    prompt:
      "Untuk kebutuhan ini sudah ada anggaran, atau masih eksplorasi dulu?",
  },
  {
    title: "Siapa yang ikut memutuskan",
    prompt:
      "Selain Anda, siapa lagi yang biasanya ikut menentukan keputusan akhir?",
  },
  {
    title: "Kapan ingin mulai",
    prompt: "Kalau cocok, kira-kira ingin mulai kapan?",
  },
];

const DOUBTS = [
  {
    objection: "Mahal atau belum ada budget.",
    response:
      "Valid. Arahkan pembicaraan ke hasil yang diharapkan, lalu tawarkan entry package atau scope kecil dulu.",
  },
  {
    objection: "Sudah ada vendor atau tim internal.",
    response:
      "Jangan melawan. Posisikan plus sebagai pelengkap untuk area yang belum tertangani.",
  },
  {
    objection: "Nanti dulu, belum sempat.",
    response:
      "Minta izin follow-up di tanggal tertentu, atau kirim ringkasan singkat yang bisa dibaca santai.",
  },
  {
    objection: "Nomor saya dapat dari mana?",
    response:
      "Jawab jujur dari sumber publik, minta maaf jika mengganggu, dan hormati kalau mereka tidak ingin dihubungi lagi.",
  },
];

const CLOSE = [
  "Ringkas hasil yang akan mereka dapat, bukan cuma angka harga.",
  "Tawarkan langkah berikut yang sederhana dan jelas.",
  "Selalu tutup percakapan dengan next step dan tanggal yang disepakati.",
  "Kalau gagal sekarang, catat alasannya untuk follow-up kuartal berikutnya.",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
      {children}
    </h2>
  );
}

export default function PlaybookPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
            Sales playbook
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            Practical guidance for turning inbound leads into real deals without
            sounding robotic.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Prinsip dasarnya sederhana: pelan, personal, dan konsisten lebih
            kuat daripada banyak pesan generik yang terasa spam.
          </p>
        </div>

        <div className="mt-6">
          <SalesFunnel />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <SectionTitle>Rutinitas Harian</SectionTitle>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step) => {
            const card = (
              <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-shadow hover:shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {step.n}
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900">
                  {step.title}
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  {step.desc}
                </p>
              </div>
            );

            return step.href ? (
              <Link key={step.n} href={step.href} className="block">
                {card}
              </Link>
            ) : (
              <div key={step.n}>{card}</div>
            );
          })}
        </div>
        <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Target realistis: 10 sampai 15 lead per hari, dengan kualitas
          percakapan tetap dijaga.
        </p>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <SectionTitle>Tahap Deal</SectionTitle>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {STAGES.map((stage) => (
            <div
              key={stage.title}
              className={`rounded-2xl border border-slate-200 border-t-4 bg-white p-5 shadow-sm ${stage.tone}`}
            >
              <p className="text-sm font-bold text-slate-900">{stage.title}</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                {stage.task}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <SectionTitle>Bangun Trust</SectionTitle>
          <div className="mt-5 space-y-3">
            {TRUST.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <SectionTitle>Discovery Questions</SectionTitle>
          <div className="mt-5 space-y-3">
            {QUESTIONS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm italic text-slate-500">
                  {item.prompt}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <SectionTitle>Menjawab Keraguan</SectionTitle>
        <div className="mt-5 space-y-3">
          {DOUBTS.map((item) => (
            <div
              key={item.objection}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
            >
              <p className="text-sm font-semibold text-rose-600">
                {item.objection}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {item.response}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <SectionTitle>Closing Moves</SectionTitle>
          <ul className="mt-5 space-y-3">
            {CLOSE.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm leading-6 text-slate-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <SectionTitle>Tools Yang Dipakai</SectionTitle>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/admin/priority",
                title: "Priority",
                desc: "Mulai dari ranking lead otomatis.",
              },
              {
                href: "/admin/leads",
                title: "Leads",
                desc: "Kelola prospek, outreach, dan conversion.",
              },
              {
                href: "/admin/opportunities",
                title: "Opportunities",
                desc: "Dorong deal aktif sampai close.",
              },
              {
                href: "/admin/tasks",
                title: "Tasks",
                desc: "Cek follow-up yang harus dikerjakan hari ini.",
              },
              {
                href: "/admin/accounts",
                title: "Accounts",
                desc: "Lihat perusahaan dan pipeline yang terkait.",
              },
              {
                href: "/admin",
                title: "Dashboard",
                desc: "Gunakan today focus untuk memulai hari.",
              },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-shadow hover:shadow-sm"
              >
                <p className="text-sm font-bold text-sky-600">{tool.title}</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <p className="rounded-2xl bg-slate-950 p-5 text-center text-sm font-semibold text-white">
        Satu percakapan personal tetap lebih berharga daripada puluhan pesan
        yang terasa otomatis.
      </p>
    </div>
  );
}
