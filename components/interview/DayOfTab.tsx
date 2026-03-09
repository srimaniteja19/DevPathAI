"use client";

import { useState, useEffect } from "react";
import { Check, Calendar, Clock, Video, Mail } from "lucide-react";
import type { InterviewPrepKit } from "@/lib/interviewTypes";

const SECTIONS = [
  { key: "oneWeekBefore", label: "1 Week Before", icon: Calendar },
  { key: "oneDayBefore", label: "1 Day Before", icon: Clock },
  { key: "dayOf", label: "Day Of", icon: Video },
  { key: "afterInterview", label: "After Interview", icon: Mail },
] as const;

const cardClass = "rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5";

export function DayOfTab({ data, sessionId }: { data: InterviewPrepKit; sessionId: string }) {
  const checklist = data.prepChecklist || {};
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const storageKey = `checklist_${sessionId}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setChecked(JSON.parse(stored));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  const toggle = (section: string, index: number) => {
    const key = `${section}-${index}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allItems = SECTIONS.flatMap((s) =>
    (checklist[s.key] || []).map((_, i) => `${s.key}-${i}`)
  );
  const completed = allItems.filter((k) => checked[k]).length;
  const total = allItems.length;

  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <p className="text-sm font-medium text-[var(--foreground)] mb-2">
          {completed} of {total} tasks
        </p>
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all"
            style={{ width: total ? `${(100 * completed) / total}%` : 0 }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {SECTIONS.map(({ key, label, icon: Icon }) => {
          const items = checklist[key] || [];
          if (items.length === 0) return null;
          return (
            <div key={key} className={cardClass}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] mb-4">
                <Icon className="h-4 w-4 text-[var(--primary)]" />
                {label}
              </h3>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(key, i)}
                      className={`shrink-0 flex h-5 w-5 items-center justify-center rounded border transition ${
                        checked[`${key}-${i}`]
                          ? "border-[var(--success)] bg-[var(--success)] text-white"
                          : "border-slate-300 hover:border-[var(--primary)]"
                      }`}
                    >
                      {checked[`${key}-${i}`] ? <Check className="h-3 w-3" /> : null}
                    </button>
                    <span
                      className={`text-sm ${
                        checked[`${key}-${i}`] ? "line-through text-[var(--muted)]" : "text-[var(--foreground)]"
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
