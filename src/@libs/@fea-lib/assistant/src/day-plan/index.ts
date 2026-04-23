import type { RankedTaskItem, CalendarEvent, WorkingHours, Weekday } from "../types/index.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimeSlot {
  start: string; // HH:MM
  end: string;   // HH:MM
  availableMinutes: number;
}

export interface ScheduledItem {
  start: string;
  end: string;
  task: RankedTaskItem;
}

export interface DayPlanResult {
  date: string;
  availableMinutes: number;
  scheduledItems: ScheduledItem[];
  deferredItems: RankedTaskItem[];
  conflicts: string[];
  markdown: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WEEKDAY_NAMES: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getWeekday(date: Date): Weekday | null {
  const idx = date.getDay(); // 0=Sun,1=Mon,...,5=Fri,6=Sat
  if (idx === 0 || idx === 6) return null;
  return WEEKDAY_NAMES[idx - 1];
}

/**
 * Compute available time slots after subtracting calendar events (union merge).
 * Returns a list of free slots within the working window.
 */
function computeAvailableSlots(
  workStart: number,
  workEnd: number,
  events: CalendarEvent[],
  date: string
): TimeSlot[] {
  // Filter to timed events on this date (not all-day)
  const dayEvents = events
    .filter((e) => !e.is_all_day && e.start.startsWith(date))
    .map((e) => ({
      start: Math.max(toMinutes(e.start.slice(11, 16)), workStart),
      end: Math.min(toMinutes(e.end.slice(11, 16)), workEnd),
    }))
    .filter((e) => e.end > e.start)
    .sort((a, b) => a.start - b.start);

  // Merge overlapping events
  const merged: { start: number; end: number }[] = [];
  for (const ev of dayEvents) {
    if (merged.length === 0 || ev.start > merged[merged.length - 1].end) {
      merged.push({ ...ev });
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, ev.end);
    }
  }

  // Compute free slots
  const slots: TimeSlot[] = [];
  let cursor = workStart;
  for (const busy of merged) {
    if (busy.start > cursor) {
      slots.push({
        start: fromMinutes(cursor),
        end: fromMinutes(busy.start),
        availableMinutes: busy.start - cursor,
      });
    }
    cursor = Math.max(cursor, busy.end);
  }
  if (cursor < workEnd) {
    slots.push({
      start: fromMinutes(cursor),
      end: fromMinutes(workEnd),
      availableMinutes: workEnd - cursor,
    });
  }
  return slots;
}

// ---------------------------------------------------------------------------
// Day Plan Builder
// ---------------------------------------------------------------------------

