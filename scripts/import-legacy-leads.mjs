/**
 * Import leads from the legacy Supabase project into the current database.
 *
 * Why this exists
 * ---------------
 * The marketing site originally wrote leads to the hosted Supabase project
 * `qsklgxeovoegxxiutkzh`. The site now runs against a self-hosted Supabase
 * stack (Postgres 17 in `vpsplus-postgres`, database `plusthesite`), so that
 * project was never migrated. This script pulls the rows across.
 *
 * It is deliberately read-then-write in two separate steps:
 *
 *   1. `pull`  - reads the legacy project over PostgREST and writes a plain
 *                JSON snapshot to disk. No target DB is touched, so it is safe
 *                to run and re-run while the credentials are being rotated.
 *   2. `apply` - reads that snapshot and writes it into the current database,
 *                inside a single transaction that is rolled back on any error.
 *
 * Splitting them means the snapshot is the durable artifact: if `apply` fails
 * halfway through review, nothing is re-fetched and nothing is half-written.
 *
 * Fidelity rules applied by `apply`
 * ---------------------------------
 * - `status` is mapped through STATUS_MAP. The legacy data uses "baru"; the
 *   current table has a CHECK constraint that only accepts the CRM vocabulary,
 *   so an unmapped value is a hard failure, not a silent default.
 * - `service` is mapped through SERVICE_MAP onto the canonical taxonomy in
 *   `src/lib/services.ts`. Values with no counterpart become NULL rather than
 *   an invented slug - the column is free text with no FK, so a wrong slug
 *   would only surface later as a filter that silently matches nothing.
 * - `place_id` is the natural key: it is the Google Places id and carries a
 *   UNIQUE index in the current table. It is the ONLY key used for
 *   de-duplication, deliberately.
 *   The legacy batch holds 2152 leads but only 2122 distinct phone numbers,
 *   and the 19 colliding numbers are chains with several real branches
 *   (FTL Gym alone has 7 Bandung outlets on one number; Holiday Inn Bandung
 *   Pasteur and Ninety Six Fitness share another). De-duplicating on phone or
 *   company name would silently delete 30 legitimate leads, so neither is used.
 *   Company name is not unique either: "Tom's by Tom Aikens" and "The Langham,
 *   Jakarta" are unrelated businesses.
 * - `accounts` in the legacy project are 1:1 shells for the leads: all 2150
 *   rows carry a name and nothing else - zero phone, website, email, notes or
 *   owner - and the name always equals the lead's own company. They are
 *   therefore NOT migrated; `leads.account_id` is left NULL rather than
 *   pointing at 2150 rows that hold no information the lead does not already
 *   carry. Importing them would triple the row count and add a click-through
 *   with nothing behind it.
 * - `owner` in the legacy schema is free text; the current schema uses
 *   `owner_id` (uuid, FK to sales_reps). The legacy values are all NULL, and
 *   the legacy sales_reps roster is four rows named "test"/"cek" - test
 *   fixtures, not people. Neither is migrated; the current roster
 *   (Aulia/Bima/Citra) is authoritative.
 * - `score`, `segment`, `contactVerified`, `contactEvidence` and
 *   `contactStatusNote` have no column in the current schema. They are not
 *   discarded: they are written to `leads.notes` under a stable prefix, so the
 *   research that produced the lead stays attached to it and is still
 *   machine-readable (see NOTE_PREFIX below).
 *
 * Usage
 * -----
 *   OLD_SUPABASE_URL=https://qsklgxeovoegxxiutkzh.supabase.co \
 *   OLD_SUPABASE_KEY=sb_secret_... \
 *   TARGET_DATABASE_URL=postgres://vpsplus:...@127.0.0.1:5432/plusthe.site \
 *   node --env-file=.env.migrate scripts/import-legacy-leads.mjs pull
 *
 *   node --env-file=.env.migrate scripts/import-legacy-leads.mjs apply --dry-run
 *   node --env-file=.env.migrate scripts/import-legacy-leads.mjs apply
 *
 * Never pass the legacy service-role key in argv - it lands in the process
 * table and in shell history. The script reads it from the environment only.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = resolve(HERE, "../.migrate/legacy-leads-snapshot.json");

/** Legacy status vocabulary -> CRM vocabulary accepted by the CHECK constraint. */
const STATUS_MAP = {
    baru: "new",
    baru_: "new",
    contact: "contacting",
    contacting: "contacting",
    qualified: "qualified",
    proposal: "proposal",
    won: "won",
    lost: "lost",
    converted: "converted",
    new: "new",
};

