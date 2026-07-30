import { deleteConversation } from "../actions";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Msg {
  id: string;
  session_id: string | null;
  role: string | null;
  content: string | null;
  created_at: string;
}

interface Conversation {
  sessionId: string;
  messages: Msg[];
  lastAt: string;
}

function fmt(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ConversationsPage() {
  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase
        .from("chat_messages")
        .select("id, session_id, role, content, created_at")
        .order("created_at", { ascending: true })
    : { data: [] };

  const messages = (data ?? []) as Msg[];

  const map = new Map<string, Msg[]>();
  for (const message of messages) {
    const key = message.session_id || "unknown";
    const existing = map.get(key);
    if (existing) existing.push(message);
    else map.set(key, [message]);
  }

  const conversations: Conversation[] = Array.from(map.entries())
    .map(([sessionId, items]) => ({
      sessionId,
      messages: items,
      lastAt: items[items.length - 1].created_at,
    }))
    .sort((a, b) => +new Date(b.lastAt) - +new Date(a.lastAt));

  const totalMessages = messages.length;
  const avgMessages =
    conversations.length > 0
      ? Math.round(totalMessages / conversations.length)
      : 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Chat archive
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Every chatbot session in one place, from light questions to full
              sales conversations.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Dipakai buat review percakapan, baca intent pengguna, dan bersihin
              session yang memang sudah tidak relevan.
            </p>
          </div>

          <div className="grid min-w-[260px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Sessions
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">
                {conversations.length}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/70">
                Avg messages
              </p>
              <p className="mt-3 text-3xl font-black text-emerald-700">
                {avgMessages}
              </p>
            </div>
          </div>
        </div>
      </section>

      {!supabase && (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase is not configured. Set env vars to load chat history.
        </div>
      )}

      <section className="space-y-4">
        {supabase && conversations.length === 0 && (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-slate-400 shadow-sm">
            No conversations yet.
          </div>
        )}

        {conversations.map((conversation) => (
          <article
            key={conversation.sessionId}
            className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-slate-400">
                  {conversation.sessionId}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {conversation.messages.length} messages
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {fmt(conversation.lastAt)}
                </span>
                <form action={deleteConversation}>
                  <input
                    type="hidden"
                    name="session_id"
                    value={conversation.sessionId}
                  />
                  <button className="text-xs font-semibold text-rose-500 transition-colors hover:text-rose-700">
                    Delete
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {conversation.messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                        isUser
                          ? "rounded-br-sm bg-slate-950 text-white"
                          : "rounded-bl-sm bg-slate-100 text-slate-700"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
