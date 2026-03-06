"use client";

import React from "react";
import { Clock, ListChecks, GraduationCap, Sparkles } from "lucide-react";
import { useCourseStore } from "@/store/courseStore";
import type { Course, Difficulty, LearningPaceKey } from "@/lib/types";

interface CourseOverviewProps {
  course: Course["course"];
}

const difficultyConfig: Record<Difficulty, string> = {
  Beginner: "bg-emerald-500/20 text-emerald-800 border border-emerald-300",
  Intermediate: "bg-amber-500/20 text-amber-800 border border-amber-300",
  Advanced: "bg-rose-500/20 text-rose-800 border border-rose-300",
};

const paceLabel: Record<LearningPaceKey, string> = {
  casual: "Casual pace",
  focused: "Focused pace",
  intensive: "Intensive pace",
};

/** Renders tip text with **bold** and `inline code` as HTML. */
function renderTipContent(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let key = 0;

  // First split by backticks (code segments)
  const byCode = text.split("`");
  byCode.forEach((segment, i) => {
    if (i % 2 === 1) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-800"
        >
          {segment}
        </code>
      );
    } else {
      // Within plain text, split by **bold**
      const byBold = segment.split(/\*\*(.*?)\*\*/g);
      byBold.forEach((part, j) => {
        if (j % 2 === 1) {
          nodes.push(<strong key={key++}>{part}</strong>);
        } else if (part) {
          nodes.push(part);
        }
      });
    }
  });

  return nodes.length === 1 && typeof nodes[0] === "string" ? nodes[0] : nodes;
}

export function CourseOverview({ course }: CourseOverviewProps) {
  const pace = useCourseStore((s) => s.pace);

  const {
    title,
    goal,
    totalWeeks,
    difficulty,
    prerequisite,
    finalProject,
    learningPace,
    tips,
  } = course;

  const hoursPerDay = learningPace.hoursPerDay[pace];
  const estimatedCompletion = learningPace.estimatedCompletion[pace];
  const diffStyle = difficultyConfig[difficulty];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
      {/* Top accent strip */}
      <div
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)]"
        aria-hidden
      />

      <div className="relative p-6 sm:p-8">
        {/* Header: title + pace */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)]">
              {goal}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold ${diffStyle}`}
              >
                {difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                {totalWeeks} week{totalWeeks === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/80 p-4 ring-1 ring-slate-200/80 sm:min-w-[200px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {paceLabel[pace]}
            </span>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
              <Clock className="h-4 w-4 text-[var(--primary)]" />
              {hoursPerDay}h / day
            </p>
            <p className="text-xs text-slate-600">{estimatedCompletion}</p>
          </div>
        </div>

        {/* Prerequisites */}
        {prerequisite.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <ListChecks className="h-4 w-4 text-[var(--primary)]" />
              Prerequisites
            </h2>
            <ul className="space-y-2">
              {prerequisite.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-lg border-l-4 border-[var(--primary)] bg-slate-50/80 py-2 pl-4 pr-3 text-sm text-slate-700"
                >
                  <span className="text-[var(--primary)]">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Final project + Tips */}
        <div className="mt-8 grid gap-5 md:grid-cols-[1.15fr_1fr]">
          <div className="rounded-xl border border-teal-200/60 bg-gradient-to-br from-teal-50/70 to-white p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800/80">
              <GraduationCap className="h-4 w-4 text-teal-600" />
              Final project
            </h2>
            <h3 className="text-lg font-bold text-slate-800">
              {finalProject.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {finalProject.description}
            </p>
            {finalProject.techStack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {finalProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-teal-100/80 px-2.5 py-1 text-xs font-medium text-teal-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {tips.length > 0 && (
            <div className="rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800/80">
                <Sparkles className="h-4 w-4 text-amber-600" />
                Tips for success
              </h2>
              <ul className="space-y-2.5">
                {tips.slice(0, 4).map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                    <span className="leading-snug">
                      {renderTipContent(tip)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
