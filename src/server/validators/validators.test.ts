import { describe, it, expect } from "vitest";
import { ServiceError } from "@/server/http/errors";
import { parseLead } from "@/server/validators/lead";
import { parseSubscribe } from "@/server/validators/subscribe";
import { parseView } from "@/server/validators/view";
import { parseContact } from "@/server/validators/contact";
import { parseChatMessage, parseSessionId } from "@/server/validators/chat";

/** Assert that `fn` throws a ServiceError with the given status + payload. */
function expectServiceError(fn: () => unknown, status: number, payload: unknown) {
    let thrown: unknown;
    try {
        fn();
    } catch (e) {
        thrown = e;
    }
    expect(thrown).toBeInstanceOf(ServiceError);
    expect((thrown as ServiceError).status).toBe(status);
    expect((thrown as ServiceError).payload).toEqual(payload);
}

describe("parseLead", () => {
    it("normalizes a valid lead (trim, lowercase, empty→null, source default)", () => {
        const out = parseLead({ email: "  JO@Acme.IO ", name: "  Jo  ", company: "", source: "  " });
        expect(out.email).toBe("jo@acme.io");
        expect(out.name).toBe("Jo");
        expect(out.company).toBeNull();
        expect(out.source).toBe("website");
        expect(out.locale).toBe("en");
    });

    it("keeps locale=id and honors an explicit source", () => {
        const out = parseLead({ email: "a@b.io", locale: "id", source: "linkedin" });
        expect(out.locale).toBe("id");
        expect(out.source).toBe("linkedin");
    });

    it("rejects a malformed email", () => {
        expectServiceError(() => parseLead({ email: "nope" }), 400, { error: "invalid_email" });
    });

    it("rejects a non-object body", () => {
        expectServiceError(() => parseLead(123), 400, { error: "invalid_email" });
    });
});

describe("parseSubscribe", () => {
    it("accepts a valid email + locale", () => {
        expect(parseSubscribe({ email: "X@Y.IO", locale: "id" })).toEqual({ email: "x@y.io", locale: "id" });
    });
    it("rejects a bad email", () => {
        expectServiceError(() => parseSubscribe({ email: "x" }), 400, { error: "invalid_email" });
    });
});

describe("parseView", () => {
    it("trims and caps the slug", () => {
        expect(parseView({ slug: "  hello-world " }).slug).toBe("hello-world");
    });
    it("rejects an empty slug", () => {
        expectServiceError(() => parseView({ slug: "   " }), 400, { error: "invalid_slug" });
    });
});

describe("parseContact", () => {
    it("cleans a valid submission (lowercases email; legacy validates the raw value)", () => {
        const out = parseContact({ name: "Jo", email: "J@A.io", message: "hi", company: "Acme", locale: "id" });
        expect(out).toEqual({
            name: "Jo",
            email: "j@a.io",
            company: "Acme",
            phone: null,
            service: null,
            message: "hi",
            locale: "id",
        });
    });
    it("requires name/email/message (precedence over email format)", () => {
        expectServiceError(
            () => parseContact({ email: "bad", message: "hi" }),
            400,
            { error: "name, email, and message are required" }
        );
    });
    it("rejects a bad email format when required fields are present", () => {
        expectServiceError(
            () => parseContact({ name: "Jo", email: "bad", message: "hi" }),
            400,
            { error: "Invalid email format" }
        );
    });
});

describe("parseChatMessage", () => {
    it("accepts a valid message", () => {
        expect(parseChatMessage({ session_id: "s1", role: "user", content: "hey" })).toEqual({
            session_id: "s1",
            role: "user",
            content: "hey",
        });
    });
    it("requires all fields", () => {
        expectServiceError(
            () => parseChatMessage({ session_id: "s1", content: "x" }),
            400,
            { error: "session_id, role, and content are required" }
        );
    });
    it("rejects an unknown role", () => {
        expectServiceError(
            () => parseChatMessage({ session_id: "s1", role: "system", content: "x" }),
            400,
            { error: 'role must be "user" or "assistant"' }
        );
    });
});

describe("parseSessionId", () => {
    it("returns the id when present", () => {
        expect(parseSessionId("abc")).toBe("abc");
    });
    it("rejects a missing id", () => {
        expectServiceError(() => parseSessionId(null), 400, { error: "session_id is required" });
    });
});
