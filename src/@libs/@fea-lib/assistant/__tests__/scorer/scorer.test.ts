import { describe, it, expect } from "vitest";
import { score } from "../../src/scorer/index.js";
import type { TaskItem } from "../../src/types/index.js";

const TODAY = new Date("2026-04-23T00:00:00.000Z");

function makeTask(overrides: Partial<TaskItem> = {}): TaskItem {
  return {
    id: "t1",
    title: "Task",
    impact: "Medium",
    effort: 2,
    due_type: "none",
    status: "open",
    source: "taskstore",
    created: "2026-04-01T00:00:00.000Z",
    updated: "2026-04-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("ICE-lite scorer", () => {
  it("high-impact, low-effort, hard-due-today ranks above medium-impact, high-effort, soft-due-next-week", () => {
    const urgent = makeTask({
      id: "urgent",
      impact: "High",
      effort: 1,
      due: "2026-04-23",
      due_type: "hard",
    });
    const casual = makeTask({
      id: "casual",
      impact: "Medium",
      effort: 8,
      due: "2026-04-30",
      due_type: "soft",
    });
    const ranked = score([casual, urgent], TODAY);
    expect(ranked[0].id).toBe("urgent");
    expect(ranked[1].id).toBe("casual");
  });

  it("hard due date scores higher than soft due date at equal proximity", () => {
    const hard = makeTask({ id: "hard", impact: "Medium", effort: 2, due: "2026-04-25", due_type: "hard" });
    const soft = makeTask({ id: "soft", impact: "Medium", effort: 2, due: "2026-04-25", due_type: "soft" });
    const ranked = score([soft, hard], TODAY);
    expect(ranked[0].id).toBe("hard");
  });

  it("tasks with no due date sort below tasks with any due date at equal impact/effort", () => {
    const withDue = makeTask({ id: "due", impact: "Medium", effort: 2, due: "2026-05-01", due_type: "soft" });
    const noDue = makeTask({ id: "nodue", impact: "Medium", effort: 2, due_type: "none" });
    const ranked = score([noDue, withDue], TODAY);
    expect(ranked[0].id).toBe("due");
  });

  it("rank_override pins task to specified position without modifying score", () => {
    const t1 = makeTask({ id: "t1", impact: "High", effort: 1 });
    const t2 = makeTask({ id: "t2", impact: "Low", effort: 8, rank_override: 1 });
    const ranked = score([t1, t2], TODAY);
    // t2 has rank_override: 1 so it goes to position 0
    expect(ranked[0].id).toBe("t2");
    expect(ranked[1].id).toBe("t1");
    // score is still computed (not zeroed out)
    expect(ranked[0].score).toBeGreaterThan(0);
  });

  it("tie-breaking uses created date (older task ranks higher)", () => {
    const older = makeTask({ id: "older", impact: "Medium", effort: 2, created: "2026-01-01T00:00:00.000Z" });
    const newer = makeTask({ id: "newer", impact: "Medium", effort: 2, created: "2026-04-01T00:00:00.000Z" });
    const ranked = score([newer, older], TODAY);
    expect(ranked[0].id).toBe("older");
  });

  it("overdue tasks (past due date) get maximum earliness score", () => {
    const overdue = makeTask({ id: "overdue", impact: "Low", effort: 8, due: "2026-04-01", due_type: "hard" });
    const fresh = makeTask({ id: "fresh", impact: "Low", effort: 8, due_type: "none" });
    const ranked = score([fresh, overdue], TODAY);
    expect(ranked[0].id).toBe("overdue");
  });

  it("returns scored items with score field set", () => {
    const tasks = [makeTask({ id: "a" }), makeTask({ id: "b" })];
    const ranked = score(tasks, TODAY);
    for (const r of ranked) {
      expect(typeof r.score).toBe("number");
      expect(r.score).toBeGreaterThan(0);
    }
  });

  it("returns empty array for empty input", () => {
    expect(score([], TODAY)).toEqual([]);
  });
});
