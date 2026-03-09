"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import type { InterviewPrepKit } from "@/lib/interviewTypes";

export function ResumeTab({ data }: { data: InterviewPrepKit; sessionId: string }) {
  const { resumeAnalysis } = data;
  const [expandedProbe, setExpandedProbe] = useState<number | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const copyKeyword = (k: string) => {
    navigator.clipboard.writeText(k);
    setCopiedKeyword(k);
    setTimeout(() => setCopiedKeyword(null), 800);
  };

  const cardClass = "rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5";

  return (
    <div className="space-y-6">
      {resumeAnalysis.strongPoints?.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Strong points</h3>
          <ul className="space-y-2">
            {resumeAnalysis.strongPoints.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-[var(--foreground)]"
              >
                <span className="text-[var(--success)] shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {resumeAnalysis.likelyProbed?.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">They will probe this</h3>
          <div className="space-y-3">
            {resumeAnalysis.likelyProbed.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <button
                  type="button"
                  onClick={() => setExpandedProbe(expandedProbe === i ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-[var(--foreground)]">{item.item}</span>
                  {expandedProbe === i ? (
                    <ChevronUp className="h-4 w-4 text-[var(--muted)]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
                  )}
                </button>
                {expandedProbe === i && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border-l-2 border-[var(--primary)] bg-[var(--primary)]/5 px-4 py-2 text-sm text-[var(--foreground)]">
                      <span className="font-medium">Why they ask:</span> {item.whyTheyAsk}
                    </div>
                    <div className="rounded-lg bg-slate-100/80 px-4 py-2 text-sm text-[var(--muted)]">
                      <span className="font-medium text-[var(--foreground)]">How to prep:</span> {item.prepNote}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resumeAnalysis.gaps?.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Gaps to address</h3>
          <ul className="space-y-2">
            {resumeAnalysis.gaps.map((g, i) => (
              <li
                key={i}
                className="rounded-lg border-l-2 border-[var(--accent)] bg-[var(--card)]/30 px-4 py-3 text-sm text-[var(--foreground)]"
              >
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {resumeAnalysis.keywordsToEmphasize?.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Keywords to emphasize</h3>
          <p className="text-xs text-[var(--muted)] mb-3">Click to copy — weave these into your answers.</p>
          <div className="flex flex-wrap gap-2">
            {resumeAnalysis.keywordsToEmphasize.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => copyKeyword(k)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                  copiedKeyword === k
                    ? "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30"
                    : "border-slate-200 bg-slate-50 text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
