import { NextResponse } from "next/server";
import { getClientIp, readJson, route, ServiceError } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rateLimit";
import { hydrateLive, insertSale } from "@/lib/hackathon/store";
import { chainTip, chainHash, TODAY, productBySku, employeeById, type SaleTx, type SaleItem } from "@/lib/hackathon/seed";

export const dynamic = "force-dynamic";

// Create a new attested POS sale -> appended to the shared ledger so every
// role's dashboard/insight/chatbot reflects it live. Public demo endpoint, so
// it is rate limited per IP; the ledger is append-only by design.
export const POST = route(async (req) => {
    enforceRateLimit(`hack-sale:${getClientIp(req)}`, 20, 60_000, { error: "Terlalu banyak permintaan." });

    const body = await readJson<{ salesId?: string; items?: { sku?: string; qty?: number }[] }>(
        req,
        { status: 400, payload: { error: "Body tidak valid" } }
    );

    const salesId = String(body.salesId ?? "");
    if (!employeeById(salesId)) throw new ServiceError(400, { error: "Sales tidak valid" });

    const items: SaleItem[] = [];
    let total = 0;
    for (const it of (body.items ?? []).slice(0, 50)) {
        const p = productBySku(String(it?.sku));
        if (!p) continue;
        const qty = Math.max(1, Math.min(20, Number(it?.qty) || 1));
        items.push({ sku: p.sku, qty, harga: p.harga, diskon: 0 });
        total += p.harga * qty;
    }
    if (!items.length) throw new ServiceError(400, { error: "Keranjang kosong" });

    // Load the current chain from Supabase so the new hash links correctly.
    const ev = await hydrateLive();
    if (!ev.ok) {
        throw new ServiceError(503, {
            error: "Store live belum aktif (jalankan migrasi Supabase nalar_sales).",
        });
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
    if (!res.ok) throw new ServiceError(500, { error: res.error ?? "Gagal menyimpan" });
    return NextResponse.json({ ok: true, tx });
});
