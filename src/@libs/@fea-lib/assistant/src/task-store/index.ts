import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import type { TaskItem, TaskStatus, Impact, DueType, TaskSource } from "../types/index.js";

// ---------------------------------------------------------------------------
// Frontmatter helpers
// ---------------------------------------------------------------------------

function parseFrontmatter(content: string): { meta: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    // Remove surrounding quotes if present
    meta[key] = val.replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: match[2] };
}

function stringifyFrontmatter(meta: Record<string, unknown>, body: string): string {
  const lines = Object.entries(meta)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${v}`);
  return `---\n${lines.join("\n")}\n---\n${body}`;
}

function taskFromMeta(meta: Record<string, unknown>, body: string): TaskItem {
  return {
    id: String(meta.id ?? ""),
    title: String(meta.title ?? ""),
    impact: (meta.impact as Impact) ?? "Medium",
    effort: Number(meta.effort ?? 0),
    due: meta.due ? String(meta.due) : undefined,
    due_type: (meta.due_type as DueType) ?? "none",
    status: (meta.status as TaskStatus) ?? "open",
    source: (meta.source as TaskSource) ?? "taskstore",
    created: String(meta.created ?? new Date().toISOString()),
    updated: String(meta.updated ?? new Date().toISOString()),
    rank_override: meta.rank_override !== undefined ? Number(meta.rank_override) : undefined,
  };
}

function taskToMeta(task: TaskItem): Record<string, unknown> {
  return {
    id: task.id,
    title: `"${task.title}"`,
    impact: task.impact,
    effort: task.effort,
    due: task.due ?? "",
    due_type: task.due_type,
    status: task.status,
    source: task.source,
    created: task.created,
    updated: task.updated,
    ...(task.rank_override !== undefined ? { rank_override: task.rank_override } : {}),
  };
}

// ---------------------------------------------------------------------------
// TaskStore
// ---------------------------------------------------------------------------

export interface TaskStoreOptions {
  /** Absolute path to the local task store repository. */
  repoPath: string;
  /**
   * Git remote to push to. Defaults to "origin".
   * Set to empty string to disable push (useful for tests).
   */
  remote?: string;
}

export class TaskStore {
  private repoPath: string;
  private remote: string;

  constructor(options: TaskStoreOptions) {
    this.repoPath = options.repoPath;
    this.remote = options.remote ?? "origin";
  }

  // -------------------------------------------------------------------------
  // Git helpers
  // -------------------------------------------------------------------------

  private git(cmd: string): string {
    return execSync(`git ${cmd}`, { cwd: this.repoPath, encoding: "utf8" });
  }

  private pull(): void {
    if (this.remote) {
      this.git(`pull ${this.remote}`);
    }
  }

  private commitAndPush(message: string): void {
    this.git(`add -A`);
    this.git(`commit -m "${message.replace(/"/g, '\\"')}"`);
    if (this.remote) {
      this.git(`push ${this.remote}`);
    }
  }

  // -------------------------------------------------------------------------
  // Public interface
  // -------------------------------------------------------------------------

  /**
   * Pull the repo and return all open tasks from the tasks/ directory.
   */
  getTasks(): TaskItem[] {
    this.pull();
    const tasksDir = path.join(this.repoPath, "tasks");
    if (!fs.existsSync(tasksDir)) return [];
    const files = fs.readdirSync(tasksDir).filter((f) => f.endsWith(".md"));
    return files.map((file) => {
      const content = fs.readFileSync(path.join(tasksDir, file), "utf8");
      const { meta, body } = parseFrontmatter(content);
      return taskFromMeta(meta, body);
    });
  }

  /**
   * Write a new task file to tasks/, commit, and push.
   */
  createTask(task: TaskItem): void {
    const tasksDir = path.join(this.repoPath, "tasks");
    fs.mkdirSync(tasksDir, { recursive: true });
    const filename = `${task.id}.md`;
    const content = stringifyFrontmatter(taskToMeta(task), `\n# ${task.title}\n`);
    fs.writeFileSync(path.join(tasksDir, filename), content, "utf8");
    this.commitAndPush(`task: create ${task.id} — ${task.title}`);
  }

  /**
   * Update only the specified fields of an existing task, commit, and push.
   * The task file is identified by task.id.
   */
  updateTask(id: string, patch: Partial<TaskItem>): void {
    this.pull();
    const tasksDir = path.join(this.repoPath, "tasks");
    const filename = path.join(tasksDir, `${id}.md`);
    if (!fs.existsSync(filename)) {
      throw new Error(`Task not found: ${id}`);
    }
    const content = fs.readFileSync(filename, "utf8");
    const { meta, body } = parseFrontmatter(content);
    const existing = taskFromMeta(meta, body);
    const updated: TaskItem = {
      ...existing,
      ...patch,
      id,
      updated: new Date().toISOString(),
    };
    const newContent = stringifyFrontmatter(taskToMeta(updated), body);
    fs.writeFileSync(filename, newContent, "utf8");
    this.commitAndPush(`task: update ${id}`);
  }

  /**
   * Write a day plan file to plans/YYYY-MM-DD.md, commit, and push.
   */
  writePlan(date: string, content: string): void {
    const plansDir = path.join(this.repoPath, "plans");
    fs.mkdirSync(plansDir, { recursive: true });
    const filename = path.join(plansDir, `${date}.md`);
    fs.writeFileSync(filename, content, "utf8");
    this.commitAndPush(`plan: write day plan for ${date}`);
  }

  /**
   * Read today's plan file if it exists, or return null.
   */
  readPlan(date: string): string | null {
    this.pull();
    const filename = path.join(this.repoPath, "plans", `${date}.md`);
    if (!fs.existsSync(filename)) return null;
    return fs.readFileSync(filename, "utf8");
  }

  /**
   * Read context.md if it exists, or return null.
   */
  readContext(): string | null {
    this.pull();
    const filename = path.join(this.repoPath, "context.md");
    if (!fs.existsSync(filename)) return null;
    return fs.readFileSync(filename, "utf8");
  }
}
