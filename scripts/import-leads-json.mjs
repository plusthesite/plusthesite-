#!/usr/bin/env node
/**
 * Bridge: HQ lead JSON files -> public.leads (Supabase).
 *
 * HQ drops researched leads as JSON (Exa/clients searches). This script is the
 * one-command import path into the CRM. It reads the default sources below,
 * normalises the many shapes those files come in, dedupes against what is
 * already in the DB, and writes only what is safe to write.
 *
 * Default sources:
 *   /srv/hq/leads/leads.json            (a file — skipped with a warning if absent)
 *   /srv/hq/projects/trilux/leads       (a directory — every *.json inside)
 * Override with --source <path> (repeatable). A source may be a file or a dir.
 *
 * Usage:
 *   node --env-file=.env.local /srv/repos/plusthesite-/scripts/import-leads-json.mjs --dry-run
 *   node --env-file=.env.local /srv/repos/plusthesite-/scripts/import-leads-json.mjs
 *   ... --source /srv/hq/leads/leads.json --service crm --limit 50
 *
 * Env (.env.local): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * DB: run supabase/crm.sql + accounts.sql + leads_places.sql + erd-v2-phase1..3.sql once
 *     (leads_places.sql drops NOT NULL on leads.email — business leads may be phone-only).
 *
 * Safety rules, on purpose:
 *  - Never overwrites a non-empty column. Existing values win; we only fill gaps.
 *  - Never touches `status` — a human owns the pipeline stage.
 *  - `place_id` is only ever set from a real Google Places id. We do NOT mint fake
 *    ones: dedupe for non-Places rows happens in memory (domain / phone / email / name).
 *  - Reads .env* only; never writes or prints a secret.
 *
 * Exit codes: 0 ok · 1 bad input / no source found · 2 Supabase creds missing.
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");

export const DEFAULT_SOURCES = [
    { path: "/srv/hq/leads/leads.json", source: "hq-leads" },
    { path: "/srv/hq/projects/trilux/leads", source: "trilux-leads" },
];

export const VALID_STATUS = new Set(["new", "contacting", "qualified", "proposal", "won", "lost"]);

/** Columns we are willing to write. Anything else in the source is ignored. */
export const LEAD_COLUMNS = [
    "place_id", "name", "company", "email", "phone", "website", "address",
    "service", "value", "status", "notes", "locale", "source",
];

/** Columns we fill only when the DB side is empty. `status` is deliberately absent. */
export const FILLABLE = ["name", "company", "phone", "email", "website", "address", "service", "value", "notes"];

/**
 * `leads.source` is a facet in the admin (Reports groups by it, leadScore weights it),
 * so it must stay a small controlled vocabulary — not 69 per-domain strings.
 * Producer labels whose head matches something we already know are folded onto it;
 * everything else keeps the batch label.
 */
export const SOURCE_ALIASES = {
    web: "website",
    website: "website",
    places: "google-places",
    google: "google-places",
    linkedin: "linkedin",
    instagram: "instagram",
    referral: "referral",
    manual: "manual",
};

const DB_PAGE = 1000;
const INSERT_CHUNK = 100;

// ---------------------------------------------------------------------------
// pure helpers (exported for scripts/import-leads-json.test.mjs)
// ---------------------------------------------------------------------------

const uniq = (arr) => [...new Set(arr)];

function firstString(...values) {
    for (const v of values) {
        if (typeof v === "string" && v.trim()) return v.trim();
        if (typeof v === "number") return String(v);
    }
    return null;
}

function toNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const digits = value.replace(/[^\d]/g, "");
        if (digits) return Number(digits);
    }
    return null;
}

/**
 * Pull emails/phones out of a free-form contact string.
 * Handles "contact@x.com, +91 114-301-2545" and "Phone: 022-4264230".
 */
