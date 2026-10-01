import { describe, it, expect } from "vitest";
import { selectAll, PAGE_SIZE } from "@/server/repositories/paged";

/** Stand-in for a supabase-js builder: answers .range() the way PostgREST does,
 * clipping at PGRST_DB_MAX_ROWS no matter how wide the requested range is. */
function fakeQuery(total: number, cap = PAGE_SIZE) {
    const calls: Array<[number, number]> = [];
    const query = {
        range(from: number, to: number) {
            calls.push([from, to]);
            const end = Math.min(to + 1, from + cap, total);
            const rows = Array.from({ length: Math.max(0, end - from) }, (_, i) => ({
                id: from + i,
            }));
            return Promise.resolve({ data: rows, error: null });
        },
    };
    return { query, calls };
}

describe("selectAll", () => {
    it("returns every row even when the server clips each response", async () => {
        const { query, calls } = fakeQuery(2162);
        const rows = await selectAll<{ id: number }>(query);
        expect(rows).toHaveLength(2162);
        expect(rows.at(-1)?.id).toBe(2161);
        // 1000 + 1000 + 162: it kept going past the first capped slice.
        expect(calls).toHaveLength(3);
    });

    it("does not ask for a slice wider than the server cap", async () => {
        const { query, calls } = fakeQuery(2162);
        await selectAll(query);
        for (const [from, to] of calls) expect(to - from + 1).toBeLessThanOrEqual(PAGE_SIZE);
    });

    it("stops after one call when the table fits in a slice", async () => {
        const { query, calls } = fakeQuery(12);
        const rows = await selectAll<{ id: number }>(query);
        expect(rows).toHaveLength(12);
        expect(calls).toHaveLength(1);
    });

    it("makes one extra empty call when the table is an exact multiple of the page size", async () => {
        // It cannot know the table ended without asking, so a full last slice
        // costs one more (empty) request. Cheap, and it never truncates.
        const { query, calls } = fakeQuery(PAGE_SIZE);
        expect(await selectAll(query)).toHaveLength(PAGE_SIZE);
        expect(calls).toHaveLength(2);
        expect(calls[1]).toEqual([PAGE_SIZE, PAGE_SIZE * 2 - 1]);
    });

    it("throws rather than returning a short read", async () => {
        const query = {
            range: () => Promise.resolve({ data: null, error: { message: "boom" } }),
        };
        await expect(selectAll(query)).rejects.toThrow("boom");
    });
});
