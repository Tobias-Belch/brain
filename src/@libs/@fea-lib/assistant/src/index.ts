/**
 * Main public entry point for the assistant library.
 * Exports all modules, types, and the AssistantOrchestrator.
 */

// Types
export type {
  TaskItem,
  RankedTaskItem,
  CalendarEvent,
  CalendarSource,
  WorkingHours,
  WorkingHoursPartial,
  DayHours,
  Weekday,
  Impact,
  DueType,
  TaskStatus,
  TaskSource,
} from "./types/index.js";

// Task Store
export { TaskStore } from "./task-store/index.js";
export type { TaskStoreOptions } from "./task-store/index.js";

// Scorer
export { score } from "./scorer/index.js";

// Aggregator
export { SourceAggregator } from "./aggregator/index.js";
export { MSCalendarFetcher, GoogleCalendarFetcher, WorkingHoursFetcher } from "./aggregator/calendar-fetchers.js";
export { JiraFetcher, GitLabMRFetcher, TaskStoreFetcher } from "./aggregator/task-fetchers.js";
export type {
  MSCalendarMCPClient,
  GoogleCalendarMCPClient,
  RawMSCalendarEvent,
  RawGoogleCalendarEvent,
  RawWorkingHours,
} from "./aggregator/calendar-fetchers.js";
export type {
  JiraMCPClient,
  GitLabMCPClient,
  RawJiraIssue,
  RawGitLabMR,
} from "./aggregator/task-fetchers.js";

// Day Plan Builder
export { DayPlanBuilder } from "./day-plan/index.js";
export type { DayPlanResult, ScheduledItem, TimeSlot } from "./day-plan/index.js";

// Orchestrator
export { AssistantOrchestrator } from "./orchestrator/index.js";
export type { OrchestratorOptions, MorningBriefing } from "./orchestrator/index.js";
