"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatIDR, serviceName } from "@/lib/services";
import { STAGES } from "./constants";
import { moveOpportunity } from "./actions";

export interface BoardOpp {
    id: string;
    name: string;
    company: string | null;
    value: number | null;
    owner: string | null;
    stage: string;
    service: string | null;
}

const STAGE_HEAD: Record<string, string> = {
    new: "border-t-slate-300", contacted: "border-t-blue-400", qualified: "border-t-indigo-400",
    proposal: "border-t-violet-400", negotiation: "border-t-amber-400", won: "border-t-emerald-400", lost: "border-t-rose-400",
};

export function KanbanBoard({ initial }: { initial: BoardOpp[] }) {
    const [opps, setOpps] = useState(initial);
    const [dragId, setDragId] = useState<string | null>(null);
    const [over, setOver] = useState<string | null>(null);
    const router = useRouter();

    async function move(id: string, stage: string) {
        const current = opps.find((o) => o.id === id);
        if (!current || current.stage === stage) return;
        setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o))); // optimistic
        await moveOpportunity(id, stage);
        router.refresh();
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map((stage) => {
                const col = opps.filter((o) => o.stage === stage);
                const total = col.reduce((s, o) => s + (o.value ?? 0), 0);
                return (
                    <div
                        key={stage}
                        onDragOver={(e) => { e.preventDefault(); setOver(stage); }}
                        onDragLeave={() => setOver((o) => (o === stage ? null : o))}
                        onDrop={() => { if (dragId) move(dragId, stage); setDragId(null); setOver(null); }}
                        className={`flex w-64 shrink-0 flex-col rounded-xl border-t-4 bg-slate-50 p-2 ${STAGE_HEAD[stage]} ${over === stage ? "ring-2 ring-blue-300" : ""}`}
                    >
                        <div className="flex items-center justify-between px-2 py-1.5">
                            <span className="text-xs font-bold uppercase tracking-wide text-slate-600">{stage}</span>
                            <span className="text-[10px] font-semibold text-slate-400">{col.length} · {formatIDR(total, true)}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {col.map((o) => (
                                <Link
                                    key={o.id}
                                    href={`/admin/opportunities/${o.id}`}
                                    draggable
                                    onDragStart={() => setDragId(o.id)}
                                    onDragEnd={() => { setDragId(null); setOver(null); }}
                                    className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow active:cursor-grabbing"
                                >
                                    <p className="text-sm font-semibold text-slate-800">{o.name}</p>
                                    {o.company && <p className="text-xs text-slate-500">{o.company}</p>}
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-900">{formatIDR(o.value ?? 0, true)}</span>
                                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{serviceName(o.service)}</span>
                                    </div>
                                    {o.owner && <p className="mt-1 text-[10px] text-slate-400">{o.owner}</p>}
                                </Link>
                            ))}
                            {col.length === 0 && <p className="px-2 py-4 text-center text-[11px] text-slate-300">Drop here</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
