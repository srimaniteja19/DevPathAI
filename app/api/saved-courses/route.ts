import { NextResponse } from "next/server";
import type { SavedCourse } from "@/lib/types";
import {
  listSavedCoursesFromDb,
  upsertSavedCourseInDb,
  deleteSavedCourseFromDb,
} from "@/lib/serverSavedCourses";

export const runtime = "nodejs";

export async function GET() {
  const courses = listSavedCoursesFromDb();
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  try {
    const { saved } = (await request.json()) as { saved?: SavedCourse };
    if (!saved || !saved.id) {
      return NextResponse.json(
        { error: "Missing or invalid 'saved' payload" },
        { status: 400 }
      );
    }

    upsertSavedCourseInDb(saved);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to persist saved course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { saved } = (await request.json()) as { saved?: SavedCourse };
    if (!saved || !saved.id) {
      return NextResponse.json(
        { error: "Missing or invalid 'saved' payload" },
        { status: 400 }
      );
    }

    upsertSavedCourseInDb(saved);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update saved course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing 'id' query parameter" },
        { status: 400 }
      );
    }

    deleteSavedCourseFromDb(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete saved course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

