import type { TaskItem, CalendarEvent, WorkingHours } from "../types/index.js";
import type { MSCalendarFetcher, GoogleCalendarFetcher, WorkingHoursFetcher } from "./calendar-fetchers.js";
import type { JiraFetcher, GitLabMRFetcher, TaskStoreFetcher } from "./task-fetchers.js";

export interface SourceAggregatorOptions {
  msCalendar: MSCalendarFetcher;
  googleCalendar: GoogleCalendarFetcher;
  workingHours: WorkingHoursFetcher;
  jira: JiraFetcher;
  gitlab: GitLabMRFetcher;
  taskStore: TaskStoreFetcher;
}

export class SourceAggregator {
  constructor(private opts: SourceAggregatorOptions) {}

  async fetchCalendarEvents(date: string): Promise<CalendarEvent[]> {
    const [ms, google] = await Promise.all([
      this.opts.msCalendar.fetchEvents(date),
      this.opts.googleCalendar.fetchEvents(date),
    ]);
    // Deduplicate by source+id
    return dedup([...ms, ...google], (e) => `${e.source}:${e.id}`);
  }

  async fetchWorkingHours(): Promise<WorkingHours> {
    return this.opts.workingHours.fetch();
  }

  async fetchAllTasks(): Promise<TaskItem[]> {
    const [jira, gitlab, store] = await Promise.all([
      this.opts.jira.fetchTasks(),
      this.opts.gitlab.fetchTasks(),
      this.opts.taskStore.fetchTasks(),
    ]);
    return dedup([...jira, ...gitlab, ...store], (t) => `${t.source}:${t.id}`);
  }
}

function dedup<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
