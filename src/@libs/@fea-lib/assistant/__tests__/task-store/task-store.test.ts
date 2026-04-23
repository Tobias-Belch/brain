import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { TaskStore } from "../../src/task-store/index.js";
import type { TaskItem } from "../../src/types/index.js";

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function initRepo(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "task-store-test-"));
  execSync("git init", { cwd: dir });
  execSync('git config user.email "test@test.com"', { cwd: dir });
  execSync('git config user.name "Test"', { cwd: dir });
  // Initial commit so HEAD exists
  fs.writeFileSync(path.join(dir, "context.md"), "# Context\n");
  execSync("git add -A && git commit -m 'init'", { cwd: dir, shell: "/bin/sh" });
  return dir;
}

function makeTask(overrides?: Partial<TaskItem>): TaskItem {
  return {
    id: "task-001",
    title: "Fix login bug",
    impact: "High",
    effort: 2,
    due: "2026-05-01",
    due_type: "hard",
    status: "open",
    source: "taskstore",
    created: "2026-04-23T08:00:00.000Z",
    updated: "2026-04-23T08:00:00.000Z",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

let repoDir: string;
let store: TaskStore;

beforeEach(() => {
  repoDir = initRepo();
  store = new TaskStore({ repoPath: repoDir, remote: "" }); // no remote push
});

afterEach(() => {
  fs.rmSync(repoDir, { recursive: true, force: true });
});

describe("TaskStore.createTask", () => {
  it("writes a markdown file with correct frontmatter", () => {
    const task = makeTask();
    store.createTask(task);

    const file = path.join(repoDir, "tasks", "task-001.md");
    expect(fs.existsSync(file)).toBe(true);

    const content = fs.readFileSync(file, "utf8");
    expect(content).toContain("id: task-001");
    expect(content).toContain('title: "Fix login bug"');
    expect(content).toContain("impact: High");
    expect(content).toContain("effort: 2");
    expect(content).toContain("due: 2026-05-01");
    expect(content).toContain("due_type: hard");
    expect(content).toContain("status: open");
    expect(content).toContain("source: taskstore");
  });

  it("commits the file to git", () => {
    store.createTask(makeTask());
    const log = execSync("git log --oneline", { cwd: repoDir, encoding: "utf8" });
    expect(log).toContain("task: create task-001");
  });
});

describe("TaskStore.getTasks", () => {
  it("returns all tasks from the tasks/ directory", () => {
    store.createTask(makeTask({ id: "task-001", title: "Task One" }));
    store.createTask(makeTask({ id: "task-002", title: "Task Two" }));

    const tasks = store.getTasks();
    expect(tasks).toHaveLength(2);
    const ids = tasks.map((t) => t.id);
    expect(ids).toContain("task-001");
    expect(ids).toContain("task-002");
  });

  it("returns empty array when tasks/ does not exist", () => {
    expect(store.getTasks()).toEqual([]);
  });
});

describe("TaskStore.updateTask", () => {
  it("patches only specified fields, preserving others", () => {
    store.createTask(makeTask());
    store.updateTask("task-001", { status: "in_progress", effort: 3 });

    const tasks = store.getTasks();
    const task = tasks.find((t) => t.id === "task-001")!;
    expect(task.status).toBe("in_progress");
    expect(task.effort).toBe(3);
    // untouched fields preserved
    expect(task.title).toBe("Fix login bug");
    expect(task.impact).toBe("High");
    expect(task.due).toBe("2026-05-01");
  });

  it("throws if task does not exist", () => {
    expect(() => store.updateTask("nonexistent", { status: "done" })).toThrow(
      "Task not found: nonexistent"
    );
  });

  it("sets rank_override when provided in patch", () => {
    store.createTask(makeTask());
    store.updateTask("task-001", { rank_override: 1 });

    const tasks = store.getTasks();
    expect(tasks[0].rank_override).toBe(1);
  });
});

describe("TaskStore.writePlan", () => {
  it("writes plans/YYYY-MM-DD.md with the provided content", () => {
    store.writePlan("2026-04-23", "# Day Plan\n- 09:00 Fix login bug");

    const file = path.join(repoDir, "plans", "2026-04-23.md");
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.readFileSync(file, "utf8")).toContain("Fix login bug");
  });

  it("commits the plan file to git", () => {
    store.writePlan("2026-04-23", "# Plan");
    const log = execSync("git log --oneline", { cwd: repoDir, encoding: "utf8" });
    expect(log).toContain("plan: write day plan for 2026-04-23");
  });
});

describe("TaskStore.readPlan", () => {
  it("returns plan content if file exists", () => {
    store.writePlan("2026-04-23", "# My Plan");
    expect(store.readPlan("2026-04-23")).toContain("# My Plan");
  });

  it("returns null if no plan exists for date", () => {
    expect(store.readPlan("2026-04-23")).toBeNull();
  });
});