export function parseContact(text) {
    const emails = [];
    const phones = [];
    if (typeof text !== "string" || !text.trim()) return { emails, phones };

    // Pull the emails out first, so a phone sharing the same segment survives.
    const rest = text
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, (match) => {
            emails.push(match.toLowerCase());
            return " ";
        })
        .replace(/\b(?:e?-?mail|phone|tel|telephone|mob(?:ile)?|wa|whatsapp|hp)\b\s*[:\-]?/gi, " ");

    for (const rawToken of rest.split(/[,;|\n\t]+/)) {
        // A phone token is digits + separators only, no letters left in it.
        const token = rawToken.trim().replace(/[.\-]+$/, ""); // drop sentence punctuation
        if (!token || !/^[\d\s()+.\-/]+$/.test(token)) continue;
        const digits = token.replace(/\D/g, "");
        if (digits.length >= 7 && digits.length <= 15) phones.push(token);
    }

    return { emails: uniq(emails), phones: uniq(phones) };
}

/** "sketsstudio.com/x" -> { url: "https://sketsstudio.com/x", domain: "sketsstudio.com" } */
export function normalizeUrl(value) {
    const raw = firstString(value);
    // Placeholders like "Not found (LinkedIn only)" are prose, not a website.
    if (!raw || /\s/.test(raw)) return { url: null, domain: null };

    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
        const url = new URL(withScheme);
        const domain = url.hostname.replace(/^www\./i, "").toLowerCase();
        if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) return { url: null, domain: null };
        return { url: url.toString().replace(/\/$/, ""), domain };
    } catch {
        return { url: null, domain: null };
    }
}

/**
 * "web:www.kanagroup.co.id" -> "website"; unknown labels -> the batch fallback.
 * The producer's original label is kept in `notes` as `via: <label>`.
 */
export function normalizeSource(rawSource, fallback) {
    if (typeof rawSource === "string") {
        const head = rawSource.trim().toLowerCase().split(":")[0];
        if (SOURCE_ALIASES[head]) return SOURCE_ALIASES[head];
    }
    return fallback || "hq-json";
}

/** A file may hold an array, an object with a list inside, or a single lead. */
export function extractLeadArray(payload) {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === "object") {
        for (const key of ["leads", "items", "data", "results", "records", "rows"]) {
            if (Array.isArray(payload[key])) return payload[key];
        }
        return [payload];
    }
    return [];
}

/**
 * Map one source object into a public.leads row.
 * ctx = { source, label } — provenance for the `source` column and notes.
 */
export function toRow(raw, ctx = {}) {
    if (!raw || typeof raw !== "object") return null;

    const contact = parseContact(
        [raw.email, raw.phone, raw.contact, raw.contacts, raw.whatsapp]
            .filter((v) => typeof v === "string")
            .join(", ")
    );

    const site = normalizeUrl(firstString(raw.website, raw.websiteUri, raw.url, raw.site, raw.domain));
    const externalId = firstString(raw.id, raw.leadId, raw.place_id, raw.placeId);

    // `services` here is what the *prospect* sells — never our `service` column.
    const detail = [];
    if (typeof raw.segment === "string" && raw.segment.trim()) detail.push(`segment: ${raw.segment.trim()}`);
    if (Array.isArray(raw.services) && raw.services.length) detail.push(`services: ${raw.services.join(", ")}`);
    if (raw.size) detail.push(`size: ${raw.size}`);
    if (raw.revenue) detail.push(`revenue: ${raw.revenue}`);
    const rawScore = typeof raw.score === "number" ? raw.score : raw.totalScore;
    if (typeof rawScore === "number") detail.push(`score: ${rawScore}`);
    if (raw.linkedin) detail.push(`linkedin: ${raw.linkedin}`);

    const rawSource = typeof raw.source === "string" && raw.source.trim() ? raw.source.trim() : null;

    const notes = [
        typeof raw.description === "string" ? raw.description.trim() : null,
        typeof raw.notes === "string" ? raw.notes.trim() : null,
        detail.join(" · ") || null,
        rawSource ? `via: ${rawSource}` : null, // keep the producer's own label for the record
        externalId ? `imported: ${ctx.label ?? "?"}#${externalId}` : `imported: ${ctx.label ?? "?"}`,
    ].filter(Boolean).join(" · ");

    return {
        place_id: firstString(raw.place_id, raw.placeId),
        name: firstString(raw.name, raw.company, raw.business, raw.businessName, raw.title),
        company: firstString(raw.company, raw.name, raw.business, raw.businessName),
        email: contact.emails[0] ?? null,
        phone: contact.phones[0] ?? null,
        website: site.url,
        address: firstString(raw.address, raw.formattedAddress, raw.location, raw.city),
        service: firstString(raw.service),
        value: toNumber(raw.value ?? raw.dealValue ?? raw.budget),
        status: VALID_STATUS.has(raw.status) ? raw.status : "new",
        notes: notes || null,
        locale: firstString(raw.locale) ?? ctx.locale ?? "id",
        source: normalizeSource(raw.source, ctx.source),
        _origin: ctx.label ?? null,
    };
}

