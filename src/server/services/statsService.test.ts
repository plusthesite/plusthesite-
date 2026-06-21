import { describe, it, expect } from "vitest";
import { aggregateDashboard } from "@/server/services/statsService";
import type { DashboardRaw } from "@/server/repositories/statsRepo";

const raw: DashboardRaw = {
    views: [{ views: 10 }, { views: 5 }],
    opps: [
        { value: 1000, probability: 50, stage: "qualified", owner: "Ana" },
        { value: 2000, probability: 25, stage: "proposal", owner: "Ana" },
        { value: 5000, probability: 100, stage: "won", owner: "Bob" },
        { value: 3000, probability: 0, stage: "lost", owner: "Bob" },
    ],
    recentSubs: [{ email: "a@b.io", locale: "en", created_at: "2026-06-01" }],
    recentContacts: [{ name: "Jo", email: "j@a.io", created_at: "2026-06-01" }],
    hot: [{ name: "X", company: "Acme", value: 9, stage: "proposal", service: null }],
    tasks: [{ due_at: null }, { due_at: "2000-01-01T00:00:00.000Z" }],
    leadsTrend: [],
    leadsValue: [
        { value: 100, status: "new", owner: "Ana" },
        { value: 200, status: "converted", owner: "Bob" },
        { value: null, status: "new", owner: "Ana" },
    ],
    reps: [{ name: "Ana" }, { name: "Bob" }],
};

const counts = { subscribers: 7, leads: 3, contacts: 2, conversations: 4, opportunities: 4, accounts: 6 };

describe("aggregateDashboard", () => {
    const s = aggregateDashboard(raw, counts);

    it("passes counts through and marks configured", () => {
        expect(s.configured).toBe(true);
        expect(s).toMatchObject({ subscribers: 7, leads: 3, contacts: 2, conversations: 4, opportunities: 4, accounts: 6 });
    });

    it("sums article views", () => {
        expect(s.views).toBe(15);
    });

    it("computes open / weighted / won pipeline", () => {
        expect(s.openPipeline).toBe(3000);
        expect(s.weightedPipeline).toBe(1000); // 1000*.5 + 2000*.25
        expect(s.wonValue).toBe(5000);
    });

    it("computes lead pipeline + conversion rate", () => {
        expect(s.leadPipeline).toBe(300);
        expect(s.conversionRate).toBe(33); // 1/3
    });

    it("computes win rate over closed opps", () => {
        expect(s.winRate).toBe(50); // 1 won / 2 closed
    });

    it("counts open + overdue tasks", () => {
        expect(s.openTasks).toBe(2);
        expect(s.overdueTasks).toBe(1); // null due_at is not overdue
    });

    it("builds a 14-day lead trend", () => {
        expect(s.newLeads14d).toHaveLength(14);
        expect(s.newLeads14d.every((d) => d.count === 0)).toBe(true);
    });

    it("includes only non-empty stages, in canonical order", () => {
        expect(s.stageBreakdown).toEqual([
            { stage: "qualified", count: 1, value: 1000 },
            { stage: "proposal", count: 1, value: 2000 },
            { stage: "won", count: 1, value: 5000 },
            { stage: "lost", count: 1, value: 3000 },
        ]);
    });

    it("builds a rep leaderboard sorted by open pipeline", () => {
        expect(s.repLeaderboard).toEqual([
            { name: "Ana", leads: 2, pipeline: 3000, deals: 2 },
            { name: "Bob", leads: 1, pipeline: 0, deals: 0 },
        ]);
    });

    it("passes through recent + hot lists", () => {
        expect(s.hotOpportunities).toEqual(raw.hot);
        expect(s.recentSubs).toEqual(raw.recentSubs);
        expect(s.recentContacts).toEqual(raw.recentContacts);
    });
});
