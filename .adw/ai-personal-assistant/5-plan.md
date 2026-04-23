# Implementation Plan: ai-personal-assistant

## Tickets

### T-01: Validate MS Office Calendar MCP
**Description:** Research and identify a production-ready MCP server for Microsoft Graph / Outlook Calendar. Complete Microsoft Graph OAuth app registration with scopes `Calendars.Read` and `MailboxSettings.Read`. Configure the MCP in OpenCode. Verify that (a) today's calendar events can be read, and (b) working hours / mailbox settings can be read. Document the MCP server name, config, and any limitations.
**Acceptance criteria:**
- A live query from within OpenCode returns today's MS Calendar events.
- A live query returns the configured working hours from MS Office Calendar.
- MCP server name and configuration are documented in `.adw/ai-personal-assistant/findings-t01.md`.
- If auth or MCP configuration fails, the error message is human-readable and identifies the misconfigured field.
**Blocks:** T-04, T-06, T-08, T-10
**Blocked by:** none

---

### T-02: Validate Google Calendar MCP
**Description:** Research and identify a production-ready MCP server for Google Calendar. Complete Google OAuth setup (credentials, scope `https://www.googleapis.com/auth/calendar.readonly`). Configure the MCP in OpenCode. Verify that today's events from the primary calendar can be read. Document the MCP server name, config, and any limitations.
**Acceptance criteria:**
- A live query from within OpenCode returns today's Google Calendar events.
- MCP server name and configuration are documented in `.adw/ai-personal-assistant/findings-t02.md`.
- If auth or MCP configuration fails, the error message is human-readable and identifies the misconfigured field.
**Blocks:** T-04, T-06, T-08
**Blocked by:** none

---

### T-03: Create and validate private GitHub task store repo
**Description:** Create a private GitHub repository for the task store. Initialise the folder structure: `tasks/`, `plans/`, `context.md` (with placeholder content). Verify that the assistant can pull, write a file, commit, and push — either via the GitHub MCP or git CLI — from within OpenCode.
**Acceptance criteria:**
- Private GitHub repo exists with `tasks/`, `plans/`, `context.md`.
- A test task file is created, committed, and pushed from within OpenCode without manual git intervention.
- Repo URL is documented in `.adw/ai-personal-assistant/findings-t03.md`.
**Blocks:** T-05, T-07, T-09, T-11, T-12, T-13
**Blocked by:** none

---

### T-04: Define unified TaskItem and CalendarEvent schemas
**Status: complete**
**Description:** Define the TypeScript interfaces for `TaskItem` (normalised task from any source) and `CalendarEvent` (normalised calendar event from any source). Also define `RankedTaskItem` (extends `TaskItem` with `score` and optional `rank_override`). These schemas are the contract between all modules — they must be stable before any fetcher or scorer is built. Place in a shared types package or file.
**Acceptance criteria:**
- `TaskItem` includes: `id`, `title`, `impact` (High/Medium/Low), `effort` (hours), `due` (date | undefined), `due_type` (hard | soft | none), `status`, `source` (jira | gcal | mscal | gitlab | taskstore), `created`, `updated`, `rank_override` (optional number).
- `CalendarEvent` includes: `id`, `title`, `start`, `end`, `source` (mscal | gcal), `is_all_day`.
- `RankedTaskItem` extends `TaskItem` with `score: number`.
- `WorkingHours` type is defined: `{ [day in 'monday'|'tuesday'|'wednesday'|'thursday'|'friday']: { start: string; end: string } }`.
- Types are exported from a single entry point.
**Blocks:** T-05, T-06, T-07, T-08
**Blocked by:** T-01, T-02 (schemas should reflect what these MCPs can actually return)

---

### T-05: Implement Task Store module
**Status: complete**
**Description:** Implement the `TaskStore` module that encapsulates all read/write operations against the private GitHub task store repo. Interface: `getTasks(): TaskItem[]`, `createTask(task): void`, `updateTask(id, patch): void`, `writePlan(date, content): void`. The module handles git pull before reads and git commit+push after writes, transparently. Task files are read/written as markdown with YAML frontmatter matching the `TaskItem` schema.
**Acceptance criteria:**
- `getTasks()` pulls the repo and returns all tasks from `tasks/` as `TaskItem[]`.
- `createTask()` writes a new markdown file to `tasks/`, commits, and pushes; file frontmatter matches the `TaskItem` schema exactly.
- `updateTask()` patches only the specified fields, preserving all other frontmatter; commits and pushes.
- `writePlan()` writes `plans/YYYY-MM-DD.md` with the provided content; commits and pushes.
- All git operations are internal — callers do not interact with git directly.
- Tests live under `src/task-store/__tests__/` and run against a local git repo fixture initialised in a temp directory; no network access is required.
**Blocks:** T-09, T-11, T-12, T-13
**Blocked by:** T-03, T-04

---

