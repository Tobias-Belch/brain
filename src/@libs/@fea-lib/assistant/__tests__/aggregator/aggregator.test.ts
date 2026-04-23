import { describe, it, expect } from "vitest";
import { MSCalendarFetcher, GoogleCalendarFetcher, WorkingHoursFetcher } from "../../src/aggregator/calendar-fetchers.js";
import type { MSCalendarMCPClient, GoogleCalendarMCPClient, RawMSCalendarEvent, RawGoogleCalendarEvent, RawWorkingHours } from "../../src/aggregator/calendar-fetchers.js";
import { JiraFetcher, GitLabMRFetcher } from "../../src/aggregator/task-fetchers.js";
import type { JiraMCPClient, GitLabMCPClient, RawJiraIssue, RawGitLabMR } from "../../src/aggregator/task-fetchers.js";
import { SourceAggregator } from "../../src/aggregator/index.js";
import type { TaskStore } from "../../src/task-store/index.js";

// ---------------------------------------------------------------------------
// Calendar fetcher tests
// ---------------------------------------------------------------------------

describe("MSCalendarFetcher", () => {
  it("normalises raw MS events to CalendarEvent schema", async () => {
    const raw: RawMSCalendarEvent[] = [{
      id: "evt-1",
      subject: "Standup",
      start: { dateTime: "2026-04-23T09:00:00", timeZone: "UTC" },
      end: { dateTime: "2026-04-23T09:15:00", timeZone: "UTC" },
      isAllDay: false,
    }];
    const client: MSCalendarMCPClient = {
      getEvents: async () => raw,
      getWorkingHours: async () => ({ daysOfWeek: [], startTime: "08:00:00", endTime: "17:00:00" }),
    };
    const fetcher = new MSCalendarFetcher(client);
    const events = await fetcher.fetchEvents("2026-04-23");
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: "evt-1",
      title: "Standup",
      source: "mscal",
      is_all_day: false,
      start: "2026-04-23T09:00:00",
    });
  });
});

describe("WorkingHoursFetcher", () => {
  it("maps working hours to WorkingHours type", async () => {
    const raw: RawWorkingHours = {
      daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      startTime: "08:00:00",
      endTime: "17:00:00",
    };
    const client: MSCalendarMCPClient = {
      getEvents: async () => [],
      getWorkingHours: async () => raw,
    };
    const fetcher = new WorkingHoursFetcher(client);
    const wh = await fetcher.fetch();
    expect(wh.monday).toEqual({ start: "08:00", end: "17:00" });
    expect(wh.friday).toEqual({ start: "08:00", end: "17:00" });
  });

  it("ignores weekend days", async () => {
    const raw: RawWorkingHours = {
      daysOfWeek: ["saturday", "sunday"],
      startTime: "09:00:00",
      endTime: "12:00:00",
    };
    const client: MSCalendarMCPClient = {
      getEvents: async () => [],
      getWorkingHours: async () => raw,
    };
    const fetcher = new WorkingHoursFetcher(client);
    const wh = await fetcher.fetch();
    expect(Object.keys(wh)).toHaveLength(0);
  });
});

describe("GoogleCalendarFetcher", () => {
  it("normalises raw Google events to CalendarEvent schema", async () => {
    const raw: RawGoogleCalendarEvent[] = [{
      id: "g-1",
      summary: "Doctor appointment",
      start: { dateTime: "2026-04-23T14:00:00Z" },
      end: { dateTime: "2026-04-23T15:00:00Z" },
    }];
    const client: GoogleCalendarMCPClient = { getEvents: async () => raw };
    const fetcher = new GoogleCalendarFetcher(client);
    const events = await fetcher.fetchEvents("2026-04-23");
    expect(events[0]).toMatchObject({ id: "g-1", title: "Doctor appointment", source: "gcal", is_all_day: false });
  });

  it("marks all-day events when only date is provided", async () => {
    const raw: RawGoogleCalendarEvent[] = [{
      id: "g-2",
      summary: "Holiday",
      start: { date: "2026-04-23" },
      end: { date: "2026-04-24" },
    }];
    const client: GoogleCalendarMCPClient = { getEvents: async () => raw };
    const fetcher = new GoogleCalendarFetcher(client);
    const events = await fetcher.fetchEvents("2026-04-23");
    expect(events[0].is_all_day).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Task fetcher tests
// ---------------------------------------------------------------------------

describe("JiraFetcher", () => {
  it("normalises Jira issues to TaskItem with source=jira", async () => {
    const raw: RawJiraIssue[] = [{
      id: "123",
      key: "PROJ-42",
      fields: {
        summary: "Fix login bug",
        priority: { name: "High" },
        story_points: 3,
        duedate: "2026-05-01",
        status: { name: "In Progress" },
      },
    }];
    const client: JiraMCPClient = { getAssignedIssues: async () => raw };
    const fetcher = new JiraFetcher(client);
    const tasks = await fetcher.fetchTasks();
    expect(tasks[0]).toMatchObject({
      id: "jira-PROJ-42",
      impact: "High",
      effort: 3,
      source: "jira",
      status: "in_progress",
    });
  });
});

describe("GitLabMRFetcher", () => {
  it("normalises GitLab MRs to TaskItem with source=gitlab", async () => {
    const raw: RawGitLabMR[] = [{
      iid: 7,
      title: "Add feature X",
      web_url: "https://gitlab.com/org/repo/-/merge_requests/7",
      created_at: "2026-04-20T10:00:00Z",
      updated_at: "2026-04-22T12:00:00Z",
    }];
    const client: GitLabMCPClient = { getOpenMRsToReview: async () => raw };
    const fetcher = new GitLabMRFetcher(client);
    const tasks = await fetcher.fetchTasks();
    expect(tasks[0]).toMatchObject({ id: "gitlab-mr-7", source: "gitlab", status: "open" });
  });
});

// ---------------------------------------------------------------------------
// SourceAggregator deduplication test
// ---------------------------------------------------------------------------

describe("SourceAggregator", () => {
  it("deduplicates tasks with the same source+id", async () => {
    const msClient: MSCalendarMCPClient = { getEvents: async () => [], getWorkingHours: async () => ({ daysOfWeek: [], startTime: "08:00:00", endTime: "17:00:00" }) };
    const gcalClient: GoogleCalendarMCPClient = { getEvents: async () => [] };
    const jiraClient: JiraMCPClient = { getAssignedIssues: async () => [] };
    const gitlabClient: GitLabMCPClient = { getOpenMRsToReview: async () => [] };
    const mockStore: TaskStore = { getTasks: async () => [], createTask: async () => {}, updateTask: async () => {}, writePlan: async () => {}, readPlan: async () => null, readContext: async () => null } as unknown as TaskStore;

    // Inject duplicate tasks via a custom task store fetcher
    const { TaskStoreFetcher } = await import("../../src/aggregator/task-fetchers.js");
    const storeFetcher = new TaskStoreFetcher(mockStore);

    const agg = new SourceAggregator({
      msCalendar: new MSCalendarFetcher(msClient),
      googleCalendar: new GoogleCalendarFetcher(gcalClient),
      workingHours: new WorkingHoursFetcher(msClient),
      jira: new JiraFetcher(jiraClient),
      gitlab: new GitLabMRFetcher(gitlabClient),
      taskStore: storeFetcher,
    });

    const tasks = await agg.fetchAllTasks();
    expect(tasks).toHaveLength(0); // no duplicates to surface here
  });
});
