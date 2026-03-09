"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import type { InterviewPrepKit } from "@/lib/interviewTypes";

export function CompanyIntelTab({ data }: { data: InterviewPrepKit }) {
  const { companyInsights, companyDataAvailable } = data;
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyQuestion = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const difficultyClass = (d: string) => {
    const dlower = d.toLowerCase();
    if (dlower.includes("low")) return "bg-[var(--success)]/15 text-[var(--success)]";
    if (dlower.includes("medium")) return "bg-[var(--accent)]/20 text-[var(--foreground)]";
    return "bg-[var(--destructive)]/15 text-[var(--destructive)]";
  };

  const cardClass = "rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5";

  return (
    <div className="space-y-6">
      {!companyDataAvailable && (
        <div className="rounded-xl border-l-4 border-[var(--accent)] bg-[var(--card)]/50 p-4 text-sm text-[var(--foreground)]">
          Limited company data — results based on role type.
        </div>
      )}

      <div className={cardClass}>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Overview</h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{companyInsights.overview}</p>
      </div>

      {companyInsights.culture?.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Culture</h3>
          <div className="flex flex-wrap gap-2">
            {companyInsights.culture.map((c, i) => (
              <div
                key={i}
                title={c.description}
                className="rounded-full bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1.5 text-xs font-medium cursor-help"
              >
                {c.keyword}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={cardClass}>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Interview Process</h3>
        <div className="space-y-3">
          {companyInsights.interviewProcess.stages.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
            >
              <button
                type="button"
                onClick={() => setExpandedStage(expandedStage === i ? null : i)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-white text-xs font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{s.stage}</p>
                    <span className="inline-block mt-0.5 rounded px-2 py-0.5 text-xs text-[var(--muted)] bg-white/80">
                      {s.format}
                    </span>
                  </div>
                </div>
                {expandedStage === i ? (
                  <ChevronUp className="h-4 w-4 text-[var(--muted)]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
                )}
              </button>
              <p className="mt-2 ml-10 text-xs text-[var(--muted)]">Focus: {s.focus}</p>
              {expandedStage === i && s.tips?.length > 0 && (
                <ul className="mt-3 ml-10 space-y-1 text-xs text-[var(--foreground)]">
                  {s.tips.map((tip, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-[var(--primary)]">·</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--muted)]">
            Typical duration: {companyInsights.interviewProcess.typicalDuration}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyClass(
              companyInsights.interviewProcess.knownDifficulty
            )}`}
          >
            {companyInsights.interviewProcess.knownDifficulty}
          </span>
        </div>
        {companyInsights.interviewProcess.source && (
          <p className="mt-2 text-xs text-[var(--muted)]">{companyInsights.interviewProcess.source}</p>
        )}
      </div>

      {companyInsights.valuesTheyHireFor?.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Values they hire for</h3>
          <div className="flex flex-wrap gap-2">
            {companyInsights.valuesTheyHireFor.map((v, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-[var(--foreground)]"
              >
                <span className="text-[var(--success)]">✓</span>
                {v}
              </div>
            ))}
          </div>
        </div>
      )}

      {companyInsights.redFlags?.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Red flags to avoid</h3>
          <ul className="space-y-2">
            {companyInsights.redFlags.map((r, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-lg border-l-2 border-[var(--accent)] bg-[var(--card)]/30 px-3 py-2 text-sm text-[var(--foreground)]"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {companyInsights.questionsToAskThem?.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Questions to ask them</h3>
          <ol className="space-y-2">
            {companyInsights.questionsToAskThem.map((q, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
              >
                <span className="text-sm text-[var(--foreground)]">
                  {i + 1}. {q}
                </span>
                <button
                  type="button"
                  onClick={() => copyQuestion(q, i)}
                  className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition"
                  aria-label="Copy"
                >
                  {copiedIndex === i ? (
                    <Check className="h-4 w-4 text-[var(--success)]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
