"use client";

import { useEffect, useRef, useState } from "react";
import { callGeminiText } from "@/lib/ai";

interface Msg { role: "user" | "assistant"; content: string; }

const SYSTEM = `You are the friendly AI assistant on plusthe.site for "plus.", a digital AI-agency serving businesses across Indonesia.
Services: AI Chatbot (24/7 WhatsApp & web), Digital Agency (branding, content, UI/UX), Mobile App development, Mobile Game development, CRM platform, Customer Support tooling, and AI generators (image/text/video/music).
Pricing in IDR: Starter from Rp 2.5jt/month, Professional from Rp 7.5jt/month, Enterprise from Rp 20jt/month (annual saves ~20%); project-based custom quotes available. No lock-in.
Contact: support@plusthe.site or the Contact page (/contact-us).
Rules: Reply in the SAME language as the user (default Bahasa Indonesia). Keep it concise (2–4 sentences), warm and helpful, never pushy. Do NOT invent facts, numbers, or testimonials. For serious interest, kindly invite them to leave a WhatsApp number / email or visit the contact page. If unsure, suggest contacting the team.`;

const WELCOME: Record<string, string> = {
    id: "Halo! 👋 Saya asisten AI plus. Ada yang bisa saya bantu soal chatbot, aplikasi, branding, atau CRM untuk bisnis Anda?",
    en: "Hi! 👋 I'm plus.'s AI assistant. How can I help — chatbots, apps, branding, or CRM for your business?",
};

export function ChatWidget({ locale = "id" }: { locale?: "en" | "id" }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: WELCOME[locale] ?? WELCOME.id }]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const sid = useRef<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        sid.current = localStorage.getItem("plus_chat_sid") || (crypto.randomUUID?.() ?? String(Date.now()));
        localStorage.setItem("plus_chat_sid", sid.current);
    }, []);

    useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, open, busy]);

    const save = (role: string, content: string) =>
        fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid.current, role, content }) }).catch(() => { });

    async function send() {
        const text = input.trim();
        if (!text || busy) return;
        const next = [...messages, { role: "user" as const, content: text }];
        setMessages(next);
        setInput("");
        setBusy(true);
        save("user", text);

        const convo = next.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
        const reply = await callGeminiText(`${SYSTEM}\n\nConversation:\n${convo}\nAssistant:`);
        const answer = reply?.trim() || (locale === "id"
            ? "Maaf, asisten sedang sibuk. Silakan hubungi kami di support@plusthe.site atau lewat halaman Kontak — tim kami siap membantu. 🙏"
            : "Sorry, the assistant is busy. Please reach us at support@plusthe.site or via the Contact page — our team is happy to help. 🙏");
        setMessages((m) => [...m, { role: "assistant", content: answer }]);
        save("assistant", answer);
        setBusy(false);
    }

    return (
        <>
            {/* Launcher */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Chat with plus. AI"
                className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
            >
                {open ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                )}
            </button>

            {/* Panel */}
            {open && (
                <div className="fixed bottom-24 right-5 z-50 flex h-[30rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-secondary px-4 py-3 text-white">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg font-bold">+</div>
                        <div>
                            <p className="text-sm font-bold leading-tight">plus. AI Assistant</p>
                            <p className="text-[11px] text-white/80">Biasanya balas dalam hitungan detik</p>
                        </div>
                    </div>

                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"}`}>
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                </div>
                            </div>
                        ))}
                        {busy && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm dark:bg-slate-800"><span className="flex gap-1"><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" /><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" /><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" /></span></div></div>}
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={locale === "id" ? "Tulis pesan…" : "Type a message…"}
                            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <button disabled={busy || !input.trim()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
