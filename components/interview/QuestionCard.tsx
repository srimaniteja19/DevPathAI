"use client";

import { useState, useCallback, useEffect } from "react";
import { Check } from "lucide-react";
import type { QuestionItem } from "@/lib/interviewTypes";

const DIFFICULTY_CLASS: Record<string, string> = {
  Easy: "bg-[var(--success)]/15 text-[var(--success)]",
  Medium: "bg-[var(--accent)]/20 text-[var(--foreground)]",
  Hard: "bg-[var(--destructive)]/15 text-[var(--destructive)]",
};

export function QuestionCard({
  item,
  practiced,
  onMarkPracticed,
  sessionId,
}: {
  item: QuestionItem;
  practiced: boolean;
  onMarkPracticed: () => void;
  sessionId: string;
}) {
  const [showWhy, setShowWhy] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [starAnswers, setStarAnswers] = useState({
    situation: "",
    task: "",
    action: "",
    result: "",
  });

  const storageKey = `star_${sessionId}_${item.id}`;

  const loadStarAnswers = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setStarAnswers(JSON.parse(stored));
    } catch {}
  }, [storageKey]);

  const saveStarAnswers = useCallback(
    (updates: Partial<typeof starAnswers>) => {
      const next = { ...starAnswers, ...updates };
      setStarAnswers(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    },
    [starAnswers, storageKey]
  );

  useEffect(() => {
    loadStarAnswers();
  }, [loadStarAnswers]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5">
      <h4 className="text-base font-semibold text-[var(--foreground)] mb-3">{item.question}</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="rounded-full bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-0.5 text-xs font-medium">
          {item.category}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_CLASS[item.difficulty] || "bg-slate-100 text-[var(--muted)]"}`}
        >
          {item.difficulty}
        </span>
        <span className="rounded-full bg-slate-100 text-[var(--muted)] px-2.5 py-0.5 text-xs font-medium">
          {item.answerFramework}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setShowWhy(!showWhy)}
        className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] mb-3"
      >
        {showWhy ? "Hide" : "Show"} why they ask this
      </button>
      {showWhy && (
        <div className="mb-4 rounded-lg bg-slate-100/80 px-4 py-3 text-sm text-[var(--foreground)]">
          {item.whyTheyAsk}
        </div>
      )}

      {item.companyStyleTip && (
        <div className="mb-4 rounded-lg border-l-2 border-[var(--accent)] bg-[var(--card)]/30 px-4 py-2 text-sm text-[var(--foreground)]">
          <span className="font-medium">Company style tip:</span> {item.companyStyleTip}
        </div>
      )}

      {item.answerFramework === "STAR" && item.starTemplate && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-medium text-[var(--muted)]">STAR Builder</p>
          {(["situation", "task", "action", "result"] as const).map((key) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[var(--muted)] capitalize mb-1">
                {key}
              </label>
              <textarea
                value={starAnswers[key]}
                onChange={(e) => saveStarAnswers({ [key]: e.target.value })}
                placeholder={item.starTemplate[key]}
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none resize-y"
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowSample(!showSample)}
        className="text-xs font-medium text-[var(--primary)] hover:underline mb-4"
      >
        {showSample ? "Hide" : "See"} sample answer
      </button>
      {showSample && item.sampleAnswer && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-[var(--foreground)]">
          {item.sampleAnswer}
        </div>
      )}

      {item.followUps?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-[var(--muted)] mb-2">Possible follow-ups</p>
          <div className="flex flex-wrap gap-2">
            {item.followUps.map((f, i) => (
              <span
                key={i}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-[var(--muted)]"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onMarkPracticed}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
          practiced
            ? "bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30"
            : "border border-slate-200 text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
        }`}
      >
        {practiced ? (
          <>
            <Check className="h-4 w-4" />
            Practiced
          </>
        ) : (
          "Mark as Practiced"
        )}
      </button>
    </div>
  );
}
