/**
 * Audit the legacy Supabase project against the current database.
 *
 * Read-only: issues HEAD count requests per table and prints the comparison.
 * Run before `apply` so the caller sees exactly what would move.
 *
 *   node --env-file=/srv/data/migrate/legacy.env scripts/audit-legacy.mjs
 */
import { readFileSync } from "node:fs";

const envFile = process.argv[2] ?? "/srv/data/migrate/legacy.env";
const env = Object.fromEntries(
    readFileSync(envFile, "utf8")
        .split("\n")
        .filter((l) => l.includes("="))
        .map((l) => {
            const i = l.indexOf("=");
            return [l.slice(0, i), l.slice(i + 1)];
        }),
);

const url = (env.OLD_SUPABASE_URL ?? "").replace(/\/$/, "");
const key = env.OLD_SUPABASE_KEY;
if (!url || !key) {
    console.error("OLD_SUPABASE_URL / OLD_SUPABASE_KEY missing from", envFile);
    process.exit(1);
}

const H = { apikey: key, Authorization: `Bearer ${key}` };

const spec = await (
    await fetch(`${url}/rest/v1/`, { headers: H })
).json();
const legacy = Object.keys(spec.definitions ?? {}).sort();

/** Exact count via PostgREST's Content-Range on a HEAD request. */
async function count(table) {
    const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
        method: "HEAD",
        headers: { ...H, Prefer: "count=exact", Range: "0-0" },
    });
    if (!response.ok) return `HTTP ${response.status}`;
    const range = response.headers.get("Content-Range") ?? "";
    const total = range.split("/")[1];
    return total === "?" ? "?" : Number(total).toLocaleString("en-US");
}

console.log(`legacy project: ${url}\n`);
console.log("table                      legacy");
for (const table of legacy) {
    console.log(`  ${table.padEnd(24)} ${await count(table)}`);
}
