"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { InterviewPrepKit } from "@/lib/interviewTypes";

const cardClass = "rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5";

export function StudyPlanTab({ data, sessionId }: { data: InterviewPrepKit; sessionId: string }) {
  const plans = data.studyPlan?.dailyPlan || [];
  const [daysUntil, setDaysUntil] = useState(7);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const storageKey = `studyplan_${sessionId}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDaysUntil(parsed.daysUntil ?? 7);
        setChecked(parsed.checked ?? {});
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ daysUntil, checked }));
  }, [daysUntil, checked, storageKey]);

  const toggleTask = (day: number, taskIndex: number) => {
    const key = `${day}-${taskIndex}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const displayedPlans = plans.filter((p) => p.day <= daysUntil);
  const totalTasks = displayedPlans.reduce((sum, p) => sum + (p.tasks?.length ?? 0), 0);
  const completedTasks = displayedPlans.reduce(
    (sum, p) =>
      sum + (p.tasks?.filter((_, i) => checked[`${p.day}-${i}`]).length ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Days until interview: {daysUntil}
        </label>
        <input
          type="range"
          min={3}
          max={14}
          value={daysUntil}
          onChange={(e) => setDaysUntil(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-slate-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
          <span>3</span>
          <span>14</span>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--muted)] shrink-0">
            {completedTasks} of {totalTasks}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all"
              style={{ width: `${(100 * completedTasks) / totalTasks}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {displayedPlans.map((p) => (
          <div key={p.day} className={cardClass}>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-white text-xs font-semibold">
                {p.day}
              </span>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">{p.focus}</h3>
              {p.timeEstimate && (
                <span className="ml-auto text-xs text-[var(--muted)]">{p.timeEstimate}</span>
              )}
            </div>
            <ul className="space-y-2">
              {(p.tasks || []).map((task, i) => (
                <li key={i} className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleTask(p.day, i)}
                    className={`shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded border transition ${
                      checked[`${p.day}-${i}`]
                        ? "border-[var(--success)] bg-[var(--success)] text-white"
                        : "border-slate-300 hover:border-[var(--primary)]"
                    }`}
                  >
                    {checked[`${p.day}-${i}`] ? <Check className="h-3 w-3" /> : null}
                  </button>
                  <span
                    className={`text-sm ${
                      checked[`${p.day}-${i}`] ? "line-through text-[var(--muted)]" : "text-[var(--foreground)]"
                    }`}
                  >
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {displayedPlans.length === 0 && (
        <p className="text-center text-sm text-[var(--muted)] py-12">No study plan items.</p>
      )}
    </div>
  );
}
