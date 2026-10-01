/**
 * Print schema + a sample row for several legacy tables in one run.
 *
 *   node scripts/legacy-schema.mjs accounts opportunities subscribers
 */
import { readFileSync } from "node:fs";

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
const spec = await (await fetch(`${url}/rest/v1/`, { headers: H })).json();

for (const t of tables) {
    const head = await fetch(`${url}/rest/v1/${t}?select=*`, {
        method: "HEAD",
        headers: { ...H, Prefer: "count=exact", Range: "0-0" },
    });
    const props = Object.entries(spec.definitions[t]?.properties ?? {})
        .map(([k, v]) => `${k}:${v.type}`)
        .join(", ");
    const req = (spec.definitions[t]?.required ?? []).join(",") || "(none)";
    console.log(`\n=== ${t} — ${head.headers.get("Content-Range")}`);
    console.log(`  required: ${req}`);
    console.log(`  props   : ${props}`);
    const rows = await (await fetch(`${url}/rest/v1/${t}?select=*&limit=1`, { headers: H })).json();
    if (rows[0]) console.log(`  sample  : ${JSON.stringify(rows[0]).slice(0, 400)}`);
}
