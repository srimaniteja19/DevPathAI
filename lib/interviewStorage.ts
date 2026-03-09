import type { InterviewPrepKit } from "./interviewTypes";

const SAVED_INTERVIEWS_KEY = "devpath-saved-interviews";

export interface SavedInterview {
  id: string;
  sessionTitle: string;
  createdAt: number;
  data: InterviewPrepKit;
}

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

export function getSavedInterviews(): SavedInterview[] {
  const list = getStorageItem<SavedInterview[]>(SAVED_INTERVIEWS_KEY, []);
  const knownIds = new Set(list.map((s) => s.id));
  let migrated = false;

  // Migrate any orphaned interview_* keys (from before we had the list)
  if (typeof window !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("interview_")) continue;
      const id = key.slice("interview_".length);
      if (knownIds.has(id)) continue;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const data = JSON.parse(raw) as InterviewPrepKit;
        list.unshift({
          id,
          sessionTitle: data.sessionTitle ?? "Interview Prep",
          createdAt: Date.now(),
          data,
        });
        knownIds.add(id);
        migrated = true;
      } catch {
        // skip invalid
      }
    }
    if (migrated) setStorageItem(SAVED_INTERVIEWS_KEY, list);
  }

  return list;
}

export function saveInterview(data: InterviewPrepKit): SavedInterview {
  const id = crypto.randomUUID();
  const saved: SavedInterview = {
    id,
    sessionTitle: data.sessionTitle,
    createdAt: Date.now(),
    data,
  };
  const list = getSavedInterviews();
  list.unshift(saved);
  setStorageItem(SAVED_INTERVIEWS_KEY, list);

  // Also keep under interview_${id} for practicedIds, studyplan, checklist compatibility
  localStorage.setItem(`interview_${id}`, JSON.stringify(data));

  return saved;
}

export function getInterviewById(id: string): SavedInterview | undefined {
  return getSavedInterviews().find((s) => s.id === id);
}

export function deleteInterview(id: string): void {
  const list = getSavedInterviews().filter((s) => s.id !== id);
  setStorageItem(SAVED_INTERVIEWS_KEY, list);
  localStorage.removeItem(`interview_${id}`);
  localStorage.removeItem(`practiced_${id}`);
  localStorage.removeItem(`studyplan_${id}`);
  localStorage.removeItem(`checklist_${id}`);
}
