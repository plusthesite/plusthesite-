import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
    title: "SUARA WARGA, Integritas & Kecerdasan Koperasi",
    description:
        "SUARA WARGA: dua pilar untuk koperasi Indonesia, SAKSI menjaga setiap rupiah tercatat jujur, NALAR mengubah data jadi keputusan cepat. Hackathon Kementerian Koperasi 2026, Tema 1.",
    robots: { index: false, follow: false },
    openGraph: {
        title: "SUARA WARGA × NALAR, Peningkatan Usaha Koperasi via Teknologi Digital",
        description: "Setiap Rupiah Ada Saksinya, Setiap Keputusan Ada Dasarnya.",
        type: "website",
    },
};

export default function HackathonLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className={jakarta.variable}>
            <body className="nalar-root antialiased">
                <style>{`
          .nalar-root {
            /* Brand palette, NALAR (merah) + navy sekunder */
            --hijau: #D6222A;          /* PRIMARY (merah), brand, tombol, judul */
            --hijau-aksi: #B01B22;     /* merah gelap, hover/aksen */
            --hijau-terang: #FBEAEA;   /* merah muda, latar chip */
            --navy: #1B3A6B;           /* SEKUNDER / sukses / valid */
            --navy-terang: #E9EEF6;    /* navy muda, latar */
            --latar: #F6F3F2;
            --kertas: #FBF6EC;
            --kuning: #F2B807;         /* warning / pending */
            --merah: #C1121F;          /* error / fraud (⛔) */
            --tinta: #2D2D2D;          /* font */
            --kabur: #6B6F76;
            --garis: #E6E3E4;
            font-family: var(--font-jakarta), system-ui, sans-serif;
            background: var(--latar);
            color: var(--tinta);
            min-height: 100vh;
            overflow-x: hidden;
          }
          .nalar-root select { max-width: 100%; }
          .nalar-root table { min-width: max-content; }
          .nalar-root ::selection { background: #D6222A; color: #fff; }
          .nalar-card {
            background: #fff; border: 1px solid var(--garis);
            border-radius: 18px; box-shadow: 0 1px 2px rgba(45,45,45,.05);
          }
          .nalar-chip {
            display:inline-flex; align-items:center; gap:.4rem;
            font-size:.72rem; font-weight:600; letter-spacing:.02em;
            padding:.28rem .7rem; border-radius:999px;
          }
          @keyframes nalar-rise { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} }
          .nalar-rise { animation: nalar-rise .5s cubic-bezier(.2,.7,.2,1) both; }
        `}</style>
                {children}
            </body>
        </html>
    );
}