const digitsOf = (value) => (typeof value === "string" ? value.replace(/\D/g, "") : "");

/** Dedupe key, strongest signal first. Works on both source rows and DB rows. */
export function rowKey(row) {
    if (!row) return null;
    if (row.place_id) return `pid:${row.place_id}`;

    const domain = row.website ? normalizeUrl(row.website).domain : null;
    if (domain) return `dom:${domain}`;

    const digits = digitsOf(row.phone);
    if (digits.length >= 7) return `tel:${digits}`;

    if (row.email) return `em:${String(row.email).toLowerCase()}`;

    const name = typeof row.name === "string" ? row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "";
    if (!name) return null;
    const address = typeof row.address === "string"
        ? `|${row.address.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        : "";
    return `nm:${name}${address}`;
}

/** Only fill empty columns. Existing non-empty data always wins. */
export function pickUpdates(existing, row) {
    const patch = {};
    for (const field of FILLABLE) {
        const next = row[field];
        if (next === null || next === undefined || next === "") continue;
        const current = existing[field];
        if (current !== null && current !== undefined && String(current).trim() !== "") continue;
        patch[field] = next;
    }
    return patch;
}

/** Decide insert / update / skip without touching the network. */
export function planImport(rows, existingRows = []) {
    const index = new Map();
    for (const existing of existingRows) {
        const key = rowKey(existing);
        if (key && !index.has(key)) index.set(key, existing);
    }

    const inserts = [];
    const updates = [];
    const skipped = [];
    const seen = new Map();
    let unkeyed = 0;

    for (const row of rows) {
        const key = rowKey(row);
        if (!key) {
            unkeyed += 1;
            inserts.push(row);
            continue;
        }
        if (seen.has(key)) {
            skipped.push({ row, reason: `duplicate inside the batch (already seen in ${seen.get(key)})` });
            continue;
        }
        seen.set(key, row._origin ?? "?");

        const match = index.get(key);
        if (!match) {
            inserts.push(row);
            continue;
        }
        const patch = pickUpdates(match, row);
        if (Object.keys(patch).length) updates.push({ row, match, patch });
        else skipped.push({ row, reason: "already in CRM, nothing new to fill" });
    }

    return { inserts, updates, skipped, unkeyed };
}

/** Drop helper keys so PostgREST only ever sees real columns. */
export function toInsertRow(row) {
    const out = {};
    for (const column of LEAD_COLUMNS) if (row[column] !== undefined) out[column] = row[column];
    return out;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
    const args = { sources: [] };
    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        if (!token.startsWith("--")) continue;
        const key = token.slice(2);
        const next = argv[i + 1];
        const hasValue = next !== undefined && !next.startsWith("--");
        const value = hasValue ? next : true;
        if (hasValue) i += 1;
        if (key === "source") args.sources.push(String(value));
        else args[key] = value;
    }
    return args;
}

function loadEnvFile(path) {
    if (!existsSync(path)) return false;
    for (const line of readFileSync(path, "utf8").split("\n")) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
    return true;
}

/** A source can be a file or a directory (walked recursively for *.json). */
function collectFiles(spec) {
    if (!existsSync(spec.path)) return { files: [], missing: true };
    if (statSync(spec.path).isDirectory()) {
        const files = [];
        const walk = (dir) => {
            for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
                if (entry.name.startsWith(".")) continue;
                const full = join(dir, entry.name);
                if (entry.isDirectory()) walk(full);
                else if (entry.name.toLowerCase().endsWith(".json")) files.push(full);
            }
        };
        walk(spec.path);
        return { files, missing: false };
    }
    return { files: [spec.path], missing: false };
}

function label(path) {
    return path.startsWith("/srv/hq/") ? path.slice("/srv/hq/".length) : path;
}

async function loadExisting(supabase) {
    const rows = [];
    for (let from = 0; ; from += DB_PAGE) {
        const { data, error } = await supabase
            .from("leads")
            .select("id, place_id, name, company, email, phone, website, address, service, value, notes")
            .order("id", { ascending: true }) // stable pages
            .range(from, from + DB_PAGE - 1);
        if (error) throw new Error(error.message);
        rows.push(...(data ?? []));
        if (!data || data.length < DB_PAGE) break;
    }
    return rows;
}

function printPlan(plan, rows, dry) {
    const preview = rows.slice(0, 30).map((r) => ({
        name: r.name ?? "(no name)",
        company: r.company ?? "",
        email: r.email ?? "",
        phone: r.phone ?? "",
        website: r.website ?? "",
        origin: r._origin ?? "",
    }));
    if (preview.length) console.table(preview);
    if (rows.length > preview.length) console.log(`   … +${rows.length - preview.length} more`);

    // Surface the vocabulary that will land in the CRM facets.
    const tally = (field) => {
        const counts = new Map();
        for (const row of rows) {
            const value = row[field] ?? "(empty)";
            counts.set(value, (counts.get(value) ?? 0) + 1);
        }
        return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
            .map(([value, count]) => `${value} ×${count}`).join(", ") || "-";
    };
    console.log(`\n   source : ${tally("source")}\n   service: ${tally("service")}`);

    console.log(
        `\n${dry ? "DRY RUN — nothing written." : "Planned writes."}\n` +
        `  sources parsed      : ${plan.parsed}\n` +
        `  to insert           : ${plan.inserts.length}\n` +
        `  to fill gaps (update): ${plan.updates.length}\n` +
        `  skipped (dedupe)    : ${plan.skipped.length}\n` +
        `  no dedupe key        : ${plan.unkeyed}`
    );
    for (const s of plan.skipped.slice(0, 5)) {
        console.log(`   · skip ${s.row.name ?? s.row.website ?? "?"} — ${s.reason}`);
    }
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const DRY = Boolean(args["dry-run"]);
    const LIMIT = Number(args.limit) > 0 ? Number(args.limit) : 0;
    const SERVICE = typeof args.service === "string" ? args.service : null;

    const envFile = typeof args["env-file"] === "string"
        ? resolve(args["env-file"])
        : join(REPO_ROOT, ".env.local");
    const envLoaded = loadEnvFile(envFile);

    const specs = args.sources.length
        ? args.sources.map((p) => ({ path: resolve(p), source: null }))
        : DEFAULT_SOURCES;

    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasCreds = Boolean(SB_URL && SB_KEY);

    console.log(`📥 HQ lead JSON -> public.leads${DRY ? "  [dry-run]" : ""}`);
    console.log(`   env: ${envFile}${envLoaded ? "" : " (not found)"} · supabase creds: ${hasCreds ? "present" : "MISSING"}`);

    if (!hasCreds && !DRY) {
        console.error(
            "\n✋ Supabase creds missing — nothing was written.\n" +
            "   Put NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local\n" +
            "   and run again (one command):\n" +
            `   node --env-file=.env.local ${HERE}/import-leads-json.mjs\n` +
            "   Preview without creds: add --dry-run."
        );
        process.exit(2);
    }

    // --- read sources ------------------------------------------------------
    const parsed = [];
    let missingSources = 0;
    for (const spec of specs) {
        const { files, missing } = collectFiles(spec);
        if (missing) {
            missingSources += 1;
            console.warn(`   ⚠ source not found, skipped: ${spec.path}`);
            continue;
        }
        for (const file of files) {
            let payload;
            try {
                payload = JSON.parse(readFileSync(file, "utf8"));
            } catch (error) {
                console.warn(`   ⚠ unreadable JSON, skipped: ${label(file)} — ${error.message}`);
                continue;
            }
            const leads = extractLeadArray(payload);
            const payloadSource = typeof payload?.source === "string" && /^[\w.:-]+$/.test(payload.source.trim())
                ? payload.source.trim()
                : null;
            const defaultSource = spec.source ?? payloadSource;
            for (const raw of leads) {
                const row = toRow(raw, { label: label(file), source: defaultSource });
                if (row) parsed.push(row);
            }
            console.log(`   · ${label(file)}: ${leads.length} lead`);
        }
    }

    if (!parsed.length) {
        console.error(
            `\n✋ No leads found in any source${missingSources ? ` (${missingSources} source path missing)` : ""}. Nothing to do.`
        );
        process.exit(1);
    }

    if (SERVICE) for (const row of parsed) row.service = SERVICE;

    // --- dedupe + plan -----------------------------------------------------
    const supabase = hasCreds ? createClient(SB_URL, SB_KEY, { auth: { persistSession: false } }) : null;
    let existing = [];
    if (supabase) {
        try {
            existing = await loadExisting(supabase);
        } catch (error) {
            console.error(
                `\n✋ Could not read public.leads: ${error.message}\n` +
                "   Has supabase/crm.sql (+ erd-v2-phase*.sql) been applied to this project?"
            );
            process.exit(1);
        }
        console.log(`   DB: ${existing.length} existing lead(s) loaded for dedupe`);
    } else {
        console.log("   DB dedupe skipped (no creds) — in-batch dedupe only");
    }

    const plan = planImport(parsed, existing);
    plan.parsed = parsed.length;

    let inserts = plan.inserts;
    if (LIMIT && inserts.length > LIMIT) {
        console.log(`   limit ${LIMIT}: ${inserts.length - LIMIT} insert(s) held back to the next run`);
        inserts = inserts.slice(0, LIMIT);
    }

    printPlan({ ...plan, inserts }, inserts, DRY);
    if (DRY) return;

    // --- write -------------------------------------------------------------
    if (!supabase) throw new Error("Supabase creds missing"); // unreachable: guarded above

    let inserted = 0;
    for (let i = 0; i < inserts.length; i += INSERT_CHUNK) {
        const chunk = inserts.slice(i, i + INSERT_CHUNK).map(toInsertRow);
        const { data, error } = await supabase.from("leads").insert(chunk).select("id");
        if (error) {
            const hint = /null value in column "email"/i.test(error.message)
                ? "\n   Hint: run supabase/leads_places.sql (drops NOT NULL on leads.email)."
                : "";
            console.error(`✋ Insert failed: ${error.message}${hint}`);
            process.exit(1);
        }
        inserted += data?.length ?? 0;
    }

    let updated = 0;
    let failed = 0;
    for (const { match, patch } of plan.updates) {
        const { error } = await supabase.from("leads").update(patch).eq("id", match.id);
        if (error) {
            failed += 1;
            console.warn(`⚠ Update failed for ${match.id}: ${error.message}`);
            continue;
        }
        updated += 1;
    }

    console.log(`\n✅ Done — ${inserted} inserted, ${updated} filled in, ${plan.skipped.length} skipped (dedupe).`);
    console.log("   Review in the admin pipeline before anyone reaches out.");
    if (failed) {
        console.error(`✋ ${failed} update(s) failed — re-run to retry them.`);
        process.exit(1);
    }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main().catch((error) => { console.error(error.message); process.exit(1); });
