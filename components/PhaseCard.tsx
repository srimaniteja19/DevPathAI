"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FolderKanban } from "lucide-react";
import type { Phase } from "@/lib/types";

interface PhaseCardProps {
  phase: Phase;
  courseId: string;
  isExpanded?: boolean;
}

export function PhaseCard({ phase, courseId }: PhaseCardProps) {
  const topicCount = phase.topics.length;
  const href = `/course/${courseId}/phase/${phase.phase}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 transition hover:shadow-xl hover:ring-[var(--primary)]/30"
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--primary)] to-[var(--accent)] opacity-90"
        aria-hidden
      />

      <div className="pl-4 sm:pl-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-muted)] text-lg font-bold text-white shadow-sm">
                {phase.phase}
              </span>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                  {phase.title}
                </h3>
                <p className="text-sm text-slate-500">{phase.weeks}</p>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 line-clamp-2">
              {phase.objective}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                <BookOpen className="h-3.5 w-3.5" />
                {topicCount} topic{topicCount === 1 ? "" : "s"}
              </span>
              {phase.topics.slice(0, 3).map((t) => (
                <span
                  key={t.name}
                  title={t.name}
                  className="max-w-[180px] truncate rounded-lg bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-800"
                >
                  {t.name}
                </span>
              ))}
              {phase.topics.length > 3 && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                  +{phase.topics.length - 3} more
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                <FolderKanban className="h-3.5 w-3.5" />
                {phase.project.title}
              </span>
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition group-hover:bg-[var(--primary)] group-hover:text-white">
            View phase
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
