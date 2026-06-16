/**
 * Import REAL local businesses into the leads pipeline via the official
 * Google Places API (New). Legitimate, ToS-compliant alternative to scraping.
 *
 * Setup (.env.local):
 *   GOOGLE_MAPS_API_KEY=...            # Maps Platform key with Places API (New) enabled
 *   NEXT_PUBLIC_SUPABASE_URL=https://qsklgxeovoegxxiutkzh.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=sb_secret_...   # (rotate the old one first!)
 *
 * DB:  run supabase/crm.sql + supabase/leads_places.sql once.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-places-leads.mjs \
 *        --query "restoran di Bandung" --service chatbot --limit 60
 *   add --dry-run to preview without writing.
 *
 * Notes:
 *  - Respect Google Maps Platform Terms (usage limits; place_id is stored to
 *    dedupe). Only contact a business in line with UU PDP / anti-spam norms.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// --- tiny .env.local fallback loader (in case --env-file isn't used) ----------
try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
} catch { /* no .env.local — rely on real env */ }

// --- args ---------------------------------------------------------------------
const args = Object.fromEntries(
    process.argv.slice(2).flatMap((a, i, arr) =>
        a.startsWith("--") ? [[a.slice(2), arr[i + 1]?.startsWith("--") || arr[i + 1] === undefined ? true : arr[i + 1]]] : []
    )
);
const QUERY = args.query;
const SERVICE = args.service ?? null;
const LIMIT = Math.min(Number(args.limit) || 60, 60); // Places caps at 60/query
const DRY = Boolean(args["dry-run"]);

const KEY = process.env.GOOGLE_MAPS_API_KEY;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!QUERY) { console.error('Missing --query "kategori kota"'); process.exit(1); }
if (!KEY) { console.error("Missing GOOGLE_MAPS_API_KEY"); process.exit(1); }
if (!DRY && (!SB_URL || !SB_KEY)) { console.error("Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)"); process.exit(1); }

const FIELD_MASK = [
    "places.id", "places.displayName", "places.formattedAddress",
    "places.nationalPhoneNumber", "places.internationalPhoneNumber",
    "places.websiteUri", "places.googleMapsUri", "nextPageToken",
].join(",");

async function searchPage(pageToken) {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": KEY,
            "X-Goog-FieldMask": FIELD_MASK,
        },
        body: JSON.stringify({ textQuery: QUERY, languageCode: "id", regionCode: "ID", pageSize: 20, pageToken }),
    });
    if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`);
    return res.json();
}

async function main() {
    console.log(`🔎 "${QUERY}"  service=${SERVICE ?? "(none)"}  limit=${LIMIT}${DRY ? "  [dry-run]" : ""}`);
    const places = [];
    let token;
    do {
        const data = await searchPage(token);
        places.push(...(data.places ?? []));
        token = data.nextPageToken;
        if (token) await new Promise((r) => setTimeout(r, 2000)); // token needs a moment
    } while (token && places.length < LIMIT);

    const rows = places.slice(0, LIMIT).map((p) => ({
        place_id: p.id,
        name: p.displayName?.text ?? null,
        company: p.displayName?.text ?? null,
        phone: p.internationalPhoneNumber ?? p.nationalPhoneNumber ?? null,
        website: p.websiteUri ?? null,
        address: p.formattedAddress ?? null,
        email: null, // Places rarely exposes email — reach out by phone/WhatsApp
        service: SERVICE,
        source: "google-places",
        status: "new",
        notes: [p.formattedAddress, p.websiteUri, p.googleMapsUri].filter(Boolean).join(" · "),
        locale: "id",
    }));

    console.log(`Found ${rows.length} businesses.`);
    if (DRY) { console.table(rows.map((r) => ({ name: r.name, phone: r.phone, website: r.website }))); return; }

    const supabase = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
    const { data, error } = await supabase
        .from("leads")
        .upsert(rows, { onConflict: "place_id", ignoreDuplicates: true })
        .select("id");
    if (error) { console.error("Insert error:", error.message); process.exit(1); }
    console.log(`✅ Imported ${data?.length ?? 0} new leads (duplicates skipped) tagged service="${SERVICE}".`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
