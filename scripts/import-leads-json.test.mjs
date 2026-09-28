import { describe, expect, it } from "vitest";
import {
    extractLeadArray,
    normalizeSource,
    normalizeUrl,
    parseContact,
    pickUpdates,
    planImport,
    rowKey,
    toInsertRow,
    toRow,
} from "./import-leads-json.mjs";

const ctx = { label: "projects/trilux/leads/leads-2026-09-28.json", source: "trilux-leads" };

describe("parseContact", () => {
    it("splits an email/phone pair from one free-form string", () => {
        expect(parseContact("contact@sketsstudio.com, +91 114-301-2545")).toEqual({
            emails: ["contact@sketsstudio.com"],
            phones: ["+91 114-301-2545"],
        });
    });

    it("strips field labels and keeps several emails", () => {
        const { emails, phones } = parseContact("Phone: 022-4264230. Email: cs@buana.com, js_buana@yahoo.com");
        expect(emails).toEqual(["cs@buana.com", "js_buana@yahoo.com"]);
        expect(phones).toEqual(["022-4264230"]);
    });

    it("does not mistake a domain or a short number for a phone", () => {
        expect(parseContact("https://acme.co.id").phones).toEqual([]);
        expect(parseContact("est. 1998").phones).toEqual([]);
    });
});

describe("normalizeUrl", () => {
    it("adds a scheme and strips www", () => {
        expect(normalizeUrl("www.sketsstudio.com")).toEqual({ url: "https://www.sketsstudio.com", domain: "sketsstudio.com" });
    });

    it("returns nulls for junk and placeholders", () => {
        expect(normalizeUrl("")).toEqual({ url: null, domain: null });
        expect(normalizeUrl("Not found (LinkedIn only)")).toEqual({ url: null, domain: null });
        expect(normalizeUrl("n/a")).toEqual({ url: null, domain: null });
    });
});

describe("normalizeSource", () => {
    it("folds a per-domain producer label onto the controlled vocabulary", () => {
        expect(normalizeSource("web:www.kanagroup.co.id", "hq-leads")).toBe("website");
        expect(normalizeSource("linkedin:foo", "hq-leads")).toBe("linkedin");
    });

    it("falls back to the batch label for anything unknown", () => {
        expect(normalizeSource("exa.ai global company search", "trilux-leads")).toBe("trilux-leads");
        expect(normalizeSource(undefined, "trilux-leads")).toBe("trilux-leads");
        expect(normalizeSource(undefined, undefined)).toBe("hq-json");
    });
});

describe("extractLeadArray", () => {
    it("accepts the wrapper shape HQ uses", () => {
        expect(extractLeadArray({ totalLeads: 1, leads: [{ company: "A" }] })).toEqual([{ company: "A" }]);
    });

    it("accepts a bare array and a single lead object", () => {
        expect(extractLeadArray([{ company: "A" }])).toHaveLength(1);
        expect(extractLeadArray({ company: "A" })).toEqual([{ company: "A" }]);
    });
});

describe("toRow", () => {
    const raw = {
        id: "lead-001",
        company: "SKETS Studio",
        website: "https://sketsstudio.com",
        location: "New Delhi, India",
        services: ["Architecture", "BIM"],
        contact: "contact@sketsstudio.com, +91 114-301-2545",
        notes: "Potential outsourcing partner",
        totalScore: 85,
    };

    it("maps the trilux shape onto public.leads", () => {
        const row = toRow(raw, ctx);
        expect(row.name).toBe("SKETS Studio");
        expect(row.company).toBe("SKETS Studio");
        expect(row.email).toBe("contact@sketsstudio.com");
        expect(row.phone).toBe("+91 114-301-2545");
        expect(row.address).toBe("New Delhi, India");
        expect(row.source).toBe("trilux-leads");
        expect(row.status).toBe("new");
        expect(row.locale).toBe("id");
        expect(row.place_id).toBeNull();
    });

    it("keeps the prospect's own services out of our `service` column", () => {
        expect(toRow(raw, ctx).service).toBeNull();
        expect(toRow(raw, ctx).notes).toContain("services: Architecture, BIM");
    });

    it("records provenance without inventing a place_id", () => {
        const row = toRow(raw, ctx);
        expect(row.place_id).toBeNull();
        expect(row.notes).toContain("lead-001");
        expect(row.notes).toContain("projects/trilux/leads/leads-2026-09-28.json");
    });

    it("leaves email null for a phone-only business", () => {
        const row = toRow({ name: "Warung A", phone: "+62 812 3456 7890" }, ctx);
        expect(row.email).toBeNull();
        expect(row.phone).toBe("+62 812 3456 7890");
    });

    it("keeps the producer's own source label in the notes", () => {
        const row = toRow({ name: "Kana", source: "web:www.kanagroup.co.id" }, { label: "leads/leads.json", source: "hq-leads" });
        expect(row.source).toBe("website");
        expect(row.notes).toContain("via: web:www.kanagroup.co.id");
    });

    it("carries score and segment into the notes", () => {
        const row = toRow({ name: "Kana", score: 82, segment: "AI & Otomasi Bisnis · Surabaya" }, ctx);
        expect(row.notes).toContain("score: 82");
        expect(row.notes).toContain("segment: AI & Otomasi Bisnis · Surabaya");
    });

    it("rejects a bad status instead of writing it", () => {
        expect(toRow({ name: "A", status: "hot" }, ctx).status).toBe("new");
        expect(toRow({ name: "A", status: "qualified" }, ctx).status).toBe("qualified");
    });
});

