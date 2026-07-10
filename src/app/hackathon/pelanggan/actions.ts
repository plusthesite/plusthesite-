"use server";

import { verifyReceipt } from "@/lib/hackathon/analytics";
import { insertReview } from "@/lib/hackathon/store";

export interface ReviewResult {
    ok: boolean;
    message: string;
}

export async function submitReview(txId: string, rating: number, komentar: string): Promise<ReviewResult> {
    const r = verifyReceipt(txId);
    if (r.status === "tidak_ada" || !r.tx) return { ok: false, message: "Struk tidak ditemukan." };
    if (rating < 1 || rating > 5) return { ok: false, message: "Beri rating 1–5 bintang." };

    const res = await insertReview({
        txId: r.tx.txId,
        salesId: r.tx.salesId,
        rating,
        komentar: komentar.slice(0, 240),
    });

    if (res.ok) {
        return {
            ok: true,
            message: `Terima kasih! Ulasan ★${rating} untuk ${r.salesNama} tercatat dan langsung muncul di dashboard NALAR.`,
        };
    }
    // Store not active (Supabase belum dimigrasi) → tetap ramah, jujur.
    return {
        ok: true,
        message: `Terima kasih atas ulasan ★${rating} untuk ${r.salesNama}! (Aktifkan store live agar tampil di dashboard.)`,
    };
}
