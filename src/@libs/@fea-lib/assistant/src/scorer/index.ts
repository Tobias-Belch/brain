import type { TaskItem, RankedTaskItem, Impact } from "../types/index.js";

// ---------------------------------------------------------------------------
// Scoring constants
// ---------------------------------------------------------------------------

const IMPACT_SCORE: Record<Impact, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * Convert effort hours to an inverse score (lower effort → higher score).
 * We use 1 / effort, clamped to a max of 1 (for effort < 1h treat as 1h).
 * Scaled to 0–3 range to match impact scale.
 */
function effortScore(effort: number): number {
  const clamped = Math.max(effort, 0.5);
  // Normalised: 0.5h → 3, 1h → ~2.1, 2h → ~1.5, 4h → ~1.0, 8h+ → ~0.5
  return 3 / Math.sqrt(clamped);
}

/**
 * Compute an earliness score from days until due date.
 * Hard deadlines are weighted 1.5×.
 * No due date → score 0.
 */
function earlinessScore(task: TaskItem, today: Date): number {
  if (!task.due || task.due_type === "none") return 0;

  const dueDate = new Date(task.due);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntil = (dueDate.getTime() - today.getTime()) / msPerDay;

  // Already overdue or due today → max urgency
  const rawScore = daysUntil <= 0 ? 3 : Math.max(0, 3 - daysUntil * 0.3);
  const weight = task.due_type === "hard" ? 1.5 : 1.0;
  return rawScore * weight;
}

// ---------------------------------------------------------------------------
// Scorer
// ---------------------------------------------------------------------------

/**
 * Pure function: takes a list of TaskItems and a reference date, returns a
 * scored, ranked list sorted descending by composite score.
 *
 * Tasks with rank_override bypass the sort and are pinned to their position
 * (1 = top). rank_override tasks are inserted after sorting the rest.
 */
export function score(tasks: TaskItem[], today: Date): RankedTaskItem[] {
  const overridden: RankedTaskItem[] = [];
  const normal: RankedTaskItem[] = [];

  for (const task of tasks) {
    const composite =
      IMPACT_SCORE[task.impact] +
      effortScore(task.effort) +
      earlinessScore(task, today);

    const ranked: RankedTaskItem = { ...task, score: composite };

    if (task.rank_override !== undefined) {
      overridden.push(ranked);
    } else {
      normal.push(ranked);
    }
  }

  // Sort normal tasks: descending by score, tie-break by created (older first)
  normal.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(a.created).getTime() - new Date(b.created).getTime();
  });

  // Sort overridden tasks by their rank_override value ascending
  overridden.sort((a, b) => (a.rank_override ?? 0) - (b.rank_override ?? 0));

  // Merge: insert overridden tasks at their specified positions (1-indexed)
  const result: RankedTaskItem[] = [...normal];
  for (const task of overridden) {
    const pos = Math.max(0, (task.rank_override ?? 1) - 1);
    result.splice(pos, 0, task);
  }

  return result;
}