### T-06: Implement Source Aggregator — calendar fetchers
**Status: complete**
**Description:** Implement `MSCalendarFetcher` and `GoogleCalendarFetcher`. Each fetcher calls the relevant MCP and normalises the response into `CalendarEvent[]`. Also implement `WorkingHoursFetcher` that reads working hours from MS Office Calendar and returns a structured `WorkingHours` object (days + start/end times). Wire both fetchers into the `SourceAggregator`.
**Acceptance criteria:**
- `MSCalendarFetcher.fetchEvents(date)` returns today's MS Calendar events as `CalendarEvent[]`.
- `GoogleCalendarFetcher.fetchEvents(date)` returns today's Google Calendar events as `CalendarEvent[]`.
- `WorkingHoursFetcher.fetch()` returns a `WorkingHours` object (as defined in T-04) sourced from MS Office Calendar.
- Both fetchers normalise to the `CalendarEvent` schema — no raw MCP response leaks out.
- Unit tests pass with mocked MCP responses.
**Blocks:** T-08, T-10
**Blocked by:** T-01, T-02, T-04

---

### T-07: Implement Source Aggregator — task fetchers (Jira, GitLab, TaskStore)
**Status: complete**
**Description:** Implement `JiraFetcher`, `GitLabMRFetcher`, and `TaskStoreFetcher`. Each normalises its source's data into `TaskItem[]`. `JiraFetcher` returns assigned/in-progress tickets. `GitLabMRFetcher` returns open MRs awaiting review. `TaskStoreFetcher` delegates to the `TaskStore` module. Wire all three into the `SourceAggregator`.
**Acceptance criteria:**
- `JiraFetcher.fetchTasks()` returns assigned/in-progress Jira tickets as `TaskItem[]` with `source: 'jira'`.
- `GitLabMRFetcher.fetchTasks()` returns open GitLab MRs as `TaskItem[]` with `source: 'gitlab'`.
- `TaskStoreFetcher.fetchTasks()` returns all open tasks from the task store as `TaskItem[]` with `source: 'taskstore'`.
- All three normalise to the `TaskItem` schema — no source-specific fields leak out.
- Aggregator deduplicates items with the same `source` + `id`.
- Unit tests pass with mocked MCP/TaskStore responses.
**Blocks:** T-08
**Blocked by:** T-03, T-04, T-05

---

### T-08: Implement ICE-lite Scorer
**Status: complete**
**Description:** Implement the `IceLiteScorer` as a pure function: `score(tasks: TaskItem[], today: Date): RankedTaskItem[]`. Scoring dimensions: Impact (H=3, M=2, L=1), Effort (inverse — lower effort → higher score for equal impact), Earliness (days until due; hard deadlines weighted 1.5× soft; no due date treated as soft/low urgency). Output is sorted descending by score. `rank_override` on a task bypasses computed score and pins it to the specified position.
**Acceptance criteria:**
- A high-impact, low-effort, hard-due-today task scores above a medium-impact, high-effort, soft-due-next-week task.
- Hard due dates score higher than soft due dates at equal proximity.
- `rank_override` overrides computed rank without modifying the score field.
- Tasks with no due date sort below tasks with any due date at equal impact/effort.
- Ties are broken by `created` date (older task ranks higher).
- Pure function — no I/O, no side effects. All test cases pass with no mocks needed.
**Blocks:** T-09, T-10
**Blocked by:** T-04, T-06, T-07

---

### T-09: Implement Day Plan Builder
**Status: complete**
**Description:** Implement the `DayPlanBuilder` module. Input: `RankedTaskItem[]`, `CalendarEvent[]` (today), `WorkingHours`. Output: a structured markdown day plan string with time blocks. The builder computes available time slots (working hours minus calendar events), allocates tasks in ranked order (using `effort` as duration), and formats the result as a markdown schedule. Surfaced conflicts (overcommitment, boundary violations) are included as a section in the output.
**Acceptance criteria:**
- Available time is computed as working hours minus the union of calendar event time ranges (overlapping events are merged before subtraction, not summed).
- Tasks are allocated in descending score order, filling available slots.
- If total task effort exceeds available time, remaining tasks appear in a "Deferred" section with a conflict note.
- Tasks scheduled outside working hours (due to overcommitment) are flagged, not silently placed.
- Output is valid markdown with time blocks, task names, effort estimates, and a conflicts section (if any).
- Unit tests pass with fixed inputs — no I/O or mocks needed.
**Blocks:** T-10
**Blocked by:** T-03, T-05, T-08

---

