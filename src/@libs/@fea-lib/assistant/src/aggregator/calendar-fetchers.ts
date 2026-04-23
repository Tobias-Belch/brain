import type { CalendarEvent, WorkingHours, Weekday, DayHours } from "../types/index.js";

// ---------------------------------------------------------------------------
// MCP client interfaces (injected at runtime, mocked in tests)
// ---------------------------------------------------------------------------

export interface RawMSCalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  isAllDay?: boolean;
}

export interface RawWorkingHours {
  daysOfWeek: string[]; // e.g. ["monday","tuesday",...]
  startTime: string;    // e.g. "08:00:00"
  endTime: string;      // e.g. "17:00:00"
}

export interface MSCalendarMCPClient {
  getEvents(date: string): Promise<RawMSCalendarEvent[]>;
  getWorkingHours(): Promise<RawWorkingHours>;
}

export interface RawGoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export interface GoogleCalendarMCPClient {
  getEvents(date: string): Promise<RawGoogleCalendarEvent[]>;
}

// ---------------------------------------------------------------------------
// MS Calendar Fetcher
// ---------------------------------------------------------------------------

export class MSCalendarFetcher {
  constructor(private client: MSCalendarMCPClient) {}

  async fetchEvents(date: string): Promise<CalendarEvent[]> {
    const raw = await this.client.getEvents(date);
    return raw.map((e) => ({
      id: e.id,
      title: e.subject,
      start: e.start.dateTime,
      end: e.end.dateTime,
      source: "mscal" as const,
      is_all_day: e.isAllDay ?? false,
    }));
  }
}

// ---------------------------------------------------------------------------
// Working Hours Fetcher
// ---------------------------------------------------------------------------

const DAY_MAP: Record<string, Weekday> = {
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
};

export class WorkingHoursFetcher {
  constructor(private client: MSCalendarMCPClient) {}

  async fetch(): Promise<WorkingHours> {
    const raw = await this.client.getWorkingHours();
    const hours: WorkingHours = {};
    for (const day of raw.daysOfWeek) {
      const weekday = DAY_MAP[day.toLowerCase()];
      if (weekday) {
        // Raw times may be "HH:MM:SS" — truncate to "HH:MM"
        const start = raw.startTime.slice(0, 5);
        const end = raw.endTime.slice(0, 5);
        hours[weekday] = { start, end } satisfies DayHours;
      }
    }
    return hours;
  }
}

// ---------------------------------------------------------------------------
// Google Calendar Fetcher
// ---------------------------------------------------------------------------

export class GoogleCalendarFetcher {
  constructor(private client: GoogleCalendarMCPClient) {}

  async fetchEvents(date: string): Promise<CalendarEvent[]> {
    const raw = await this.client.getEvents(date);
    return raw.map((e) => {
      const isAllDay = !e.start.dateTime;
      return {
        id: e.id,
        title: e.summary,
        start: e.start.dateTime ?? `${e.start.date}T00:00:00.000Z`,
        end: e.end.dateTime ?? `${e.end.date}T00:00:00.000Z`,
        source: "gcal" as const,
        is_all_day: isAllDay,
      };
    });
  }
}
