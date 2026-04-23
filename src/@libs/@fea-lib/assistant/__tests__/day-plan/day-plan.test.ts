import { describe, it, expect } from "vitest";
import { DayPlanBuilder } from "../../src/day-plan/index.js";
import type { RankedTaskItem, CalendarEvent, WorkingHours } from "../../src/types/index.js";

const DATE = "2026-04-23"; // Thursday

const WORKING_HOURS: WorkingHours = {
  monday: { start: "08:00", end: "17:00" },
  tuesday: { start: "08:00", end: "17:00" },
  wednesday: { start: "08:00", end: "17:00" },
  thursday: { start: "08:00", end: "17:00" },
  friday: { start: "09:00", end: "12:00" },
};

function makeTask(id: string, effort: number, score: number): RankedTaskItem {
  return {
    id,
    title: `Task ${id}`,
    impact: "Medium",
    effort,
    due_type: "none",
    status: "open",
    source: "taskstore",
    created: "2026-04-01T00:00:00.000Z",
    updated: "2026-04-01T00:00:00.000Z",
    score,
  };
}

function makeEvent(id: string, start: string, end: string): CalendarEvent {
  return {
    id,
    title: `Event ${id}`,
    start: `${DATE}T${start}:00`,
    end: `${DATE}T${end}:00`,
    source: "mscal",
    is_all_day: false,
  };
}

const builder = new DayPlanBuilder();

describe("DayPlanBuilder", () => {
  it("available time is working hours minus calendar event union", () => {
    // 08:00–17:00 = 540 min. Events: 09:00–10:00 and 09:30–10:30 (union = 90 min) → 450 min free
    const events = [makeEvent("e1", "09:00", "10:00"), makeEvent("e2", "09:30", "10:30")];
    const result = builder.buildPlan([], events, WORKING_HOURS, DATE);
    expect(result.availableMinutes).toBe(450);
  });

  it("schedules high-priority tasks before low-priority ones", () => {
    // Tasks must be passed in ranked order (scorer output) — high score first
    const tasks = [
      makeTask("high", 1, 8.0),
      makeTask("low", 1, 2.0),
    ];
    const result = builder.buildPlan(tasks, [], WORKING_HOURS, DATE);
    expect(result.scheduledItems[0].task.id).toBe("high");
    expect(result.scheduledItems[1].task.id).toBe("low");
  });

  it("defers tasks when total effort exceeds available time", () => {
    // 09:00–17:00 blocked by meeting (except none) = 9h free
    // Tasks total 12h → some deferred
    const tasks = [
      makeTask("t1", 5, 9),
      makeTask("t2", 5, 7),
      makeTask("t3", 5, 5),
    ];
    const result = builder.buildPlan(tasks, [], WORKING_HOURS, DATE);
    expect(result.deferredItems.length).toBeGreaterThan(0);
  });

  it("surfaces a conflict note when overcommitted", () => {
    const tasks = [makeTask("big", 20, 9)];
    const result = builder.buildPlan(tasks, [], WORKING_HOURS, DATE);
    expect(result.conflicts.length).toBeGreaterThan(0);
    expect(result.conflicts[0]).toContain("deferred");
  });

  it("produces valid markdown output with time blocks and conflicts sections", () => {
    const tasks = [makeTask("t1", 1, 5), makeTask("t2", 20, 3)];
    const result = builder.buildPlan(tasks, [], WORKING_HOURS, DATE);
    expect(result.markdown).toContain("# Day Plan");
    expect(result.markdown).toContain("## Time Blocks");
    expect(result.markdown).toContain("## Deferred");
    expect(result.markdown).toContain("## Conflicts");
  });

  it("handles non-working day by deferring all tasks", () => {
    const saturday = "2026-04-25"; // Saturday
    const tasks = [makeTask("t1", 1, 5)];
    const result = builder.buildPlan(tasks, [], WORKING_HOURS, saturday);
    expect(result.availableMinutes).toBe(0);
    expect(result.deferredItems).toHaveLength(1);
    expect(result.conflicts[0]).toContain("outside working days");
  });

  it("respects working hours boundary — tasks fit exactly in available window", () => {
    // Thursday: 08:00–17:00 = 540 min = 9h. Schedule one 9h task.
    const tasks = [makeTask("full", 9, 5)];
    const result = builder.buildPlan(tasks, [], WORKING_HOURS, DATE);
    expect(result.scheduledItems).toHaveLength(1);
    expect(result.deferredItems).toHaveLength(0);
  });
});
