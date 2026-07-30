"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminNav, LogoutButton } from "./AdminNav";
import type { Role } from "@/lib/roleAccess";

export function MobileSidebar({ email, role }: { email: string; role?: Role }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => setOpen(false));
        return () => window.cancelAnimationFrame(frame);
    }, [pathname]);

    useEffect(() => {
        const checkbox = document.getElementById("mobile-nav") as HTMLInputElement | null;
        if (!checkbox) {
            const el = document.createElement("input");
            el.type = "checkbox";
            el.id = "mobile-nav";
            el.className = "hidden";
            el.addEventListener("change", () => setOpen(el.checked));
            document.body.appendChild(el);
            return () => {
                el.remove();
            };
        }
        const handler = () => setOpen(checkbox.checked);
        checkbox.addEventListener("change", handler);
        return () => checkbox.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            {open ? (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => {
                        setOpen(false);
                        const el = document.getElementById("mobile-nav") as HTMLInputElement;
                        if (el) el.checked = false;
                    }}
                />
            ) : null}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(15,23,42,0.92)_100%)] px-4 py-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-3 pb-6">
                    <div>
                        <div className="text-xl font-extrabold tracking-tight text-white">
                            plus<span className="text-blue-500">.</span>
                        </div>
                        <p className="text-xs text-slate-500">Operations cockpit</p>
                    </div>
                    <button
                        onClick={() => {
                            setOpen(false);
                            const el = document.getElementById("mobile-nav") as HTMLInputElement;
                            if (el) el.checked = false;
                        }}
                        className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <AdminNav role={role} />
                </div>
                <div className="mt-auto border-t border-slate-800 pt-4">
                    <p className="mb-2 truncate px-3 text-xs text-slate-500">{email}</p>
                    <LogoutButton />
                </div>
            </aside>
        </>
    );
}
