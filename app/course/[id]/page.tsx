"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Copy, Save } from "lucide-react";
import { useCourseStore } from "@/store/courseStore";
import { useCourseStorage } from "@/hooks/useCourseStorage";
import { getSavedCourseById } from "@/lib/storage";
import { getTotalCheckpointsCompleted } from "@/lib/storage";
import { CourseOverview } from "@/components/CourseOverview";
import { PhaseCard } from "@/components/PhaseCard";
import { exportCourseAsMarkdown, exportCourseAsJson, copyCourseToClipboard } from "@/lib/export";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const currentCourse = useCourseStore((s) => s.currentCourse);
  const { load, save } = useCourseStorage();

  useEffect(() => {
    if (id === "new") {
      if (!useCourseStore.getState().currentCourse) router.replace("/");
      return;
    }
    const saved = getSavedCourseById(id);
    if (saved) {
      const { currentSavedId } = useCourseStore.getState();
      if (currentSavedId !== id) load(id);
    } else if (!useCourseStore.getState().currentCourse) router.replace("/");
  }, [id, load, router]);

  const saved = id !== "new" ? getSavedCourseById(id) : null;
  const course =
    id === "new" ? currentCourse : saved ? { course: saved.course } : currentCourse;
  if (!course) return null;

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener("devpath-checkpoint-update", handler);
    return () => window.removeEventListener("devpath-checkpoint-update", handler);
  }, []);

  const { phases } = course.course;
  const phaseCounts = phases.map((p) => p.checkpoints.length);
  const totalCheckpoints = phaseCounts.reduce((a, b) => a + b, 0);
  const completed = id !== "new" ? getTotalCheckpointsCompleted(id, phaseCounts) : 0;

  const handleSave = () => {
    const saved = save(course);
    router.replace(`/course/${saved.id}`);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            {id === "new" && (
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--primary-muted)]"
              >
                <Save className="h-4 w-4" />
                Save course
              </button>
            )}
            <button
              type="button"
              onClick={() => copyCourseToClipboard(course)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--card)]"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <button
              type="button"
              onClick={() => exportCourseAsMarkdown(course)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--card)]"
            >
              <Download className="h-4 w-4" />
              .md
            </button>
            <button
              type="button"
              onClick={() => exportCourseAsJson(course)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--card)]"
            >
              <Download className="h-4 w-4" />
              .json
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <CourseOverview course={course.course} />

        {totalCheckpoints > 0 && id !== "new" && (
          <div className="mt-6 overflow-hidden rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Progress
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {completed} / {totalCheckpoints} checkpoints
                <span className="ml-2 text-slate-500 font-normal">
                  ({totalCheckpoints ? Math.round((100 * completed) / totalCheckpoints) : 0}%)
                </span>
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-muted)] transition-all duration-500 ease-out"
                style={{ width: `${totalCheckpoints ? (100 * completed) / totalCheckpoints : 0}%` }}
                role="progressbar"
                aria-valuenow={completed}
                aria-valuemin={0}
                aria-valuemax={totalCheckpoints}
                aria-label="Checkpoints completed"
              />
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-500">
            Phases
          </h2>
          <div className="space-y-4">
            {phases.map((phase) => (
              <PhaseCard
                key={phase.phase}
                phase={phase}
                courseId={id}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
