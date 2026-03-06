"use client";

import { FolderKanban } from "lucide-react";
import type { PhaseProject } from "@/lib/types";

interface ProjectCardProps {
  project: PhaseProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="text-sm font-semibold text-[var(--muted)] flex items-center gap-2 mb-2">
        <FolderKanban className="h-4 w-4" />
        Phase project
      </h3>
      <h4 className="font-semibold text-[var(--foreground)]">{project.title}</h4>
      <p className="mt-1 text-sm text-[var(--muted)]">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-[var(--primary)]/20 px-2.5 py-0.5 text-xs font-medium text-[var(--primary)]">
          {project.difficulty}
        </span>
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--foreground)]"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
