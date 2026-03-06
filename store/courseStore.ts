import { create } from "zustand";
import type { Course, SavedCourse } from "@/lib/types";

interface CourseState {
  currentCourse: Course | null;
  currentSavedId: string | null;
  savedCourses: SavedCourse[];
  pace: "casual" | "focused" | "intensive";
  setCurrentCourse: (course: Course | null, savedId?: string | null) => void;
  setPace: (pace: "casual" | "focused" | "intensive") => void;
  setSavedCourses: (courses: SavedCourse[]) => void;
  hydrateSavedCourses: (courses: SavedCourse[]) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  currentCourse: null,
  currentSavedId: null,
  savedCourses: [],
  pace: "focused",

  setCurrentCourse: (course, savedId = null) =>
    set({ currentCourse: course, currentSavedId: savedId ?? null }),

  setPace: (pace) => set({ pace }),

  setSavedCourses: (savedCourses) => set({ savedCourses }),

  hydrateSavedCourses: (savedCourses) => set({ savedCourses }),
}));
