"use client";

import { useCallback, useEffect } from "react";
import {
  getSavedCourses,
  saveCourse,
  updateSavedCourse,
  deleteSavedCourse,
  getSavedCourseById,
} from "@/lib/storage";
import { useCourseStore } from "@/store/courseStore";
import type { Course, SavedCourse } from "@/lib/types";

export function useCourseStorage() {
  const { setSavedCourses, hydrateSavedCourses, setCurrentCourse } = useCourseStore();

  useEffect(() => {
    hydrateSavedCourses(getSavedCourses());
  }, [hydrateSavedCourses]);

  const save = useCallback(
    (course: Course, name?: string): SavedCourse => {
      const saved = saveCourse(course, name);
      setSavedCourses(getSavedCourses());
      return saved;
    },
    [setSavedCourses]
  );

  const rename = useCallback(
    (id: string, name: string) => {
      updateSavedCourse(id, { name });
      setSavedCourses(getSavedCourses());
    },
    [setSavedCourses]
  );

  const remove = useCallback(
    (id: string) => {
      deleteSavedCourse(id);
      setSavedCourses(getSavedCourses());
      const state = useCourseStore.getState();
      if (state.currentSavedId === id) {
        setCurrentCourse(null, null);
      }
    },
    [setSavedCourses, setCurrentCourse]
  );

  const load = useCallback(
    (id: string) => {
      const saved = getSavedCourseById(id);
      if (saved) {
        setCurrentCourse({ course: saved.course }, id);
      }
      return saved;
    },
    [setCurrentCourse]
  );

  const savedList = useCourseStore((s) => s.savedCourses);

  return { save, rename, remove, load, savedCourses: savedList };
}
