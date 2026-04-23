import type { RankedTaskItem, CalendarEvent, WorkingHours } from "../types/index.js";
import type { SourceAggregator } from "../aggregator/index.js";
import { score } from "../scorer/index.js";
import { DayPlanBuilder } from "../day-plan/index.js";
import type { TaskStore } from "../task-store/index.js";
import type { DayPlanResult } from "../day-plan/index.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrchestratorOptions {
  aggregator: SourceAggregator;
  taskStore: TaskStore;
}

export interface MorningBriefing {
  date: string;
  calendarEvents: CalendarEvent[];
  workingHours: WorkingHours;
  rankedTasks: RankedTaskItem[];
  dayPlan: DayPlanResult;
}

// ---------------------------------------------------------------------------
// AssistantOrchestrator
// ---------------------------------------------------------------------------

/**
 * Wires all assistant modules together.
 * Designed to be called by the OpenCode agent rules — not invoked directly by end users.
 */
export class AssistantOrchestrator {
  private builder = new DayPlanBuilder();

  constructor(private opts: OrchestratorOptions) {}

  /**
   * Execute the morning ritual for a given date (ISO YYYY-MM-DD).
   * Returns a structured briefing object. The caller is responsible for
   * presenting it to the user and driving the confirmation loop.
   */
  async morningBriefing(date: string): Promise<MorningBriefing> {
    const today = new Date(`${date}T12:00:00Z`);

    const [calendarEvents, workingHours, rawTasks] = await Promise.all([
      this.opts.aggregator.fetchCalendarEvents(date),
      this.opts.aggregator.fetchWorkingHours(),
      this.opts.aggregator.fetchAllTasks(),
    ]);

    const rankedTasks = score(rawTasks, today);
    const dayPlan = this.builder.buildPlan(rankedTasks, calendarEvents, workingHours, date);

    return { date, calendarEvents, workingHours, rankedTasks, dayPlan };
  }

  /**
   * Persist the agreed day plan to the task store.
   * Called after user confirms the plan during the morning ritual.
   */
  async saveDayPlan(date: string, content: string): Promise<void> {
    this.opts.taskStore.writePlan(date, content);
  }

  /**
   * Fetch and rank all open tasks from all sources.
   * Used for reactive "what are my open tasks?" queries.
   */
  async getRankedTasks(today: Date): Promise<RankedTaskItem[]> {
    const rawTasks = await this.opts.aggregator.fetchAllTasks();
    return score(rawTasks, today);
  }

  /**
   * Read today's day plan from the task store.
   * Returns null if no plan exists for the given date.
   */
  readDayPlan(date: string): string | null {
    return this.opts.taskStore.readPlan(date);
  }

  /**
   * Read the context.md file from the task store.
   */
  readContext(): string | null {
    return this.opts.taskStore.readContext();
  }
}
