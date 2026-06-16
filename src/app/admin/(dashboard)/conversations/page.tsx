import { getSupabaseAdmin } from "@/lib/supabase";
import { deleteConversation } from "../actions";

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

function fmt(d: string) {
    return new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
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

    // Group messages into conversations by session, newest activity first.
    const map = new Map<string, Msg[]>();
    for (const m of messages) {
        const key = m.session_id || "unknown";
        const arr = map.get(key);
        if (arr) arr.push(m);
        else map.set(key, [m]);
    }
    const conversations: Conversation[] = Array.from(map.entries())
        .map(([sessionId, msgs]) => ({ sessionId, messages: msgs, lastAt: msgs[msgs.length - 1].created_at }))
        .sort((a, b) => +new Date(b.lastAt) - +new Date(a.lastAt));

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Conversations</h1>
                    <p className="mt-1 text-sm text-slate-500">Chatbot sessions from the AI assistant.</p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">{conversations.length} sessions</span>
            </div>

            {!supabase && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Supabase isn&apos;t configured. Set the env vars to load chat history.
                </div>
            )}

            <div className="mt-6 space-y-4">
                {supabase && conversations.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400 shadow-sm">No conversations yet.</div>
                )}
                {conversations.map((c) => (
                    <div key={c.sessionId} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                            <div className="min-w-0">
                                <p className="truncate font-mono text-xs text-slate-400">{c.sessionId}</p>
                                <p className="mt-0.5 text-sm font-semibold text-slate-700">{c.messages.length} messages</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                                <span className="whitespace-nowrap text-xs text-slate-400">{fmt(c.lastAt)}</span>
                                <form action={deleteConversation}>
                                    <input type="hidden" name="session_id" value={c.sessionId} />
                                    <button className="text-xs font-semibold text-rose-500 hover:text-rose-700">Delete</button>
                                </form>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2.5">
                            {c.messages.map((m) => {
                                const isUser = m.role === "user";
                                return (
                                    <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${isUser
                                                ? "rounded-br-sm bg-blue-600 text-white"
                                                : "rounded-bl-sm bg-slate-100 text-slate-700"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{m.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
