"use client";

import { useEffect, useRef, useState } from "react";
import { matchIntent, fallbackReply, detectEmail, detectPhone, INITIAL_QUICK, type Intent } from "@/lib/chatbot";

type Loc = "en" | "id";
interface Msg {
    role: "user" | "assistant";
    content: string;
    quick?: { en: string; id: string }[];
    cta?: Intent["cta"];
}

const WELCOME: Record<Loc, string> = {
    id: "Halo! 👋 Saya asisten plus. Ada yang bisa saya bantu — chatbot, aplikasi, branding, CRM, atau harga? Pilih di bawah atau ketik pertanyaan Anda.",
    en: "Hi! 👋 I'm plus.'s assistant. How can I help — chatbots, apps, branding, CRM, or pricing? Pick below or type your question.",
};
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ChatWidget({ locale = "id" }: { locale?: Loc }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: WELCOME[locale] ?? WELCOME.id, quick: INITIAL_QUICK }]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const sid = useRef("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        sid.current = localStorage.getItem("plus_chat_sid") || (crypto.randomUUID?.() ?? String(Date.now()));
        localStorage.setItem("plus_chat_sid", sid.current);
    }, []);
    useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, open, busy]);

    const save = (role: string, content: string) =>
        fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid.current, role, content }) }).catch(() => { });

    async function send(raw: string) {
        const text = raw.trim();
        if (!text || busy) return;
        setMessages((m) => [...m, { role: "user", content: text }]);
        setInput("");
        setBusy(true);
        save("user", text);

        await delay(700);

        const email = detectEmail(text);
        const phone = detectPhone(text);
        let reply: Msg;

        if (email || phone) {
            // Capture as a lead (email path) + always recorded in the conversation.
            if (email) {
                fetch("/api/lead", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: "Chat lead", email, phone, message: text, source: "chatbot", locale }),
                }).catch(() => { });
            }
            reply = {
                role: "assistant",
                content: locale === "id"
                    ? "Terima kasih! 🙏 Kontak Anda sudah kami catat — tim kami akan segera menghubungi. Ada lagi yang bisa saya bantu?"
                    : "Thank you! 🙏 We've noted your contact — our team will reach out soon. Anything else I can help with?",
                quick: INITIAL_QUICK,
            };
        } else {
            const intent = matchIntent(text);
            reply = intent
                ? { role: "assistant", content: intent.reply[locale], quick: intent.quick, cta: intent.cta }
                : { role: "assistant", content: fallbackReply(locale), quick: INITIAL_QUICK };
        }

        setMessages((m) => [...m, reply]);
        save("assistant", reply.content);
        setBusy(false);
    }

    return (
        <>
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Chat with plus."
                className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
            >
                {open
                    ? <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    : <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            </button>

            {open && (
                <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-secondary px-4 py-3 text-white">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg font-bold">+</div>
                        <div>
                            <p className="text-sm font-bold leading-tight">plus. Assistant</p>
                            <p className="text-[11px] text-white/80">{locale === "id" ? "Online · balas instan" : "Online · instant replies"}</p>
                        </div>
                    </div>

                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
                        {messages.map((m, i) => {
                            const isLast = i === messages.length - 1;
                            return (
                                <div key={i}>
                                    <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"}`}>
                                            <p className="whitespace-pre-wrap">{m.content}</p>
                                        </div>
                                    </div>
                                    {m.role === "assistant" && isLast && !busy && (m.cta || m.quick) && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {m.cta && (
                                                <a href={`/${locale}${m.cta.href}`} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark">
                                                    {m.cta.label[locale]} →
                                                </a>
                                            )}
                                            {m.quick?.map((q, j) => (
                                                <button key={j} onClick={() => send(q[locale])} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {q[locale]}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {busy && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm dark:bg-slate-800"><span className="flex gap-1"><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" /><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" /><span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" /></span></div></div>}
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
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