### T-10: Implement morning ritual flow and `/morning` entry point
**Status: complete**
**Description:** Wire all modules into the `/morning` ritual. When triggered, the assistant: (1) calls `WorkingHoursFetcher`, (2) calls all source fetchers via `SourceAggregator`, (3) runs `IceLiteScorer`, (4) runs `DayPlanBuilder`, (5) presents the structured briefing to the user (time constraints → ranked task list → proposed time blocks → conflicts), (6) enters a collaborative loop accepting user amendments, (7) on user confirmation writes the final plan via `TaskStore.writePlan()` and notes it inline.
**Acceptance criteria:**
- `/morning` produces a briefing covering: today's calendar events (both sources), Jira tasks, GitLab MRs, task store tasks — all ranked.
- The proposed day plan respects working hours sourced from MS Office Calendar.
- Conflicts (overcommitment, boundary violations) are surfaced in the briefing.
- The collaborative loop continues until the user provides explicit confirmation ("yes", "confirm", "go ahead", or equivalent); the loop terminates only on explicit confirmation or explicit deferral ("skip plan", "no plan today").
- The finalised plan is written to `plans/YYYY-MM-DD.md` in the task store after user confirmation.
- The assistant notes the write inline: "Day plan saved: plans/YYYY-MM-DD.md".
**Blocks:** none
**Blocked by:** T-01, T-02, T-06, T-07, T-08, T-09

---

### T-11: Implement conversational task capture and update
**Status: complete** (implemented via AGENTS.md rules + TaskStore module)
**Description:** Implement the reactive task capture and update flows. Task capture: user describes a task conversationally → assistant infers `title`, `impact`, `effort`, `due`, `due_type` from the description (asking clarifying questions if needed) → calls `TaskStore.createTask()` → notes the result. Task update: user describes a change → assistant maps it to the correct `updateTask()` patch → calls `TaskStore.updateTask()` → notes the result including the `rank_override` field if priority was overridden.
**Acceptance criteria:**
- A conversational task description results in a new markdown file in `tasks/` with correct frontmatter.
- A conversational update patches only the described fields, leaving all others unchanged.
- A priority override ("this is more urgent") sets `rank_override` in the task file.
- The assistant acknowledges every write: "Created task: X" or "Updated task: X".
- If `title`, `impact`, or `effort` cannot be inferred from the description, the assistant asks one clarifying question per missing field before writing.
**Blocks:** none
**Blocked by:** T-05

---

### T-12: Implement "what are my open tasks?" reactive query
**Status: complete** (implemented via AGENTS.md rules + AssistantOrchestrator.getRankedTasks/readDayPlan)
**Description:** Implement the reactive ranked task list query. When the user asks for their open tasks (any natural phrasing), the assistant fetches all sources via `SourceAggregator`, runs `IceLiteScorer`, and presents the ranked list. Also implement the "what did I plan to do today?" query, which reads today's plan file from the task store and presents it, or prompts the user to run `/morning` if no plan exists for today.
**Acceptance criteria:**
- "What are my open tasks?" returns a ranked list from all sources (Jira, GitLab, task store).
- "What did I plan to do today?" returns the contents of `plans/YYYY-MM-DD.md` if it exists.
- If no plan exists for today, the assistant responds: "No plan found for today. Run `/morning` to create one."
**Blocks:** none
**Blocked by:** T-05, T-07, T-08

---

### T-13: Author OpenCode rules and initialise context.md
**Status: complete**
**Description:** Write the OpenCode rules file (agent persona, source list, action confirmation protocol, ICE-lite framework definition, working hours) that is always active in the assistant's context. Also write the initial `context.md` in the task store with placeholders for: Jira projects, recurring preferences, ongoing project notes, working style. This is the persistent memory layer described in the PRD.
**Acceptance criteria:**
- OpenCode rules file defines: assistant persona, all data sources and their write policies, action confirmation protocol, ICE-lite scoring dimensions, working hours and their source.
- `context.md` exists in the task store with clearly labelled sections for each category of personal context.
- The assistant correctly refuses autonomous calendar/Jira writes when tested (action policy is in effect).
- The assistant correctly allows autonomous task store writes when tested.
**Blocks:** T-10, T-11, T-12
**Blocked by:** T-03

---

## Dependency graph

```
T-01 → T-04, T-06, T-08, T-10
T-02 → T-04, T-06, T-08, T-10
T-03 → T-05, T-07, T-09, T-11, T-12, T-13
T-04 → T-05, T-06, T-07, T-08
T-05 → T-07, T-09, T-11, T-12
T-06 → T-08, T-10
T-07 → T-08
T-08 → T-09, T-10, T-12
T-09 → T-10
T-13 → T-10, T-11, T-12
```

**Critical path:** T-01 → T-04 → T-06 → T-08 → T-09 → T-10

T-01, T-02, T-03 are independent and can run in parallel as the first wave of work.
```

## Refinement notes

- T-01: Added AC for human-readable error on auth/MCP misconfiguration.
- T-02: Added AC for human-readable error on auth/MCP misconfiguration.
- T-04: Added `WorkingHours` type definition — was referenced in T-06 but not defined in the schema ticket.
- T-05: Clarified test location and fixture strategy (`src/task-store/__tests__/`, temp dir, no network).
- T-06: Updated `WorkingHoursFetcher` AC to reference the `WorkingHours` type from T-04 (was an inline struct).
- T-09: Clarified overlapping event handling — available time uses union of event ranges, not sum of durations.
- T-10: Added AC specifying termination condition for the collaborative loop (explicit user confirmation or deferral).
- T-11: Sharpened the "ask before writing" AC — one clarifying question per missing required field.
