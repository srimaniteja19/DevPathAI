"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import type { Topic } from "@/lib/types";

function DifficultyBar({ level }: { level: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(level)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulty ${filled} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i <= filled ? "bg-amber-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

interface TopicListProps {
  topics: Topic[];
}

export function TopicList({ topics }: TopicListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--muted)] flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Topics
      </h3>
      <div className="rounded-lg border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
        {topics.map((topic, i) => {
          const isOpen = openIndex === i;
          const hasExpandedContent =
            topic.why ||
            (topic.studySteps && topic.studySteps.length > 0) ||
            (topic.selfCheck && topic.selfCheck.length > 0) ||
            (topic.subtopics && topic.subtopics.length > 0);

          return (
            <div key={i} className="bg-[var(--card)]">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-[var(--foreground)] hover:bg-[var(--card-hover)] transition"
              >
                <span>{topic.name}</span>
                <span className="flex items-center gap-2 shrink-0">
                  {topic.difficulty != null && (
                    <DifficultyBar level={topic.difficulty} />
                  )}
                  <span className="text-xs text-[var(--muted)]">
                    {topic.estimatedHours}h
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[var(--muted)] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-[var(--border)] bg-white shadow-sm rounded-b-lg mx-0 my-0 overflow-hidden">
                  <div className="px-4 py-4 space-y-4">
                    {topic.why && (
                      <div className="why-block border-l-4 border-blue-500 pl-3 py-1">
                        <span className="label text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                          💡 Why this matters
                        </span>
                        <p className="text-sm text-[var(--foreground)] italic">
                          {topic.why}
                        </p>
                      </div>
                    )}

                    {topic.subtopics && topic.subtopics.length > 0 && (
                      <div className="skills-block">
                        <span className="label text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                          🎯 Skills you&apos;ll gain
                        </span>
                        <div className="chip-row flex flex-wrap gap-2">
                          {topic.subtopics.map((s, j) => (
                            <span
                              key={j}
                              className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {topic.studySteps && topic.studySteps.length > 0 && (
                      <div className="howto-block">
                        <span className="label text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                          📋 How to approach it
                        </span>
                        <ol className="space-y-2">
                          {topic.studySteps.map((step, j) => (
                            <li
                              key={j}
                              className="flex gap-2 text-sm text-[var(--foreground)]"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                                {j + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {topic.selfCheck && topic.selfCheck.length > 0 && (
                      <div className="selfcheck-block">
                        <span className="label text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                          ✅ Check yourself
                        </span>
                        <div className="space-y-1">
                          {topic.selfCheck.map((item, j) => (
                            <details
                              key={j}
                              className="group rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden"
                            >
                              <summary className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                <span className="text-gray-400 group-open:rotate-90 transition-transform">
                                  ▶
                                </span>
                                {item.question}
                              </summary>
                              <p className="px-3 py-2 pt-0 text-sm text-[var(--muted)] border-t border-[var(--border)]">
                                {item.hint}
                              </p>
                            </details>
                          ))}
                        </div>
                      </div>
                    )}

                    {hasExpandedContent && (
                      <div className="meta-row flex items-center justify-between text-xs text-[var(--muted)] pt-2 border-t border-[var(--border)]">
                        <span>{topic.estimatedHours}h estimated</span>
                        {topic.difficulty != null && (
                          <DifficultyBar level={topic.difficulty} />
                        )}
                      </div>
                    )}

                    {!hasExpandedContent && topic.subtopics.length === 0 && (
                      <p className="text-sm text-[var(--muted)]">
                        No extra details for this topic yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
