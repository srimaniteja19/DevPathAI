import type { SavedCourse, CheckpointProgress } from "./types";

const SAVED_COURSES_KEY = "devpath-saved-courses";
const CHECKPOINT_PROGRESS_KEY = "devpath-checkpoint-progress";

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function getSavedCourses(): SavedCourse[] {
  return getStorageItem<SavedCourse[]>(SAVED_COURSES_KEY, []);
}

export function saveCourse(course: { course: SavedCourse["course"] }, name?: string): SavedCourse {
  const saved: SavedCourse = {
    ...course,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    name: name ?? course.course.title,
  };
  const list = getSavedCourses();
  list.unshift(saved);
  setStorageItem(SAVED_COURSES_KEY, list);

  // Also persist to SQLite via API (fire-and-forget)
  if (typeof window !== "undefined") {
    try {
      void fetch("/api/saved-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saved }),
      });
    } catch {
      // ignore network errors; localStorage remains source of truth on client
    }
  }

  return saved;
}

export function updateSavedCourse(
  id: string,
  updates: Partial<Pick<SavedCourse, "name" | "course">>
): void {
  const list = getSavedCourses();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return;
  const updated: SavedCourse = { ...list[idx], ...updates };
  list[idx] = updated;
  setStorageItem(SAVED_COURSES_KEY, list);

  if (typeof window !== "undefined") {
    try {
      void fetch("/api/saved-courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saved: updated }),
      });
    } catch {
      // ignore
    }
  }
}

export function deleteSavedCourse(id: string): void {
  const list = getSavedCourses().filter((c) => c.id !== id);
  setStorageItem(SAVED_COURSES_KEY, list);
  const progress = getCheckpointProgress();
  delete progress[id];
  setStorageItem(CHECKPOINT_PROGRESS_KEY, progress);

  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams({ id });
      void fetch(`/api/saved-courses?${params.toString()}`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }
  }
}

export function getSavedCourseById(id: string): SavedCourse | undefined {
  return getSavedCourses().find((c) => c.id === id);
}

// ——— Checkpoint progress ———

export function getCheckpointProgress(): CheckpointProgress {
  return getStorageItem<CheckpointProgress>(CHECKPOINT_PROGRESS_KEY, {});
}

export function setCheckpointCompleted(
  courseId: string,
  phaseIndex: number,
  checkpointIndex: number,
  completed: boolean
): void {
  const progress = getCheckpointProgress();
  if (!progress[courseId]) progress[courseId] = {};
  const key = String(phaseIndex);
  if (!progress[courseId][key]) progress[courseId][key] = [];
  const arr = progress[courseId][key];
  while (arr.length <= checkpointIndex) arr.push(false);
  arr[checkpointIndex] = completed;
  setStorageItem(CHECKPOINT_PROGRESS_KEY, progress);
}

export function getPhaseCheckpointProgress(
  courseId: string,
  phaseIndex: number,
  totalCheckpoints: number
): boolean[] {
  const progress = getCheckpointProgress();
  const arr = progress[courseId]?.[String(phaseIndex)] ?? [];
  const result: boolean[] = [];
  for (let i = 0; i < totalCheckpoints; i++) {
    result.push(Boolean(arr[i]));
  }
  return result;
}

export function getTotalCheckpointsCompleted(courseId: string, phaseCounts: number[]): number {
  const progress = getCheckpointProgress();
  const byPhase = progress[courseId] ?? {};
  let total = 0;
  phaseCounts.forEach((count, phaseIndex) => {
    const arr = byPhase[String(phaseIndex)] ?? [];
    for (let i = 0; i < count; i++) if (arr[i]) total++;
  });
  return total;
}
