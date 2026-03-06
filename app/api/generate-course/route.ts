import { generateCourse } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { goal } = (await request.json()) as { goal?: string };
    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid 'goal' in request body" },
        { status: 400 }
      );
    }

    const course = await generateCourse(goal.trim());
    return NextResponse.json(course);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