/** Legacy service slugs -> canonical slugs from src/lib/services.ts.
    `null` means "no counterpart exists": store NULL, never invent a slug. */
const SERVICE_MAP = {
    chatbot: "chatbot",
    "ai-agency": "digital-agency",
    "web-dev": "digital-agency",
    marketing: "digital-agency",
    "digital-agency": "digital-agency",
    crm: "crm",
    "customer-support": "customer-support",
    "ai-tools": "ai-tools",
    "mobile-app": "mobile-app",
    "mobile-game": "mobile-game",
    ecommerce: null,
};

/** Prefix for research fields folded into leads.notes, so they stay greppable. */
const NOTE_PREFIX = "[legacy-research]";

const args = process.argv.slice(2);
const command = args.find((a) => !a.startsWith("--")) ?? "help";
const dryRun = args.includes("--dry-run");
const verbose = args.includes("--verbose");

function log(...parts) {
    console.log(...parts);
}

function die(message) {
    console.error(`\n✋ ${message}\n`);
    process.exit(1);
}

/** Load a .env file into process.env without overwriting real environment values. */
function loadEnvFile(file) {
    if (!existsSync(file)) return;
    for (const line of readFileSync(file, "utf8").split("\n")) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (match && !process.env[match[1]]) {
            process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
        }
    }
}

loadEnvFile(resolve(HERE, "../.env.local"));
loadEnvFile(resolve(HERE, "../.env.migrate"));

/* ────────────────────────────── pull ────────────────────────────── */

/**
 * Fetch every row of `leads` from the legacy project.
 *
 * Paginates on `id > lastSeen` rather than using range headers: the legacy
 * table may exceed one page and a range-based loop silently truncates if the
 * row count shifts mid-read. Keyset pagination is stable under that.
 */
async function pull() {
    const url = (process.env.OLD_SUPABASE_URL ?? "").replace(/\/$/, "");
    const key = process.env.OLD_SUPABASE_KEY;
    if (!url || !key) {
        die("OLD_SUPABASE_URL and OLD_SUPABASE_KEY are required for `pull`.");
    }

    const headers = {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
    };

    log(`→ probing ${url}`);
    const probe = await fetch(`${url}/rest/v1/leads?select=id&limit=1`, { headers });
    if (probe.status === 401 || probe.status === 403) {
        die(
            `Legacy project rejected the key (HTTP ${probe.status}). If the old ` +
                `service-role key was rotated or the project was paused, ask the ` +
                `owner for a fresh key before retrying.`,
        );
    }
    if (!probe.ok) die(`Legacy project returned HTTP ${probe.status} on probe.`);

    const rows = [];
    let lastSeen = "";
    const pageSize = 1000;
    let page = 0;

    for (;;) {
        const query = new URLSearchParams({
            select: "*",
            order: "id.asc",
            limit: String(pageSize),
        });
        if (lastSeen) query.set("id", `gt.${lastSeen}`);

        const response = await fetch(`${url}/rest/v1/leads?${query}`, { headers });
        if (!response.ok) die(`Read failed on page ${page + 1}: HTTP ${response.status}`);

        const batch = await response.json();
        if (!Array.isArray(batch) || batch.length === 0) break;

        rows.push(...batch);
        lastSeen = batch[batch.length - 1].id;
        page += 1;
        log(`  page ${page}: +${batch.length} (total ${rows.length})`);
        if (batch.length < pageSize) break;
    }

    const snapshot = {
        pulledAt: new Date().toISOString(),
        source: url,
        count: rows.length,
        // Column names are recorded so `apply` can fail loudly if the legacy
        // schema is not what this mapping was written against, instead of
        // writing a column full of NULLs and calling it a success.
        columns: rows.length ? Object.keys(rows[0]).sort() : [],
        rows,
    };

    mkdirSync(dirname(SNAPSHOT), { recursive: true });
    writeFileSync(SNAPSHOT, `${JSON.stringify(snapshot, null, 2)}\n`);
    log(`\n✓ ${rows.length} rows → ${SNAPSHOT}`);
    log(`  columns: ${snapshot.columns.join(", ")}`);
    log("\nNext: node --env-file=.env.migrate scripts/import-legacy-leads.mjs apply --dry-run");
}

