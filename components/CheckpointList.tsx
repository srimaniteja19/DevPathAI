"use client";

import { useCallback, useState, useEffect } from "react";
import { Check, Circle } from "lucide-react";
import {
  getPhaseCheckpointProgress,
  setCheckpointCompleted,
} from "@/lib/storage";

interface CheckpointListProps {
  courseId: string;
  phaseIndex: number;
  checkpoints: string[];
}

export function CheckpointList({
  courseId,
  phaseIndex,
  checkpoints,
}: CheckpointListProps) {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener("devpath-checkpoint-update", handler);
    return () => window.removeEventListener("devpath-checkpoint-update", handler);
  }, []);

  const progress = getPhaseCheckpointProgress(
    courseId,
    phaseIndex,
    checkpoints.length
  );

  const toggle = useCallback(
    (index: number) => {
      const next = !progress[index];
      setCheckpointCompleted(courseId, phaseIndex, index, next);
      window.dispatchEvent(new Event("devpath-checkpoint-update"));
    },
    [courseId, phaseIndex, progress]
  );

  if (checkpoints.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--muted)]">Checkpoints</h3>
      <ul className="space-y-1.5">
        {checkpoints.map((text, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-left text-sm transition hover:bg-[var(--card-hover)]"
            >
              {progress[i] ? (
                <Check className="h-4 w-4 shrink-0 text-[var(--success)]" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-[var(--muted)]" />
              )}
              <span className={progress[i] ? "text-[var(--muted)] line-through" : ""}>
                {text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
