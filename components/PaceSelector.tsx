"use client";

import { useCourseStore } from "@/store/courseStore";
import type { LearningPaceKey } from "@/lib/types";

const LABELS: Record<LearningPaceKey, string> = {
  casual: "Casual",
  focused: "Focused",
  intensive: "Intensive",
};

export function PaceSelector() {
  const { pace, setPace } = useCourseStore();

  return (
    <div className="flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
      {(["casual", "focused", "intensive"] as const).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => setPace(key)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            pace === key
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)]"
          }`}
        >
          {LABELS[key]}
        </button>
      ))}
    </div>
  );
}