/* ────────────────────────────── apply ───────────────────────────── */

/** Fold the research-only fields into notes so nothing is silently dropped. */
function buildNotes(row) {
    const parts = [];
    if (row.score != null) parts.push(`score=${row.score}`);
    if (row.segment) parts.push(`segment=${row.segment}`);
    if (row.contactVerified != null) parts.push(`contactVerified=${row.contactVerified}`);
    if (row.contactEvidence) parts.push(`evidence=${row.contactEvidence}`);
    if (row.contactStatusNote) parts.push(`note=${row.contactStatusNote}`);

    const legacy = [row.message, row.notes].filter(Boolean).join(" | ");
    if (legacy) parts.push(legacy);

    const folded = parts.length ? `${NOTE_PREFIX} ${parts.join("; ")}` : "";
    const original = String(row.notes ?? "").trim();
    if (original && !original.startsWith(NOTE_PREFIX)) {
        return folded ? `${folded}\n${original}` : original;
    }
    return folded || original;
}

function mapRow(row) {
    const status = STATUS_MAP[String(row.status ?? "").toLowerCase()];
    if (!status) {
        die(
            `Unmapped status "${row.status}" on legacy id ${row.id}. ` +
                `Add it to STATUS_MAP in this script - do not guess a default.`,
        );
    }

    const rawService = String(row.service ?? "").toLowerCase();
    const hasService = Object.prototype.hasOwnProperty.call(SERVICE_MAP, rawService);
    if (rawService && !hasService && verbose) {
        log(`  ! legacy id ${row.id}: unknown service "${rawService}" → NULL`);
    }

    return {
        name: row.name ?? row.company ?? null,
        company: row.company ?? row.name ?? null,
        email: row.email ?? null,
        phone: row.phone ?? null,
        website: row.website ?? null,
        address: row.address ?? null,
        message: row.message ?? null,
        source: row.source ?? "legacy-supabase",
        locale: row.locale ?? "id",
        status,
        service: hasService ? SERVICE_MAP[rawService] : null,
        value: row.value ?? null,
        place_id: row.place_id ?? null,
        notes: buildNotes(row),
        created_at: row.createdAt ?? row.created_at ?? new Date().toISOString(),
        updated_at: row.updatedAt ?? row.updated_at ?? row.createdAt ?? new Date().toISOString(),
    };
}

