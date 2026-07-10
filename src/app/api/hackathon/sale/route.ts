import { NextResponse } from "next/server";
import { hydrateLive, insertSale } from "@/lib/hackathon/store";
import { chainTip, chainHash, TODAY, productBySku, employeeById, type SaleTx, type SaleItem } from "@/lib/hackathon/seed";

export const dynamic = "force-dynamic";

// Create a new attested POS sale → appended to the shared ledger so every
// role's dashboard/insight/chatbot reflects it live.
export async function POST(req: Request) {
    let body: { salesId?: string; items?: { sku?: string; qty?: number }[] };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
    }

    const salesId = String(body.salesId ?? "");
    if (!employeeById(salesId)) return NextResponse.json({ error: "Sales tidak valid" }, { status: 400 });

    const items: SaleItem[] = [];
    let total = 0;
    for (const it of body.items ?? []) {
        const p = productBySku(String(it?.sku));
        if (!p) continue;
        const qty = Math.max(1, Math.min(20, Number(it?.qty) || 1));
        items.push({ sku: p.sku, qty, harga: p.harga, diskon: 0 });
        total += p.harga * qty;
    }
    if (!items.length) return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });

    // Load the current chain from Supabase so the new hash links correctly.
    const ev = await hydrateLive();
    if (!ev.ok) {
        return NextResponse.json(
            { error: "Store live belum aktif (jalankan migrasi Supabase nalar_sales)." },
            { status: 503 }
        );
    }
    const { prevHash, seq } = chainTip();
    const jam = new Date().getHours();
    const txId = `TX-${TODAY.replace(/-/g, "")}-L${String(seq).padStart(4, "0")}`;
    const txHash = chainHash(prevHash, txId, salesId, total, jam);
    const tx: SaleTx = {
        txId, tgl: TODAY, jam, salesId, items, total,
        metode: "tunai", tebusMurah: total > 50000, txHash, prevHash, seq,
    };

    const res = await insertSale(tx);
    if (!res.ok) return NextResponse.json({ error: res.error ?? "Gagal menyimpan" }, { status: 500 });
    return NextResponse.json({ ok: true, tx });
}
