"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCourseStore } from "@/store/courseStore";
import { getSavedCourseById } from "@/lib/storage";
import { TopicList } from "@/components/TopicList";
import { ProjectCard } from "@/components/ProjectCard";
import { ResourceList } from "@/components/ResourceList";
import { CheckpointList } from "@/components/CheckpointList";

export default function PhaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const phaseId = Number(params.phaseId);
  const currentCourse = useCourseStore((s) => s.currentCourse);
  const saved = courseId !== "new" ? getSavedCourseById(courseId) : null;
  const course = currentCourse ?? (saved ? { course: saved.course } : null);

  if (!course) {
    router.replace("/");
    return null;
  }

  const phase = course.course.phases.find((p) => p.phase === phaseId);
  if (!phase) {
    router.replace(`/course/${courseId}`);
    return null;
  }

  const phaseIndex = course.course.phases.findIndex((p) => p.phase === phaseId);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/course/${courseId}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-xs font-medium text-[var(--primary)]">Phase {phase.phase}</span>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mt-1">{phase.title}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{phase.weeks}</p>
          <p className="mt-3 text-[var(--foreground)]">{phase.objective}</p>
        </div>

        <div className="space-y-8">
          <TopicList topics={phase.topics} />
          <ProjectCard project={phase.project} />
          <ResourceList resources={phase.resources} />
          <CheckpointList
            courseId={courseId}
            phaseIndex={phaseIndex}
            checkpoints={phase.checkpoints}
          />
        </div>
      </main>
    </div>
  );
}
