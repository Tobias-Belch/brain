# Phase Plan: ai-personal-assistant

## Task

Build an AI-powered personal assistant running inside OpenCode that aggregates tasks and appointments from Jira, MS Office Calendar, Google Calendar, GitLab PRs, and a private Git-backed task store. The assistant runs a structured morning ritual (`/morning`), supports conversational task capture and updates, and produces a time-blocked day plan. All mutations to external systems require explicit user confirmation; the private task store is written autonomously.

## Task slug

`ai-personal-assistant`

## Phase plan

| # | Phase | Status | Skip reason |
|---|---|---|---|
| 1 | Idea | skip | PRD already provided by user |
| 2 | Research | run | — |
| 3 | Prototype | skip | No UI/UX uncertainty; architectural approach is clear from PRD |
| 4 | PRD | skip | PRD already provided at `docs/tools/assistant/00-prd.md` |
| 5 | Plan | run | — |
| 6 | Refine | run | — |
| 7 | Execution | run | — |
| 8 | QA | run | — |

## Context

- PRD: `docs/tools/assistant/00-prd.md`
- Repository: `/Users/tobiasbelch/workspaces/fea/brain`
- Task store repo: private GitHub repo (to be created as P3 prerequisite)
