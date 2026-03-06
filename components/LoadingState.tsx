"use client";

import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Generating your learning path…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)]" aria-hidden />
      </div>
      <p className="text-[var(--muted)] text-sm font-medium">{message}</p>
      <div className="flex gap-1.5 mt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 animate-pulse">
      <div className="h-5 w-2/3 rounded bg-[var(--border)] mb-3" />
      <div className="h-3 w-full rounded bg-[var(--border)] mb-2" />
      <div className="h-3 w-4/5 rounded bg-[var(--border)]" />
    </div>
  );
}

export function SkeletonPhaseTimeline({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
