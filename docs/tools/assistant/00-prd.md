---
title: "PRD: AI-Driven Personal Assistant — Task & Time Management"
---

## Problem Statement

Tasks, appointments, and work items are scattered across multiple systems — Jira boards (work tickets), MS Office Calendar (work schedule and appointments), Google Calendar (private appointments), and GitLab (pull requests awaiting review or action). There is no single place to get a clear picture of what is on my plate, what is most important, and how to allocate my time on any given day.

The result is that prioritisation is done by gut feeling and proximity to due dates, context-switching between tools is constant, work items that don't belong in an official Jira board (personal work tracking, private tasks) have no home, and there is no structured daily planning ritual — leading to reactive rather than intentional time use.

## Solution

An AI-powered personal assistant, running inside OpenCode, that:

1. **Aggregates** tasks and appointments from all sources (Jira, MS Office Calendar, Google Calendar, GitLab PRs, and a private task store) into a single conversational interface.
2. **Captures** tasks that have no official home in a private Git-backed markdown task store that the user fully owns and controls.
3. **Runs a structured morning ritual** (`/morning`) that surfaces the day's obligations, ranks open tasks using a lightweight priority framework, and collaboratively produces a written day plan.
4. **Stays reactive** throughout the day — the user can ask for status, create or update tasks, or adjust the day plan at any time.

The assistant never takes autonomous write actions on external systems (Jira, calendars). All mutations to those systems require explicit user confirmation. The only autonomous write action is to the private task store, which is always noted to the user.

## User Stories

1. As a user, I want to run `/morning` and receive a structured briefing of today's calendar events from both my work and private calendars, so that I start the day with a complete picture of my time constraints.
2. As a user, I want the morning briefing to include all Jira tickets currently assigned to me or in progress, so that I don't need to open Jira to understand my work obligations.
3. As a user, I want the morning briefing to include all GitLab merge requests awaiting my review, so that I am aware of pending review obligations without switching to GitLab.
4. As a user, I want the morning briefing to include all open tasks from my private task store, so that non-Jira tasks are surfaced alongside official work items.
5. As a user, I want all items in the morning briefing to be ranked by a priority score based on Impact, Effort, and Due Date, so that I can immediately see what matters most today.
6. As a user, I want to collaboratively build a time-blocked day plan during the morning ritual, so that I leave the session with a clear schedule rather than a vague priority list.
7. As a user, I want the agreed day plan to be saved as a daily note in my private task store, so that I have a record of my intentions and can refer back to it.
8. As a user, I want the assistant to respect my working hours (Mon–Thu 08:00–17:00, Fri 09:00–12:00) when suggesting a day plan, so that it never schedules work outside my available hours without flagging it.
9. As a user, I want the assistant to surface conflicts between available time and task volume (e.g. "You have 5h of meetings and 3 high-priority tickets due today"), so that I can make explicit trade-off decisions rather than discovering overcommitment mid-day.
10. As a user, I want to capture a new task by describing it conversationally, so that I don't need to context-switch to another tool for quick capture.
11. As a user, I want newly captured tasks to be written to my private task store automatically, with the assistant noting "Created task: X", so that I stay informed without needing to confirm every write.
12. As a user, I want to update the status or priority of a task in my private task store by describing the change conversationally, so that keeping the task store current is low-friction.
13. As a user, I want to ask "what are my open tasks?" at any point during the day and get a current, ranked list, so that I can re-orient quickly after interruptions.
14. As a user, I want to ask the assistant to create a Jira ticket on my behalf, and have it ask for confirmation before doing so, so that I retain control over what enters the official work tracking system.
15. As a user, I want to ask the assistant to update a Jira ticket (status, description, comment), and have it ask for confirmation before doing so, so that no unintended changes are made to work-managed systems.
16. As a user, I want to ask the assistant to create a calendar event, and have it ask for confirmation before doing so, so that my calendar is never modified without my explicit approval.
17. As a user, I want the assistant to read my MS Office Calendar working hours configuration as the authoritative source for my availability, so that I don't need to manually configure working hours in a second place.
18. As a user, I want tasks in my private store to have an Impact (High/Medium/Low), an Effort estimate (hours), and an optional due date, so that the ICE-lite priority score can be computed.
19. As a user, I want to override the priority of any task conversationally ("this is actually more urgent than it looks"), so that the assistant's ranking reflects my knowledge rather than only the scored attributes.
20. As a user, I want the assistant to distinguish between hard due dates and soft due dates when ranking tasks, so that soft deadlines don't displace genuinely urgent items.
21. As a user, I want the assistant's knowledge of my preferences (working hours, Jira projects, recurring context) to persist across sessions, so that I don't need to re-explain my setup every time.
22. As a user, I want richer personal context (recurring preferences, ongoing project notes, working style) to live in a `context.md` file in my task store, so that the assistant can consult it without relying on OpenCode-specific memory mechanisms alone.
23. As a user, I want the private task store to be hosted in a private GitHub repository, so that my task data is synced across devices, version-controlled, and fully owned by me with no vendor lock-in.
24. As a user, I want all git operations on the task store (pull before read, commit and push after write) to be handled transparently by the assistant, so that I never need to manually manage the repository.
25. As a user, I want GitLab PR information to be treated as a read-only task source, so that the assistant surfaces PR review obligations but never takes actions on PRs on my behalf.
26. As a user, I want the assistant to present a clear, structured day plan with time blocks, priority rankings, and effort estimates, not just a flat list, so that I can see how the day fits together at a glance.
27. As a user, I want daily plans stored as dated markdown files in my task store (e.g. `plans/2026-04-23.md`), so that I can review past plans and track how my intentions compared to what actually happened.
28. As a user, I want to ask the assistant to summarise progress on a task or project, so that I can quickly reconstruct context after time away from a topic.
29. As a user, I want to ask the assistant "what did I plan to do today?" if I close and reopen OpenCode mid-day, so that I can resume from the saved day plan without re-running the full morning ritual.
30. As a user, I want the assistant to flag when I have not yet created a day plan (i.e. no plan file exists for today), so that I am prompted to run `/morning` rather than working reactively.

