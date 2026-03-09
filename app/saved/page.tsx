"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Pencil, Target } from "lucide-react";
import { useCourseStorage } from "@/hooks/useCourseStorage";

export default function SavedPage() {
  const { savedCourses, load, remove, rename } = useCourseStorage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (editingId) {
      const c = savedCourses.find((x) => x.id === editingId);
      setEditName(c?.name ?? c?.course.title ?? "");
    }
  }, [editingId, savedCourses]);

  const handleRename = (id: string) => {
    if (editName.trim()) rename(id, editName.trim());
    setEditingId(null);
  };

  if (savedCourses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <p className="text-[var(--muted)]">No saved courses yet. Generate one from the home page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Saved courses</h1>
          <Link
            href="/interview"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition"
          >
            <Target className="h-4 w-4" />
            Interview
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <ul className="space-y-3">
          {savedCourses.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              {editingId === c.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(c.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleRename(c.id)}
                    className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/course/${c.id}`}
                    className="flex-1 min-w-0"
                    onClick={() => load(c.id)}
                  >
                    <p className="font-medium text-[var(--foreground)] truncate">
                      {c.name ?? c.course.title}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {c.course.difficulty} · {c.course.totalWeeks} weeks
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name ?? c.course.title);
                    }}
                    className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--foreground)]"
                    aria-label="Rename"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Delete this course?")) remove(c.id);
                    }}
                    className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--destructive)]/20 hover:text-[var(--destructive)]"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
