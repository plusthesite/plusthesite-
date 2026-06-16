"use client";

import { useRef, useState } from "react";
import { STAGES } from "./constants";

const COLORS: Record<string, string> = {
    new: "bg-slate-100 text-slate-600 ring-slate-200",
    contacted: "bg-blue-50 text-blue-700 ring-blue-200",
    qualified: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    proposal: "bg-violet-50 text-violet-700 ring-violet-200",
    negotiation: "bg-amber-50 text-amber-700 ring-amber-200",
    won: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    lost: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StageSelect({ id, stage, action }: { id: string; stage: string; action: (fd: FormData) => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [current, setCurrent] = useState(stage);
    const [submitting, setSubmitting] = useState(false);

    return (
        <form
            ref={formRef}
            action={async (fd) => {
                setSubmitting(true);
                await action(fd);
                setSubmitting(false);
            }}
        >
            <input type="hidden" name="id" value={id} />
            <select
                name="stage"
                value={current}
                onChange={(e) => {
                    setCurrent(e.target.value);
                    formRef.current?.requestSubmit();
                }}
                disabled={submitting}
                className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ring-1 ring-inset transition-all ${submitting ? "opacity-50" : ""} ${COLORS[current] ?? COLORS.new}`}
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
