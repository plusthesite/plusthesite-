import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KanbanBoard, type BoardOpp } from "../KanbanBoard";

export const dynamic = "force-dynamic";

export default async function OpportunitiesBoardPage() {
    const supabase = getSupabaseAdmin();
    const { data } = supabase
        ? await supabase
            .from("opportunities")
            .select("id, name, company, value, owner, stage, service")
            .order("value", { ascending: false })
        : { data: [] };
    const opps = (data ?? []) as BoardOpp[];

    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pipeline Board</h1>
                    <p className="mt-1 text-sm text-slate-500">Drag a deal between stages to update it.</p>
                </div>
                <Link href="/admin/opportunities" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">List view</Link>
            </div>

            <div className="mt-6">
                <KanbanBoard initial={opps} />
            </div>
        </div>
    );
}
