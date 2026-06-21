/**
 * One-command batch importer for REAL leads, focused on the services we sell:
 * CRM + Digital Agency. Just run:
 *
 *   node scripts/import-batch.mjs              # import for real
 *   node scripts/import-batch.mjs --dry-run    # preview only, writes nothing
 *
 * It runs the official Google Places importer (scripts/import-places-leads.mjs)
 * once per curated target below, skipping duplicates automatically. Reads keys
 * from .env.local (same as the single importer).
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const IMPORTER = join(HERE, "import-places-leads.mjs");
const DRY = process.argv.includes("--dry-run");

// Curated, revenue-focused targets across major Indonesian cities.
// service must be one we actually sell (mobile-app is coming-soon and refused).
const TARGETS = [
    // Digital Agency — businesses that need branding / content / marketing
    { q: "restoran di Jakarta Selatan", service: "digital-agency" },
    { q: "kafe estetik Bandung", service: "digital-agency" },
    { q: "butik fashion Surabaya", service: "digital-agency" },
    { q: "salon kecantikan Jakarta", service: "digital-agency" },
    { q: "hotel butik Bali", service: "digital-agency" },
    { q: "toko furniture Yogyakarta", service: "digital-agency" },
    { q: "coffee shop Medan", service: "digital-agency" },
    // CRM — businesses with lots of customers to manage
    { q: "dealer mobil Jakarta", service: "crm" },
    { q: "klinik kecantikan Surabaya", service: "crm" },
    { q: "agen properti Bali", service: "crm" },
    { q: "gym dan fitness Bandung", service: "crm" },
    { q: "bimbel dan kursus Jakarta", service: "crm" },
    { q: "apotek Surabaya", service: "crm" },
    { q: "klinik gigi Jakarta", service: "crm" },
];

console.log(`\n🚀 Batch import — ${TARGETS.length} targets (CRM + Digital Agency)${DRY ? "  [DRY RUN]" : ""}\n`);

let ok = 0, failed = 0;
for (const [i, t] of TARGETS.entries()) {
    console.log(`\n── [${i + 1}/${TARGETS.length}] ${t.service}: "${t.q}" ${"─".repeat(20)}`);
    const args = [IMPORTER, "--query", t.q, "--service", t.service, "--require-phone", "--limit", "60"];
    if (DRY) args.push("--dry-run");
    const r = spawnSync(process.execPath, args, { stdio: "inherit" });
    if (r.status === 0) ok++; else { failed++; console.log(`   ⚠️  target failed (continuing)…`); }
}

console.log(`\n✅ Done. ${ok} ok, ${failed} failed.${DRY ? " (dry run — nothing written)" : ""}`);
console.log(`   Open /admin/leads → filter Digital Agency / CRM → sort 🔥 Hottest → work the hot ones.\n`);