async function apply() {
    if (!existsSync(SNAPSHOT)) {
        die(`No snapshot at ${SNAPSHOT}. Run \`pull\` first.`);
    }

    const databaseUrl =
        process.env.TARGET_DATABASE_URL ?? process.env.DATABASE_URL;
    if (!databaseUrl) {
        die("TARGET_DATABASE_URL (or DATABASE_URL) is required for `apply`.");
    }

    const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
    const required = ["name", "status", "source"];
    const missing = required.filter(
        (column) => snapshot.columns.length && !snapshot.columns.includes(column),
    );
    if (missing.length) {
        die(
            `Legacy snapshot does not have the expected columns (${missing.join(", ")}). ` +
                `Found: ${snapshot.columns.join(", ") || "(none)"}. ` +
                `Re-check the mapping in this script before writing anything.`,
        );
    }

    const { default: pg } = await import("pg");
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();

    try {
        await client.query("BEGIN");

        // Existing keys, so a re-run is idempotent instead of doubling the table.
        // Only place_id is consulted - see the note at the top of this file on
        // why phone and company are not safe de-duplication keys here.
        const existing = await client.query(
            "SELECT id, place_id FROM leads WHERE place_id IS NOT NULL",
        );
        const byPlaceId = new Set(existing.rows.map((r) => r.place_id));

        const seenPlaceId = new Set();
        const toInsert = [];
        const skipped = { placeId: 0, noPlaceId: 0 };

        for (const row of snapshot.rows) {
            const mapped = mapRow(row);

            // A lead with no place_id cannot be de-duplicated safely, and the
            // unique index treats NULLs as distinct, so it would insert on every
            // run. The legacy batch has none; if one appears, it is reported
            // rather than silently duplicated.
            if (!mapped.place_id) {
                skipped.noPlaceId += 1;
                if (verbose) log(`  ! legacy id ${row.id}: no place_id, skipped`);
                continue;
            }
            if (byPlaceId.has(mapped.place_id) || seenPlaceId.has(mapped.place_id)) {
                skipped.placeId += 1;
                continue;
            }
            seenPlaceId.add(mapped.place_id);

            toInsert.push(mapped);
        }

        const byStatus = {};
        const byService = {};
        for (const row of toInsert) {
            byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
            const key = row.service ?? "(null)";
            byService[key] = (byService[key] ?? 0) + 1;
        }

        log(`snapshot rows      : ${snapshot.rows.length}`);
        log(`already in DB      : ${existing.rowCount} (by place_id)`);
        log(`to insert          : ${toInsert.length}`);
        log(`skipped            : ${skipped.placeId} already present, ${skipped.noPlaceId} without place_id`);
        log(`status breakdown   : ${JSON.stringify(byStatus)}`);
        log(`service breakdown  : ${JSON.stringify(byService)}`);

        if (toInsert.length === 0) {
            await client.query("ROLLBACK");
            log("\n✓ Nothing to insert — every legacy row is already present.");
            return;
        }

        if (dryRun) {
            await client.query("ROLLBACK");
            log("\n--dry-run: transaction rolled back, nothing written.");
            log("Re-run without --dry-run to apply.");
            return;
        }

        const columns = [
            "name", "company", "email", "phone", "website", "address",
            "message", "source", "locale", "status", "service", "value",
            "place_id", "notes", "created_at", "updated_at",
        ];
        const values = [];
        const params = [];
        let i = 1;
        for (const row of toInsert) {
            values.push(`(${columns.map(() => `$${i++}`).join(", ")})`);
            for (const column of columns) params.push(row[column]);
        }

        await client.query(
            `INSERT INTO leads (${columns.join(", ")}) VALUES ${values.join(", ")}`,
            params,
        );

        const check = await client.query("SELECT count(*)::int AS n FROM leads");
        await client.query("COMMIT");

        log(`\n✓ inserted ${toInsert.length} rows (transaction committed)`);
        log(`  leads table now holds ${check.rows[0].n} rows`);
        log(`  rolled back on any error — no partial import is possible`);
    } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        die(`Import failed and was rolled back: ${error.message}`);
    } finally {
        await client.end();
    }
}

/* ────────────────────────────── inspect ──────────────────────────── */

/** What is already in the target table, so the caller can sanity-check first. */
async function inspect() {
    const databaseUrl =
        process.env.TARGET_DATABASE_URL ?? process.env.DATABASE_URL;
    if (!databaseUrl) die("TARGET_DATABASE_URL (or DATABASE_URL) is required.");

    const { default: pg } = await import("pg");
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    try {
        const totals = await client.query(
            `SELECT count(*)::int AS leads,
                    count(place_id)::int AS with_place_id,
                    count(owner_id)::int AS with_owner,
                    min(created_at)::date AS oldest,
                    max(created_at)::date AS newest
             FROM leads`,
        );
        const services = await client.query(
            `SELECT coalesce(service,'(null)') AS service, count(*)::int AS n
             FROM leads GROUP BY 1 ORDER BY 2 DESC`,
        );
        log("leads totals:", totals.rows[0]);
        log("\nby service:");
        for (const row of services.rows) log(`  ${row.service.padEnd(20)} ${row.n}`);
    } finally {
        await client.end();
    }
}

if (command === "pull") {
    await pull();
} else if (command === "apply") {
    await apply();
} else if (command === "inspect") {
    await inspect();
} else {
    log(`Usage: node --env-file=.env.migrate scripts/import-legacy-leads.mjs <command>

  pull      Read the legacy Supabase project → ${SNAPSHOT}
  apply     Write the snapshot into the current DB (--dry-run supported)
  inspect   Show what the current DB already holds

Environment:
  OLD_SUPABASE_URL     legacy project URL, e.g. https://qsklgxeovoegxxiutkzh.supabase.co
  OLD_SUPABASE_KEY     legacy service-role key (environment only, never argv)
  TARGET_DATABASE_URL  postgres:// of the current database
`);
}
