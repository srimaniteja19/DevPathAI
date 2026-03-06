"use client";

import { useState, useCallback } from "react";
import { useCourseStore } from "@/store/courseStore";
import type { Course } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export function useCourseGeneration() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const setCurrentCourse = useCourseStore((s) => s.setCurrentCourse);

  const generate = useCallback(async (goal: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate course");
      }
      const course = data as Course;
      setCurrentCourse(course, null);
      setStatus("success");
      return course;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setStatus("error");
      throw err;
    }
  }, [setCurrentCourse]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { generate, status, error, reset };
}
