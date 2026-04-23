# Merge-Readiness Pack: ai-personal-assistant

## Checklist
- [x] All implementable tickets in 5-plan.md marked complete (T-04 through T-13)
- [x] Tests pass — 34/34 (see below)
- [x] No regressions — new module, no existing code modified
- [x] Acceptance criteria from each ticket met (see ticket statuses in 5-plan.md)
- [ ] T-01: MS Office Calendar MCP validation — **awaiting user action (OAuth setup)**
- [ ] T-02: Google Calendar MCP validation — **awaiting user action (OAuth setup)**
- [ ] T-03: Private GitHub task store repo — **awaiting user action (repo creation)**

## Test results

```
> @fea-lib/assistant@0.1.0 test
> vitest run

 Test Files  4 passed (4)
      Tests  34 passed (34)
   Duration  ~5s
```

## Audit trail

### What was built

**T-04 — Shared types** (`src/types/index.ts`): `TaskItem`, `RankedTaskItem`, `CalendarEvent`,
`WorkingHours`, `DayHours`, `Weekday` and all supporting union types. Added `WorkingHours` type
(was missing from original plan, found during refinement).

**T-05 — TaskStore** (`src/task-store/index.ts`): Git-backed markdown task store with
`getTasks()`, `createTask()`, `updateTask()`, `writePlan()`, `readPlan()`, `readContext()`.
YAML frontmatter parse/write is self-contained (no extra deps). Tested against a temp local
git repo fixture — no network required.

**T-06 — Calendar fetchers** (`src/aggregator/calendar-fetchers.ts`): `MSCalendarFetcher`,
`GoogleCalendarFetcher`, `WorkingHoursFetcher`. All accept injected MCP client interfaces
for testability. `WorkingHoursFetcher.fetch()` returns the typed `WorkingHours` object.

**T-07 — Task fetchers** (`src/aggregator/task-fetchers.ts`): `JiraFetcher`, `GitLabMRFetcher`,
`TaskStoreFetcher`. All normalise to `TaskItem[]`. `SourceAggregator` deduplicates by
`source:id` key.

**T-08 — ICE-lite Scorer** (`src/scorer/index.ts`): Pure `score()` function. Impact→3/2/1,
effort inverse via `3/√effort`, earliness with hard×1.5/soft×1.0 weighting. `rank_override`
inserts task at specified position after sorting the rest. Tie-break by `created` date.

**T-09 — DayPlanBuilder** (`src/day-plan/index.ts`): Computes available time by merging
overlapping calendar events (union, not sum). Allocates tasks in ranked order. Defers tasks
that exceed available time. Emits conflict notes. Produces structured markdown with Calendar,
Time Blocks, Deferred, and Conflicts sections.

**T-10/T-11/T-12 — Orchestrator** (`src/orchestrator/index.ts`): `AssistantOrchestrator`
wires aggregator, scorer, day plan builder, and task store. Provides `morningBriefing()`,
`saveDayPlan()`, `getRankedTasks()`, `readDayPlan()`, `readContext()`. Conversational flows
(task capture, updates, reactive queries) are governed by `AGENTS.md` rules.

**T-13 — OpenCode rules** (`AGENTS.md`): Full assistant persona, data source table, action
confirmation protocol, ICE-lite definition, working hours, morning ritual steps, task capture
rules, reactive query handling, task store structure, and codebase reference. Context template
at `docs/tools/assistant/context-template.md`.

### Notable decisions

- **No extra dependencies**: frontmatter parsing is hand-rolled (10 lines) to avoid pulling
  in a YAML library. The format is simple enough to not warrant it.
- **T-06 MCP clients are injected interfaces**: the fetchers never import from MCP SDKs
  directly. This keeps them testable now and swappable when real MCPs are wired in (T-01/T-02).
- **T-11/T-12 are agent-layer concerns**: conversational task capture and reactive queries
  are implemented as LLM behaviour rules in `AGENTS.md` backed by the `TaskStore` and
  `AssistantOrchestrator` APIs. There is no separate "handler" code because the OpenCode
  runtime is the handler.
- **T-01, T-02, T-03 remain open**: these are validation spikes requiring live OAuth setup
  and manual repo creation. They cannot be automated by the agent. See below.

### Remaining user actions before full activation

1. **T-01**: Set up MS Graph OAuth app (scopes: `Calendars.Read`, `MailboxSettings.Read`),
   configure an MS Office Calendar MCP server in `opencode.json`, verify live queries work,
   document findings in `.adw/ai-personal-assistant/findings-t01.md`.

2. **T-02**: Set up Google OAuth credentials (scope: `calendar.readonly`), configure a
   Google Calendar MCP server in `opencode.json`, verify live queries work,
   document findings in `.adw/ai-personal-assistant/findings-t02.md`.

3. **T-03**: Create a private GitHub repository for the task store. Initialise with
   `tasks/`, `plans/`, and copy `docs/tools/assistant/context-template.md` → `context.md`.
   Clone locally. Configure `TaskStore` with the local repo path. Verify push works.
   Document repo URL in `.adw/ai-personal-assistant/findings-t03.md`.

Once T-01–T-03 are complete, fill in `docs/tools/assistant/context-template.md` sections
and add the MCP servers to `opencode.json`. The assistant is then fully operational.
