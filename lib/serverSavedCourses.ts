import type { SavedCourse } from "./types";
import { db } from "./db";

interface SavedCourseRow {
  id: string;
  created_at: number;
  name: string | null;
  payload_json: string;
}

export function listSavedCoursesFromDb(): SavedCourse[] {
  const rows = db
    .prepare<SavedCourseRow>("SELECT id, created_at, name, payload_json FROM saved_courses ORDER BY created_at DESC")
    .all();

  return rows.map((row) => {
    try {
      return JSON.parse(row.payload_json) as SavedCourse;
    } catch {
      // Fallback if JSON is corrupted: reconstruct minimal object
      return {
        id: row.id,
        createdAt: row.created_at,
        name: row.name ?? undefined,
        course: { title: "", goal: "", totalWeeks: 0, difficulty: "Beginner", prerequisite: [], phases: [], finalProject: { title: "", description: "", techStack: [], features: [] }, learningPace: { hoursPerDay: { casual: 0, focused: 0, intensive: 0 }, estimatedCompletion: { casual: "", focused: "", intensive: "" } }, tips: [] },
      };
    }
  });
}

export function upsertSavedCourseInDb(saved: SavedCourse): void {
  const stmt = db.prepare(
    `INSERT INTO saved_courses (id, created_at, name, payload_json)
     VALUES (@id, @created_at, @name, @payload_json)
     ON CONFLICT(id) DO UPDATE SET
       created_at = excluded.created_at,
       name = excluded.name,
       payload_json = excluded.payload_json`
  );

  stmt.run({
    id: saved.id,
    created_at: saved.createdAt,
    name: saved.name ?? null,
    payload_json: JSON.stringify(saved),
  });
}

export function deleteSavedCourseFromDb(id: string): void {
  db.prepare("DELETE FROM saved_courses WHERE id = ?").run(id);
}

