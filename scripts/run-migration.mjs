/**
 * Run a Supabase SQL migration directly against the database using
 * SUPABASE_DB_URL (from .env.local). Idempotent migrations only.
 *
 *   node scripts/run-migration.mjs supabase/site_settings.sql [more.sql ...]
 */
import { readFileSync } from "node:fs";
import pg from "pg";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const url = process.env.SUPABASE_DB_URL;
if (!url) { console.error("Missing SUPABASE_DB_URL in .env.local"); process.exit(1); }

const files = process.argv.slice(2);
if (files.length === 0) { console.error("Usage: node scripts/run-migration.mjs <file.sql> [...]"); process.exit(1); }

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

(async () => {
    await client.connect();
    for (const f of files) {
        const sql = readFileSync(f, "utf8");
        process.stdout.write(`▶ ${f} … `);
        try {
            await client.query(sql);
            console.log("✅ ok");
        } catch (e) {
            console.log("❌ " + e.message);
        }
    }
    await client.end();
    console.log("Done.");
})().catch((e) => { console.error("Connection error:", e.message); process.exit(1); });
