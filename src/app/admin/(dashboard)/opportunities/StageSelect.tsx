"use client";

import { useRef } from "react";
import { STAGES } from "./constants";

const COLORS: Record<string, string> = {
    new: "bg-slate-100 text-slate-600",
    contacted: "bg-blue-50 text-blue-700",
    qualified: "bg-indigo-50 text-indigo-700",
    proposal: "bg-violet-50 text-violet-700",
    negotiation: "bg-amber-50 text-amber-700",
    won: "bg-emerald-50 text-emerald-700",
    lost: "bg-rose-50 text-rose-700",
};

export function StageSelect({ id, stage, action }: { id: string; stage: string; action: (fd: FormData) => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    return (
        <form ref={formRef} action={action}>
            <input type="hidden" name="id" value={id} />
            <select
                name="stage"
                defaultValue={stage}
                onChange={() => formRef.current?.requestSubmit()}
                className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ring-1 ring-inset ring-black/5 ${COLORS[stage] ?? "bg-slate-100 text-slate-600"}`}
            >
                {STAGES.map((s) => (
                    <option key={s} value={s} className="bg-white text-slate-700">
                        {s}
                    </option>
                ))}
            </select>
        </form>
    );
}
