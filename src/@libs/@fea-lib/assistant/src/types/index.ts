/**
 * Shared type definitions for the AI personal assistant.
 * All modules consume these types — they are the contract between fetchers,
 * scorer, task store, and day plan builder.
 */

// ---------------------------------------------------------------------------
// TaskItem
// ---------------------------------------------------------------------------

export type Impact = "High" | "Medium" | "Low";
export type DueType = "hard" | "soft" | "none";
export type TaskStatus = "open" | "in_progress" | "done" | "deferred";
export type TaskSource = "jira" | "gcal" | "mscal" | "gitlab" | "taskstore";

export interface TaskItem {
  id: string;
  title: string;
  impact: Impact;
  /** Estimated effort in hours */
  effort: number;
  /** ISO date string (YYYY-MM-DD), undefined if no due date */
  due?: string;
  due_type: DueType;
  status: TaskStatus;
  source: TaskSource;
  /** ISO datetime string */
  created: string;
  /** ISO datetime string */
  updated: string;
  /**
   * When set, overrides the computed ICE-lite rank.
   * Lower number = higher position (1 = top).
   */
  rank_override?: number;
}

// ---------------------------------------------------------------------------
// RankedTaskItem
// ---------------------------------------------------------------------------

export interface RankedTaskItem extends TaskItem {
  /** Computed ICE-lite composite score. Higher = more important. */
  score: number;
}

// ---------------------------------------------------------------------------
// CalendarEvent
// ---------------------------------------------------------------------------

export type CalendarSource = "mscal" | "gcal";

export interface CalendarEvent {
  id: string;
  title: string;
  /** ISO datetime string */
  start: string;
  /** ISO datetime string */
  end: string;
  source: CalendarSource;
  is_all_day: boolean;
}

// ---------------------------------------------------------------------------
// WorkingHours
// ---------------------------------------------------------------------------

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export interface DayHours {
  /** HH:MM 24-hour format, e.g. "08:00" */
  start: string;
  /** HH:MM 24-hour format, e.g. "17:00" */
  end: string;
}

/** Working hours keyed by weekday. Days not present are treated as non-working. */
export type WorkingHours = Partial<Record<Weekday, DayHours>>;
