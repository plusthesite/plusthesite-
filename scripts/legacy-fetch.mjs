/**
 * Dump small legacy tables to a JSON file for offline inspection.
 *
 *   node scripts/legacy-fetch.mjs sales_reps accounts opportunities subscribers notifications site_settings contacts chat_messages
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const tables = process.argv.slice(2);
const env = Object.fromEntries(
    readFileSync("/srv/data/migrate/legacy.env", "utf8")
        .split("\n")
        .filter((l) => l.includes("="))
        .map((l) => {
            const i = l.indexOf("=");
            return [l.slice(0, i), l.slice(i + 1)];
        }),
);
const url = env.OLD_SUPABASE_URL.replace(/\/$/, "");
const H = { apikey: env.OLD_SUPABASE_KEY, Authorization: `Bearer ${env.OLD_SUPABASE_KEY}` };

async function fetchAll(table) {
    const rows = [];
    let last = "";
    for (;;) {
        const q = new URLSearchParams({ select: "*", order: "id.asc", limit: "1000" });
        if (last) q.set("id", `gt.${last}`);
        const r = await fetch(`${url}/rest/v1/${table}?${q}`, { headers: H });
        if (!r.ok) throw new Error(`${table}: HTTP ${r.status}`);
        const batch = await r.json();
        if (!batch.length) break;
        rows.push(...batch);
        last = batch[batch.length - 1].id;
        if (batch.length < 1000) break;
    }
    return rows;
}

const out = {};
for (const t of tables) {
    out[t] = await fetchAll(t);
    console.log(`${t}: ${out[t].length}`);
}
mkdirSync("/srv/data/migrate", { recursive: true });
writeFileSync("/srv/data/migrate/legacy-tables.json", `${JSON.stringify(out, null, 2)}\n`);
console.log("→ /srv/data/migrate/legacy-tables.json");
