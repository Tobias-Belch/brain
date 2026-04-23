import type { TaskItem, Impact, DueType, TaskStatus } from "../types/index.js";
import type { TaskStore } from "../task-store/index.js";

// ---------------------------------------------------------------------------
// MCP client interfaces
// ---------------------------------------------------------------------------

export interface RawJiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    priority?: { name: string };
    story_points?: number;
    duedate?: string;
    status: { name: string };
  };
}

export interface JiraMCPClient {
  getAssignedIssues(): Promise<RawJiraIssue[]>;
}

export interface RawGitLabMR {
  iid: number;
  title: string;
  web_url: string;
  created_at: string;
  updated_at: string;
}

export interface GitLabMCPClient {
  getOpenMRsToReview(): Promise<RawGitLabMR[]>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jiraPriorityToImpact(priority?: string): Impact {
  if (!priority) return "Medium";
  const p = priority.toLowerCase();
  if (p.includes("high") || p.includes("critical") || p.includes("blocker")) return "High";
  if (p.includes("low") || p.includes("trivial")) return "Low";
  return "Medium";
}

function jiraStatusToTaskStatus(name: string): TaskStatus {
  const s = name.toLowerCase();
  if (s.includes("progress") || s.includes("review")) return "in_progress";
  if (s.includes("done") || s.includes("closed") || s.includes("resolved")) return "done";
  return "open";
}

// ---------------------------------------------------------------------------
// Jira Fetcher
// ---------------------------------------------------------------------------

export class JiraFetcher {
  constructor(private client: JiraMCPClient) {}

  async fetchTasks(): Promise<TaskItem[]> {
    const raw = await this.client.getAssignedIssues();
    return raw.map((issue) => ({
      id: `jira-${issue.key}`,
      title: `[${issue.key}] ${issue.fields.summary}`,
      impact: jiraPriorityToImpact(issue.fields.priority?.name),
      effort: issue.fields.story_points ?? 2,
      due: issue.fields.duedate ?? undefined,
      due_type: issue.fields.duedate ? ("soft" as DueType) : ("none" as DueType),
      status: jiraStatusToTaskStatus(issue.fields.status.name),
      source: "jira" as const,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }));
  }
}

// ---------------------------------------------------------------------------
// GitLab MR Fetcher (read-only)
// ---------------------------------------------------------------------------

export class GitLabMRFetcher {
  constructor(private client: GitLabMCPClient) {}

  async fetchTasks(): Promise<TaskItem[]> {
    const raw = await this.client.getOpenMRsToReview();
    return raw.map((mr) => ({
      id: `gitlab-mr-${mr.iid}`,
      title: `[MR !${mr.iid}] ${mr.title}`,
      impact: "Medium" as Impact,
      effort: 1,
      due: undefined,
      due_type: "none" as DueType,
      status: "open" as TaskStatus,
      source: "gitlab" as const,
      created: mr.created_at,
      updated: mr.updated_at,
    }));
  }
}

// ---------------------------------------------------------------------------
// Task Store Fetcher
// ---------------------------------------------------------------------------

export class TaskStoreFetcher {
  constructor(private taskStore: TaskStore) {}

  async fetchTasks(): Promise<TaskItem[]> {
    return this.taskStore.getTasks();
  }
}