describe("rowKey", () => {
    it("prefers place_id, then domain, then phone, then email", () => {
        expect(rowKey({ place_id: "ChIJ123", website: "https://a.com", phone: "+6281234567" })).toBe("pid:ChIJ123");
        expect(rowKey({ website: "https://www.a.com/x", phone: "+6281234567" })).toBe("dom:a.com");
        expect(rowKey({ phone: "+62 812-3456-7890" })).toBe("tel:6281234567890");
        expect(rowKey({ email: "A@B.com" })).toBe("em:a@b.com");
    });

    it("returns null when there is nothing to key on", () => {
        expect(rowKey({ name: null, email: null, phone: null, website: null })).toBeNull();
    });
});

describe("pickUpdates", () => {
    it("fills only the empty columns", () => {
        const patch = pickUpdates(
            { id: "1", phone: "+62 811 0000", website: null, email: null, status: "qualified" },
            { phone: "+62 899 9999", website: "https://a.com", email: "a@b.com", status: "new" }
        );
        expect(patch).toEqual({ website: "https://a.com", email: "a@b.com" });
    });
});

describe("planImport", () => {
    const rows = [
        toRow({ id: "1", company: "SKETS", website: "sketsstudio.com" }, ctx),
        toRow({ id: "2", company: "LTW", website: "https://www.ltwdesignworks.com" }, ctx),
        toRow({ id: "3", company: "Dupe of SKETS", website: "https://sketsstudio.com/contact" }, ctx),
    ];

    it("dedupes inside the batch — the third row is the same domain as the first", () => {
        const plan = planImport(rows, []);
        expect(plan.inserts.map((r) => r.company)).toEqual(["SKETS", "LTW"]);
        expect(plan.skipped).toHaveLength(1);
        expect(plan.skipped[0].row.company).toBe("Dupe of SKETS");
    });

    it("does not insert a lead that is already in the CRM", () => {
        const existing = [{ id: "db-1", website: "https://sketsstudio.com", name: "SKETS", email: null }];
        const plan = planImport(rows, existing);
        expect(plan.inserts.map((r) => r.company)).toEqual(["LTW"]);
        expect(plan.updates).toHaveLength(1);
        expect(plan.updates[0].match.id).toBe("db-1");
    });

    it("re-running an unchanged file inserts nothing", () => {
        const first = planImport(rows, []).inserts.map((r) => ({ ...{ id: "db" }, ...toInsertRow(r) }));
        const second = planImport(rows, first);
        expect(second.inserts).toHaveLength(0);
        expect(second.updates).toHaveLength(0);
        expect(second.skipped).toHaveLength(3);
    });

    it("counts rows with no dedupe key as always-insert", () => {
        const bare = toRow({ notes: "only notes" }, ctx);
        const plan = planImport([bare], []);
        expect(plan.unkeyed).toBe(1);
        expect(plan.inserts).toHaveLength(1);
    });
});

describe("toInsertRow", () => {
    it("strips helper keys so PostgREST only sees real columns", () => {
        const row = toRow({ company: "A", website: "a.com" }, ctx);
        const insert = toInsertRow(row);
        expect(insert._origin).toBeUndefined();
        expect(Object.keys(insert).every((k) => !k.startsWith("_"))).toBe(true);
        expect(insert.company).toBe("A");
        expect(insert.source).toBe("trilux-leads");
    });
});