export class DayPlanBuilder {
  buildPlan(
    rankedTasks: RankedTaskItem[],
    calendarEvents: CalendarEvent[],
    workingHours: WorkingHours,
    date: string
  ): DayPlanResult {
    const dateObj = new Date(`${date}T12:00:00Z`);
    const weekday = getWeekday(dateObj);

    const conflicts: string[] = [];
    const scheduled: ScheduledItem[] = [];
    const deferred: RankedTaskItem[] = [];

    if (!weekday || !workingHours[weekday]) {
      conflicts.push(`${date} is outside working days — no time blocks generated.`);
      return {
        date,
        availableMinutes: 0,
        scheduledItems: [],
        deferredItems: rankedTasks,
        conflicts,
        markdown: this.renderMarkdown(date, 0, [], rankedTasks, conflicts, calendarEvents),
      };
    }

    const dayHours = workingHours[weekday]!;
    const workStart = toMinutes(dayHours.start);
    const workEnd = toMinutes(dayHours.end);
    const totalWorkMinutes = workEnd - workStart;

    const slots = computeAvailableSlots(workStart, workEnd, calendarEvents, date);
    const availableMinutes = slots.reduce((sum, s) => sum + s.availableMinutes, 0);

    let totalTaskMinutes = 0;
    for (const t of rankedTasks) {
      totalTaskMinutes += t.effort * 60;
    }

    if (totalTaskMinutes > availableMinutes) {
      const meetingMinutes = totalWorkMinutes - availableMinutes;
      conflicts.push(
        `You have ${Math.round(meetingMinutes / 60 * 10) / 10}h of meetings and ` +
        `${Math.round(totalTaskMinutes / 60 * 10) / 10}h of tasks, but only ` +
        `${Math.round(availableMinutes / 60 * 10) / 10}h available. ` +
        `Some tasks have been deferred.`
      );
    }

    // Allocate tasks into slots
    const slotQueue = [...slots];
    let slotIdx = 0;
    let slotCursor = slotQueue[0] ? toMinutes(slotQueue[0].start) : workStart;

    for (const task of rankedTasks) {
      const taskMinutes = Math.round(task.effort * 60);
      let remaining = taskMinutes;
      let taskStartStr: string | null = null;
      let allocated = 0;

      while (remaining > 0 && slotIdx < slotQueue.length) {
        const slot = slotQueue[slotIdx];
        const slotEnd = toMinutes(slot.end);
        const available = slotEnd - slotCursor;

        if (available <= 0) {
          slotIdx++;
          if (slotIdx < slotQueue.length) slotCursor = toMinutes(slotQueue[slotIdx].start);
          continue;
        }

        if (!taskStartStr) taskStartStr = fromMinutes(slotCursor);
        const use = Math.min(remaining, available);
        remaining -= use;
        allocated += use;
        slotCursor += use;

        if (slotCursor >= slotEnd) {
          slotIdx++;
          if (slotIdx < slotQueue.length) slotCursor = toMinutes(slotQueue[slotIdx].start);
        }
      }

      if (allocated > 0 && taskStartStr) {
        scheduled.push({
          start: taskStartStr,
          end: fromMinutes(toMinutes(taskStartStr) + allocated),
          task,
        });
        if (remaining > 0) deferred.push(task); // partially allocated — flag as deferred too
      } else {
        deferred.push(task);
      }
    }

    const markdown = this.renderMarkdown(date, availableMinutes, scheduled, deferred, conflicts, calendarEvents);
    return { date, availableMinutes, scheduledItems: scheduled, deferredItems: deferred, conflicts, markdown };
  }

  private renderMarkdown(
    date: string,
    availableMinutes: number,
    scheduled: ScheduledItem[],
    deferred: RankedTaskItem[],
    conflicts: string[],
    events: CalendarEvent[]
  ): string {
    const lines: string[] = [`# Day Plan — ${date}`, ""];

    // Calendar events
    const timedEvents = events.filter((e) => !e.is_all_day && e.start.startsWith(date));
    if (timedEvents.length > 0) {
      lines.push("## Calendar");
      for (const e of timedEvents.sort((a, b) => a.start.localeCompare(b.start))) {
        lines.push(`- **${e.start.slice(11, 16)}–${e.end.slice(11, 16)}** ${e.title} _(${e.source})_`);
      }
      lines.push("");
    }

    // Time blocks
    lines.push("## Time Blocks");
    if (scheduled.length === 0) {
      lines.push("_No tasks scheduled._");
    } else {
      for (const item of scheduled.sort((a, b) => a.start.localeCompare(b.start))) {
        const effort = item.task.effort;
        lines.push(
          `- **${item.start}–${item.end}** ${item.task.title} ` +
          `_(${effort}h, ${item.task.impact} impact, score: ${item.task.score.toFixed(1)})_`
        );
      }
    }
    lines.push("");

    // Deferred
    if (deferred.length > 0) {
      lines.push("## Deferred");
      for (const t of deferred) {
        lines.push(`- ${t.title} _(${t.effort}h, ${t.impact} impact)_`);
      }
      lines.push("");
    }

    // Conflicts
    if (conflicts.length > 0) {
      lines.push("## Conflicts");
      for (const c of conflicts) {
        lines.push(`> ⚠️ ${c}`);
      }
      lines.push("");
    }

    lines.push(`_Available time: ${Math.round(availableMinutes / 60 * 10) / 10}h_`);
    return lines.join("\n");
  }
}
