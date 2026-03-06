"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useCourseGeneration } from "@/hooks/useCourseGeneration";
import { LoadingState } from "./LoadingState";

interface CourseInputProps {
  goal: string;
  setGoal: (value: string) => void;
}

export function CourseInput({ goal, setGoal }: CourseInputProps) {
  const router = useRouter();
  const { generate, status, error, reset } = useCourseGeneration();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || status === "loading") return;
    try {
      await generate(goal);
      router.push("/course/new");
    } catch {
      // error already set in hook
    }
  };

  if (status === "loading") {
    return <LoadingState />;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <label htmlFor="goal" className="sr-only">
          Learning goal
        </label>
        <input
          id="goal"
          type="text"
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            if (error) reset();
          }}
          placeholder="e.g. Learn backend with Node.js and PostgreSQL"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition"
          disabled={false}
          autoFocus
        />
        <button
          type="submit"
          disabled={!goal.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[var(--primary)] p-2.5 text-white hover:bg-[var(--primary-muted)] disabled:opacity-50 disabled:pointer-events-none transition"
          aria-label="Generate course"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-[var(--destructive)]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
