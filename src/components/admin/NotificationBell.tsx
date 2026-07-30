"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Clock3, Inbox, Settings2, Target } from "lucide-react";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string | null;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

const TYPE_ICON: Record<string, LucideIcon> = {
    new_lead: Inbox,
    new_opportunity: BriefcaseBusiness,
    lead_converted: Target,
    task_overdue: Clock3,
    system: Settings2,
};

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
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

            const data = (await res.json()) as {
                notifications: Notification[];
                unread: number;
            };

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

    useEffect(() => {
        if (!open) return;

        const handler = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
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
        setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })));
    };

    const markRead = async (id: string) => {
        await fetch("/api/admin/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [id] }),
        });

        setUnread((count) => Math.max(0, count - 1));
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id ? { ...notification, is_read: true } : notification
            )
        );
    };

    return (
        <div ref={panelRef} className="relative">
            <button
                onClick={() => setOpen((value) => !value)}
                className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-400/15"
                title="Notifications"
            >
                <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                </svg>
                {unread > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                        {unread > 99 ? "99+" : unread}
                    </span>
                ) : null}
            </button>

            {open ? (
                <div className="fixed left-3 right-3 top-16 z-50 max-h-[75vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl lg:left-[15.5rem] lg:right-auto lg:top-[4.75rem] lg:w-80">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                        {unread > 0 ? (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
                            >
                                Mark all read
                            </button>
                        ) : null}
                    </div>

                    <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-slate-400">No notifications yet</p>
                            </div>
                        ) : null}

                        {notifications.map((notification) => {
                            const Icon = TYPE_ICON[notification.type] ?? Inbox;

                            return (
                                <a
                                    key={notification.id}
                                    href={notification.link ?? "#"}
                                    onClick={() => {
                                        if (!notification.is_read) {
                                            void markRead(notification.id);
                                        }
                                        setOpen(false);
                                    }}
                                    className={`flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
                                        !notification.is_read ? "bg-sky-50/70" : ""
                                    }`}
                                >
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                        <Icon className="h-4 w-4" />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`text-sm ${
                                                !notification.is_read
                                                    ? "font-semibold text-slate-900"
                                                    : "text-slate-700"
                                            }`}
                                        >
                                            {notification.title}
                                        </p>
                                        {notification.message ? (
                                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                                                {notification.message}
                                            </p>
                                        ) : null}
                                        <p className="mt-1 text-[10px] text-slate-400">
                                            {timeAgo(notification.created_at)}
                                        </p>
                                    </div>

                                    {!notification.is_read ? (
                                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                                    ) : null}
                                </a>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
