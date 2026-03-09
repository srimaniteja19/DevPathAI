"use client";

import type { InterviewPrepKit } from "@/lib/interviewTypes";
import { QuestionCard } from "./QuestionCard";

const CATEGORIES = ["All", "Behavioral", "Technical", "SystemDesign", "RoleSpecific", "CultureFit", "Resume"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

const chipActive = "bg-[var(--primary)] text-white";
const chipInactive = "border border-slate-200 bg-slate-50 text-[var(--foreground)] hover:border-[var(--primary)]";

export function QuestionBankTab({
  data,
  sessionId,
  practicedIds,
  markPracticed,
  categoryFilter,
  setCategoryFilter,
  difficultyFilter,
  setDifficultyFilter,
}: {
  data: InterviewPrepKit;
  sessionId: string;
  practicedIds: Set<string>;
  markPracticed: (id: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (v: string) => void;
}) {
  const questions = data.questionBank || [];
  const practicedCount = questions.filter((q) => practicedIds.has(q.id)).length;

  const filtered = questions.filter((q) => {
    if (categoryFilter !== "All" && q.category !== categoryFilter) return false;
    if (difficultyFilter !== "All" && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        {practicedCount} / {questions.length} practiced
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[var(--muted)]">Category</span>
        {CATEGORIES.filter((c) => c === "All" || data.questionBank?.some((q) => q.category === c)).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoryFilter(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${categoryFilter === c ? chipActive : chipInactive}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[var(--muted)]">Difficulty</span>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficultyFilter(d)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${difficultyFilter === d ? chipActive : chipInactive}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filtered.map((q) => (
          <QuestionCard
            key={q.id}
            item={q}
            practiced={practicedIds.has(q.id)}
            onMarkPracticed={() => markPracticed(q.id)}
            sessionId={sessionId}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[var(--muted)] py-12">No questions match the filters.</p>
      )}
    </div>
  );
}
