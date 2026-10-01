/**
 * Inspect one legacy table: exact count and the column list PostgREST exposes.
 *
 *   node scripts/legacy-table-info.mjs accounts
 */
import { readFileSync } from "node:fs";

const table = process.argv[2] ?? "accounts";
const env = Object.fromEntries(
    readFileSync(process.argv[3] ?? "/srv/data/migrate/legacy.env", "utf8")
        .split("\n")
        .filter((l) => l.includes("="))
        .map((l) => {
            const i = l.indexOf("=");
            return [l.slice(0, i), l.slice(i + 1)];
        }),
);
const url = env.OLD_SUPABASE_URL.replace(/\/$/, "");
const H = { apikey: env.OLD_SUPABASE_KEY, Authorization: `Bearer ${env.OLD_SUPABASE_KEY}` };

const head = await fetch(`${url}/rest/v1/${table}?select=*`, {
    method: "HEAD",
    headers: { ...H, Prefer: "count=exact", Range: "0-0" },
});
console.log(`${table}: ${head.headers.get("Content-Range")}`);
console.log("columns:", Object.keys(head.headers.get("Content-Range") ?? "") ? "" : "");

const spec = await (await fetch(`${url}/rest/v1/`, { headers: H })).json();
console.log(
    "required:",
    (spec.definitions[table] ?? {}).required?.join(", ") ?? "(none)",
);
console.log(
    "props:",
    Object.entries(spec.definitions[table]?.properties ?? {})
        .map(([k, v]) => `${k}:${v.type}`)
        .join(", "),
);
const row = await (await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, { headers: H })).json();
console.log("sample:", JSON.stringify(row[0], null, 2)?.slice(0, 700));
