// NALAR customer surface — the gerai shopper (koperasi member) side.
//
// The customer is the demand side of the SAKSI → NALAR loop: they hold a
// verified digital receipt (proof the koperasi's books are honest) and can
// rate the service — which becomes the "Aktivitas / review pelanggan" signal
// the manager dashboard reads. Data is derived from the same attested ledger.

import { LEDGER, allLedger, productBySku, employeeById, PROMOS, type SaleTx } from "./seed";

export interface DemoCustomer {
    id: string;
    nama: string;
    telp: string;
    anggotaSejak: string;
    kartu: string;
}

export const DEMO_CUSTOMER: DemoCustomer = {
    id: "cust-sani",
    nama: "Bu Sani",
    telp: "0812-xxxx-3311",
    anggotaSejak: "2024",
    kartu: "KDMP-0031",
};

export interface ReceiptView {
    txId: string; // transaksi_penjualan.transaksi_sample_id
    tgl: string;
    jam: number;
    sales: string;
    metode: string; // transaksi_penjualan.metode_pembayaran
    total: number;
    hemat: number; // discount saved (tebus murah)
    tebusMurah: boolean;
    items: { nama: string; barcode: string; unit: string; qty: number; harga: number; diskon: number }[];
    txHash: string;
}

function toView(tx: SaleTx): ReceiptView {
    let hemat = 0;
    const items = tx.items.map((it) => {
        hemat += it.diskon;
        const p = productBySku(it.sku);
        return {
            nama: p?.nama ?? it.sku,
            barcode: p?.kodeBarcode ?? "-",
            unit: p?.unit ?? "Pcs",
            qty: it.qty,
            harga: it.harga,
            diskon: it.diskon,
        };
    });
    return {
        txId: tx.txId,
        tgl: tx.tgl,
        jam: tx.jam,
        sales: employeeById(tx.salesId)?.nama ?? "-",
        metode: tx.metode === "qris" ? "QRIS" : "Tunai",
        total: tx.total,
        hemat,
        tebusMurah: tx.tebusMurah,
        items,
        txHash: tx.txHash,
    };
}

/** Bu Sani's purchase history — a deterministic slice of the attested ledger. */
export function customerReceipts(): ReceiptView[] {
    // Take a spread of recent receipts (a few with tebus murah so savings show).
    const withTebus = LEDGER.filter((t) => t.tebusMurah).slice(-4);
    const plain = LEDGER.filter((t) => !t.tebusMurah).slice(-4);
    const chosen = [...withTebus, ...plain]
        .sort((a, b) => (a.tgl < b.tgl ? 1 : a.tgl > b.tgl ? -1 : b.seq - a.seq))
        .slice(0, 6);
    return chosen.map(toView);
}

export function customerReceipt(txId: string): ReceiptView | null {
    const tx = allLedger().find((t) => t.txId === txId.trim().toUpperCase());
    return tx ? toView(tx) : null;
}

/** Loyalty: 1 poin per Rp 1.000 belanja, over the customer's receipts. */
export function loyalty() {
    const rs = customerReceipts();
    const belanja = rs.reduce((s, r) => s + r.total, 0);
    const hemat = rs.reduce((s, r) => s + r.hemat, 0);
    const poin = Math.floor(belanja / 1000);
    const tier = poin >= 800 ? "Emas" : poin >= 200 ? "Perak" : "Perunggu";
    return { belanja, hemat, poin, tier, transaksi: rs.length };
}

export const CUSTOMER_PROMOS = PROMOS;