## Implementation Decisions

### Agent Runtime
- OpenCode is the agent runtime (not a separate application).
- The assistant is activated by interacting with OpenCode; no separate process or daemon is required for v1.
- The morning ritual is initiated by the user via `/morning` (a slash command or recognised phrase).

### Data Sources & Access Policy

| Source | Access | Write Policy |
|---|---|---|
| Jira | MCP (existing) | Confirm before any write |
| MS Office Calendar | Microsoft Graph MCP (to be configured) | Confirm before any write |
| Google Calendar | Google Calendar MCP (to be configured) | Confirm before any write |
| GitLab | MCP (existing) | Read-only; no writes |
| Private task store (GitHub) | Git CLI / GitHub MCP | Autonomous write; always noted |

### Private Task Store Structure
- Hosted as a private GitHub repository.
- Folder structure:
  - `tasks/` — one markdown file per open task
  - `plans/` — one markdown file per daily plan, named `YYYY-MM-DD.md`
  - `context.md` — persistent agent memory: working style, recurring preferences, project context
- The agent pulls the repo before any read and pushes after any write.
- Task files include frontmatter fields: `id`, `title`, `impact` (High/Medium/Low), `effort` (hours), `due` (date, optional), `due_type` (hard/soft), `status`, `source` (jira/manual/etc), `created`, `updated`.

### Priority Framework (ICE-lite)
- Each task is scored on three dimensions: **Impact** (H/M/L → 3/2/1), **Effort** (inverse — lower effort scores higher for equal impact), **Earliness** (days until due date, hard deadlines weighted higher than soft).
- The agent computes a composite score and presents a ranked list.
- The user can override rank conversationally at any time; overrides are stored in the task file.

### Morning Ritual Flow
1. Pull latest from task store repo.
2. Read working hours from MS Office Calendar.
3. Fetch today's events from MS Office Calendar and Google Calendar.
4. Fetch assigned/in-progress Jira tickets.
5. Fetch open GitLab MRs awaiting review.
6. Fetch all open tasks from task store.
7. Compute ICE-lite scores; merge all sources into a unified ranked list.
8. Present structured briefing: time constraints → ranked task list → suggested time blocks.
9. Collaborative conversation: user adjusts, confirms, or defers items.
10. Write agreed plan to `plans/YYYY-MM-DD.md`; commit and push silently; note to user.

### Agent Memory — Two-Layer Architecture
- **Layer 1 — OpenCode rules**: Core persona, source list, action policy, priority framework definition, working hours. Always active.
- **Layer 2 — `context.md` in task store**: Richer, evolving personal context. Agent reads this at the start of each session (after pulling the repo).

### Working Hours
- Authoritative source: MS Office Calendar (working hours already configured there).
- Mon–Thu 08:00–17:00, Fri 09:00–12:00.
- Treated as ~80% strict: the assistant respects these boundaries by default but surfaces conflicts rather than refusing to engage ("You have 7h of work today but only 4h in your working window — want to flag anything as deferred?").

### Action Confirmation Protocol
- Before any write to Jira, Calendar, or other external systems, the assistant presents a clear summary of the intended action and waits for explicit user confirmation ("yes / confirm / go ahead").
- Write actions to the task store do not require confirmation but are always acknowledged inline (e.g. "Task created: *Fix login bug* — [link to file]").
- Read actions on all sources require no confirmation and produce no acknowledgement unless the user requested the read.

### Prerequisites (must be completed before any other implementation work)

These are not implementation tasks — they are validation spikes. Each must be completed and confirmed working before the modules that depend on them are built.

