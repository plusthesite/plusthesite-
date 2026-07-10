"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { QUICK_PROMPTS } from "@/lib/hackathon/assistant";
import { askAssistant, type AssistantReply } from "./actions";
import LogoutButton from "../_components/LogoutButton";
import type { NalarRole } from "@/lib/hackathon/auth";

interface Msg {
    role: "user" | "bot";
    text: string;
    csv?: string;
    csvName?: string;
    source?: "ai" | "template";
}

export default function AssistantApp({ nama, role }: { nama: string; role: NalarRole }) {
    const [msgs, setMsgs] = useState<Msg[]>([
        {
            role: "bot",
            text: `Selamat datang, ${nama.split(" ")[0]}. Saya NALAR — asisten koperasi Anda.\nPilih salah satu pertanyaan cepat di bawah, dan saya siapkan ringkasannya (terhubung ke waktu perangkat Anda).`,
        },
    ]);
    const [busy, setBusy] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    const scroll = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 40);

    async function ask(id: string, label: string) {
        if (busy) return;
        setBusy(true);
        setMsgs((m) => [...m, { role: "user", text: label }, { role: "bot", text: "…", source: "template" }]);
        scroll();
        const localISO = new Date().toISOString();
        let reply: AssistantReply;
        try {
            reply = await askAssistant(id, localISO);
        } catch {
            reply = { text: "Maaf, terjadi gangguan. Coba lagi.", source: "template" };
        }
        setMsgs((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "bot", text: reply.text, csv: reply.csv, csvName: reply.csvName, source: reply.source };
            return copy;
        });
        setBusy(false);
        scroll();
    }

    function download(csv: string, name: string) {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="nalar-root flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ borderColor: "var(--garis)", background: "rgba(241,244,239,.85)" }}>
                <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
                    <Link href="/hackathon" className="flex items-center gap-2 font-extrabold">
                        <span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: "var(--hijau)" }}>S</span>
                        <span>NALAR<span className="ml-1 text-xs font-semibold" style={{ color: "var(--kabur)" }}>Asisten Direktur</span></span>
                    </Link>
                    <div className="flex items-center gap-3">
                        {role === "manager" && (
                            <Link href="/hackathon/dashboard" className="text-xs font-semibold" style={{ color: "var(--hijau)" }}>← Dashboard</Link>
                        )}
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-6">
                <div className="flex-1 space-y-4">
                    {msgs.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            {m.role === "bot" && (
                                <div className="mr-2 mt-1 grid h-8 w-8 shrink-0 place-items-center self-start rounded-full text-white" style={{ background: "var(--hijau)" }}>N</div>
                            )}
                            <div
                                className={`nalar-rise max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "text-white" : ""}`}
                                style={m.role === "user"
                                    ? { background: "var(--hijau)", borderTopRightRadius: 4 }
                                    : { background: "#fff", border: "1px solid var(--garis)", borderTopLeftRadius: 4 }}
                            >
                                {m.text === "…" ? <TypingDots /> : m.text}
                                {m.csv && m.csvName && (
                                    <button
                                        onClick={() => download(m.csv!, m.csvName!)}
                                        className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
                                        style={{ background: "var(--hijau-terang)", color: "var(--hijau)" }}
                                    >
                                        ⭳ Unduh file rekap ({m.csvName})
                                    </button>
                                )}
                                {m.role === "bot" && m.source && m.text !== "…" && (
                                    <div className="mt-2 text-[10px]" style={{ color: "var(--kabur)" }}>
                                        {m.source === "ai" ? "✦ dirangkai AI · angka teratestasi SAKSI" : "✓ ringkasan deterministik · angka teratestasi SAKSI"}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={endRef} />
                </div>

                {/* Quick prompts */}
                <div className="sticky bottom-0 mt-6 pb-4" style={{ background: "linear-gradient(transparent, var(--latar) 30%)" }}>
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--kabur)" }}>Pertanyaan cepat</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {QUICK_PROMPTS.map((q) => (
                            <button
                                key={q.id}
                                onClick={() => ask(q.id, q.label)}
                                disabled={busy}
                                className="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition hover:bg-white disabled:opacity-50"
                                style={{ borderColor: "var(--garis)", background: "#fff" }}
                            >
                                <span className="text-lg">{q.icon}</span>
                                {q.label}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-center text-[11px]" style={{ color: "var(--kabur)" }}>
                        Prompt terbatas & grounded — NALAR tidak akan mengarang angka di luar data.
                    </p>
                </div>
            </main>
        </div>
    );
}

function TypingDots() {
    return (
        <span className="inline-flex gap-1">
            {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 animate-bounce rounded-full" style={{ background: "var(--hijau-aksi)", animationDelay: `${i * 0.15}s` }} />
            ))}
        </span>
    );
}
