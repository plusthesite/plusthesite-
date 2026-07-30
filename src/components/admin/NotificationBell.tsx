"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string | null;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

const TYPE_ICON: Record<string, string> = {
    new_lead: "📩",
    new_opportunity: "💰",
    lead_converted: "🎯",
    task_overdue: "⏰",
    system: "⚙️",
};

function timeAgo(d: string) {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/notifications", { cache: "no-store" });
            if (!res.ok) return;
            const data = (await res.json()) as { notifications: Notification[]; unread: number };
            setNotifications(data.notifications);
            setUnread(data.unread);
        } catch {
            /* keep last data */
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            void fetchNotifications();
        }, 0);
        const interval = setInterval(fetchNotifications, 15_000);
        return () => {
            window.clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [fetchNotifications]);

    // Close panel when clicking outside
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const markAllRead = async () => {
        await fetch("/api/admin/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markAllRead: true }),
        });
        setUnread(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    };

    const markRead = async (id: string) => {
        await fetch("/api/admin/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [id] }),
        });
        setUnread((u) => Math.max(0, u - 1));
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-400/15"
                title="Notifications"
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                </svg>
                {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="fixed left-3 right-3 top-16 z-50 max-h-[75vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl lg:left-[15.5rem] lg:right-auto lg:top-[4.75rem] lg:w-80">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                        {unread > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 && (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-slate-400">No notifications yet</p>
                            </div>
                        )}
                        {notifications.map((n) => (
                            <a
                                key={n.id}
                                href={n.link ?? "#"}
                                onClick={() => {
                                    if (!n.is_read) markRead(n.id);
                                    setOpen(false);
                                }}
                                className={`flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
                                    !n.is_read ? "bg-blue-50/50" : ""
                                }`}
                            >
                                <span className="mt-0.5 text-base">{TYPE_ICON[n.type] ?? "📌"}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${!n.is_read ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                                        {n.title}
                                    </p>
                                    {n.message && (
                                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{n.message}</p>
                                    )}
                                    <p className="mt-1 text-[10px] text-slate-400">{timeAgo(n.created_at)}</p>
                                </div>
                                {!n.is_read && (
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