**P1 — Validate MS Office Calendar MCP**
- Research and identify a production-ready MCP server for Microsoft Graph / Outlook Calendar.
- Complete Microsoft Graph OAuth setup (app registration, scopes: `Calendars.Read`, `MailboxSettings.Read`).
- Verify the MCP can: (a) read today's calendar events, (b) read working hours / mailbox settings.
- Document the MCP server name, configuration, and any limitations discovered.
- Acceptance: a live query returns today's MS Calendar events and the configured working hours in OpenCode.

**P2 — Validate Google Calendar MCP**
- Research and identify a production-ready MCP server for Google Calendar.
- Complete Google OAuth setup (credentials, scopes: `https://www.googleapis.com/auth/calendar.readonly`).
- Verify the MCP can read today's calendar events from the primary calendar.
- Document the MCP server name, configuration, and any limitations discovered.
- Acceptance: a live query returns today's Google Calendar events in OpenCode.

**P3 — Create private GitHub task store repo**
- Create a private GitHub repository for the task store.
- Initialise folder structure: `tasks/`, `plans/`, `context.md`.
- Verify the assistant can pull, write a file, commit, and push via GitHub MCP or git CLI.
- Acceptance: a test task file is created, committed, and pushed from within OpenCode.

### Modules

**1. Source Aggregator**
Fetches and normalises task/event data from all sources into a unified `TaskItem` and `CalendarEvent` schema. Each source has its own fetcher (JiraFetcher, MSCalendarFetcher, GoogleCalendarFetcher, GitLabMRFetcher, TaskStoreFetcher). The aggregator merges results and returns a single collection. Deep module: stable interface regardless of which MCPs or APIs change underneath.

**2. ICE-lite Scorer**
Pure function: takes a `TaskItem[]` and returns a scored, ranked `RankedTaskItem[]`. No side effects, no I/O. Fully unit-testable in isolation.

**3. Task Store**
Encapsulates all read/write operations against the private GitHub repo: pull, read task files, write task files, write plan files, commit, push. Exposes a simple interface: `getTasks()`, `createTask(task)`, `updateTask(id, patch)`, `writePlan(date, content)`. Git operations are an internal detail.

**4. Day Plan Builder**
Takes a `RankedTaskItem[]` and a `CalendarEvent[]` (today), computes available time slots, and proposes a time-blocked schedule. Produces a structured markdown day plan. Collaborative — accepts user amendments and re-generates.

**5. Agent Instructions (OpenCode rules + context.md)**
Not a code module — the persistent configuration layer. Defines the assistant's persona, source list, action policy, and working hours for the OpenCode runtime.

## Testing Decisions

**What makes a good test:** Tests should verify observable external behaviour through the module's public interface only. Implementation details (which git command was run, how a score was computed internally) are not tested. Tests should be deterministic and require no network access — all external dependencies are injected or mocked at the boundary.

**Modules to test:**

- **ICE-lite Scorer** — highest priority. Pure function with no dependencies; fully unit-testable. Test cases: correct ranking order for varied impact/effort/due combinations, hard vs soft due date weighting, user override preservation, tie-breaking behaviour.
- **Task Store** — integration-test the read/write interface against a local git repository fixture. Test: create task produces correct frontmatter, update task patches only specified fields, write plan creates correctly named file, git operations are called in correct order (pull before read, push after write).
- **Source Aggregator** — unit-test normalisation logic for each fetcher with mocked MCP responses. Test: Jira ticket maps to correct `TaskItem` fields, calendar events map to correct `CalendarEvent` fields, aggregator deduplicates items with the same source+id.
- **Day Plan Builder** — unit-test with fixed inputs (ranked tasks, calendar events, available hours). Test: proposed plan respects available time window, high-priority items are scheduled before low-priority ones, conflicts are surfaced correctly.

## Out of Scope

- Proactive push notifications (e.g. scheduled reminders sent to a messaging platform). The assistant is reactive; rituals are user-initiated in v1.
- Email integration (Gmail, Outlook inbox).
- Slack or other messaging platform integration.
- Any GitLab actions (approving, commenting on, merging PRs). GitLab is read-only.
- Calendar write automation (no events are ever created without explicit user confirmation, and auto-scheduling to calendar is not supported in v1).
- Multi-user support.
- Mobile app or dedicated web UI — OpenCode's existing interface is used as-is.
- AI-generated summaries of PR diff content — PRs are surfaced as task items (title, status, link) only.

## Further Notes

- Prerequisites P1, P2, and P3 (see Implementation Decisions) are blocking. No module development should begin until all three are validated. The morning ritual is the core value proposition and is worthless without working calendar integrations.
- Working hours are read from MS Office Calendar as the authoritative source — the MS Calendar MCP must support reading mailbox settings / working hours, not just events. This must be confirmed during P1.
- The ICE-lite scorer is intentionally simple. Resist the temptation to add more scoring dimensions in v1 — the value is in the ritual and aggregation, not in the algorithm.
