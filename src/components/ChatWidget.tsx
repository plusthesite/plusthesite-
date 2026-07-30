"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageSquareText, Send, Sparkles } from "lucide-react";
import {
  detectEmail,
  detectPhone,
  fallbackReply,
  INITIAL_QUICK,
  matchIntent,
  type Intent,
} from "@/lib/chatbot";

type Loc = "en" | "id";

interface Msg {
  role: "user" | "assistant";
  content: string;
  quick?: { en: string; id: string }[];
  cta?: Intent["cta"];
}

const WELCOME: Record<Loc, string> = {
  id: "Halo. Saya asisten plus. Saya bisa bantu arahkan layanan, pricing, workflow, atau hubungkan Anda ke tim. Pilih quick reply di bawah atau ketik pertanyaan Anda.",
  en: "Hi. I am plus.'s assistant. I can help point you to services, pricing, workflow, or connect you to the team. Pick a quick reply below or type your question.",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function resolveCtaHref(locale: Loc, href: string) {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  if (href.startsWith("/")) {
    return `/${locale}${href}`;
  }

  return href;
}

export function ChatWidget({ locale = "id" }: { locale?: Loc }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: WELCOME[locale] ?? WELCOME.id,
      quick: INITIAL_QUICK,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const sessionId = useRef("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionId.current =
      localStorage.getItem("plus_chat_sid") ||
      (crypto.randomUUID?.() ?? String(Date.now()));
    localStorage.setItem("plus_chat_sid", sessionId.current);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, busy]);

  const save = (role: string, content: string) =>
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId.current,
        role,
        content,
      }),
    }).catch(() => {});

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;

    setMessages((current) => [...current, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    save("user", text);

    await delay(700);

    const email = detectEmail(text);
    const phone = detectPhone(text);
    let reply: Msg;

    if (email || phone) {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Chat lead",
          email,
          phone,
          message: text,
          source: "chatbot",
          locale,
        }),
      }).catch(() => {});

      reply = {
        role: "assistant",
        content:
          locale === "id"
            ? "Terima kasih. Kontak Anda sudah kami catat dan tim kami akan follow up secepatnya. Kalau mau, Anda juga bisa lanjut tanya soal layanan atau pricing."
            : "Thank you. We have recorded your contact and the team will follow up as soon as possible. You can also keep asking about services or pricing.",
        quick: INITIAL_QUICK,
      };
    } else {
      const intent = matchIntent(text);
      reply = intent
        ? {
            role: "assistant",
            content: intent.reply[locale],
            quick: intent.quick,
            cta: intent.cta,
          }
        : {
            role: "assistant",
            content: fallbackReply(locale),
            quick: INITIAL_QUICK,
          };
    }

    setMessages((current) => [...current, reply]);
    save("assistant", reply.content);
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Chat with plus."
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0f172a_0%,_#0369a1_55%,_#06b6d4_100%)] text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition-transform hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {open ? (
        <div className="fixed bottom-24 right-5 z-50 flex h-[35rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] dark:border-slate-700 dark:bg-slate-900">
          <div className="bg-[linear-gradient(135deg,_#0f172a_0%,_#0369a1_55%,_#06b6d4_100%)] px-4 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg font-bold">
                  +
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">
                    plus. Assistant
                  </p>
                  <p className="text-[11px] text-white/80">
                    {locale === "id"
                      ? "Online sekarang dan siap bantu arahkan"
                      : "Online now and ready to guide"}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85">
                <Sparkles className="h-3 w-3" />
                {locale === "id" ? "Fast lane" : "Fast lane"}
              </span>
            </div>

            <div className="mt-4 grid gap-3 rounded-[1.3rem] bg-white/10 p-3 backdrop-blur">
              <div className="flex items-start gap-2">
                <MessageSquareText className="mt-0.5 h-4 w-4 text-white/80" />
                <p className="text-[11px] leading-5 text-white/80">
                  {locale === "id"
                    ? "Tanya produk, pricing, workflow, atau tinggalkan kontak agar tim kami follow up."
                    : "Ask about products, pricing, workflow, or leave your contact for a team follow-up."}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-white/80">
                <span className="rounded-full bg-white/8 px-2 py-1 text-center">
                  {locale === "id" ? "Services" : "Services"}
                </span>
                <span className="rounded-full bg-white/8 px-2 py-1 text-center">
                  {locale === "id" ? "Pricing" : "Pricing"}
                </span>
                <span className="rounded-full bg-white/8 px-2 py-1 text-center">
                  {locale === "id" ? "Contact" : "Contact"}
                </span>
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_100%)] p-4 dark:bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]"
          >
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;

              return (
                <div key={index}>
                  <div
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "rounded-br-sm bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] dark:bg-white dark:text-slate-950"
                          : "rounded-bl-sm bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>

                  {message.role === "assistant" &&
                  isLast &&
                  !busy &&
                  (message.cta || message.quick) ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.cta ? (
                        <a
                          href={resolveCtaHref(locale, message.cta.href)}
                          className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
                        >
                          {message.cta.label[locale]}
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      ) : null}
                      {message.quick?.map((quick, quickIndex) => (
                        <button
                          key={quickIndex}
                          type="button"
                          onClick={() => send(quick[locale])}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-sky-500 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {quick[locale]}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {busy ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center gap-2 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  locale === "id"
                    ? "Tulis pesan atau tinggalkan kontak..."
                    : "Type a message or leave your contact..."
                }
                aria-label={
                  locale === "id"
                    ? "Pesan untuk assistant"
                    : "Message for assistant"
                }
                className="flex-1 bg-transparent px-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition-opacity disabled:opacity-40 dark:bg-white dark:text-slate-950"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
