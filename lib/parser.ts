import type {
  Course,
  Difficulty,
  ProjectDifficulty,
  ResourceType,
  TopicSelfCheckItem,
} from "./types";

function stripMarkdownCodeBlock(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function safeArray<T>(v: unknown, defaultValue: T[] = []): T[] {
  if (Array.isArray(v)) return v as T[];
  return defaultValue;
}

function safeString(v: unknown, defaultValue = ""): string {
  if (typeof v === "string") return v;
  if (v != null && typeof v === "object" && "toString" in v) return String(v);
  return defaultValue;
}

function safeNumber(v: unknown, defaultValue = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return defaultValue;
}

const VALID_DIFFICULTY: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
const VALID_PROJECT_DIFFICULTY: ProjectDifficulty[] = ["Easy", "Medium", "Hard"];
const VALID_RESOURCE_TYPES: ResourceType[] = [
  "youtube",
  "video",
  "article",
  "docs",
  "book",
  "course",
];

function ensureDifficulty(v: unknown): Difficulty {
  if (typeof v === "string" && VALID_DIFFICULTY.includes(v as Difficulty))
    return v as Difficulty;
  return "Beginner";
}

function ensureProjectDifficulty(v: unknown): ProjectDifficulty {
  if (typeof v === "string" && VALID_PROJECT_DIFFICULTY.includes(v as ProjectDifficulty))
    return v as ProjectDifficulty;
  return "Medium";
}

function ensureResourceType(v: unknown): ResourceType {
  if (typeof v === "string" && VALID_RESOURCE_TYPES.includes(v as ResourceType))
    return v as ResourceType;
  return "article";
}

export function parseCourseJson(raw: string): Course {
  const cleaned = stripMarkdownCodeBlock(raw);
  let data: unknown;
  try {
    data = JSON.parse(cleaned);
  } catch {
    throw new Error("Invalid JSON in course response");
  }

  const root = data as Record<string, unknown>;
  const courseObj = root?.course as Record<string, unknown> | undefined;
  if (!courseObj || typeof courseObj !== "object") {
    throw new Error("Missing or invalid 'course' object");
  }

  const phases = safeArray(courseObj.phases).map((p, i) => {
    const phase = p as Record<string, unknown>;
    return {
    phase: safeNumber(phase.phase, i + 1),
    title: safeString(phase.title, `Phase ${i + 1}`),
    weeks: safeString(phase.weeks, `Week ${i + 1}`),
    objective: safeString(phase.objective),
    topics: safeArray(phase.topics).map((t) => {
      const topic = t as Record<string, unknown>;
      const rawDifficulty = safeNumber(topic.difficulty);
      const difficulty =
        rawDifficulty >= 1 && rawDifficulty <= 5 ? rawDifficulty : undefined;
      const selfCheckRaw = safeArray(topic.selfCheck);
      const selfCheck: TopicSelfCheckItem[] = selfCheckRaw.map((sc) => {
        const item = sc as Record<string, unknown>;
        return {
          question: safeString(item.question),
          hint: safeString(item.hint),
        };
      });
      return {
        name: safeString(topic.name),
        subtopics: safeArray(topic.subtopics).map((s) => safeString(s)),
        estimatedHours: safeNumber(topic.estimatedHours),
        difficulty,
        why: safeString(topic.why) || undefined,
        studySteps: safeArray(topic.studySteps).map((s) => safeString(s)),
        selfCheck: selfCheck.length > 0 ? selfCheck : undefined,
      };
    }),
    project: (() => {
      const proj = phase.project as Record<string, unknown> | undefined;
      return {
        title: proj ? safeString(proj.title) : "",
        description: proj ? safeString(proj.description) : "",
        techStack: proj ? safeArray(proj.techStack).map((s) => safeString(s)) : [],
        difficulty: proj ? ensureProjectDifficulty(proj.difficulty) : "Medium",
      };
    })(),
    resources: safeArray(phase.resources).map((r) => {
      const res = r as Record<string, unknown>;
      const embedType = res.embedType as string | undefined;
      return {
        type: ensureResourceType(res.type),
        title: safeString(res.title),
        url: safeString(res.url),
        isFree: Boolean(res.isFree),
        isRecommended: Boolean(res.isRecommended),
        searchQuery: safeString(res.searchQuery) || undefined,
        embedType:
          embedType === "channel" || embedType === "video"
            ? (embedType as "channel" | "video")
            : undefined,
      };
    }),
    checkpoints: safeArray(phase.checkpoints).map((c) => safeString(c)),
  };
  });

  const fp = courseObj.finalProject as Record<string, unknown> | undefined;
  const finalProject = {
    title: fp ? safeString(fp.title) : "",
    description: fp ? safeString(fp.description) : "",
    techStack: fp ? safeArray(fp.techStack).map((s) => safeString(s)) : [],
    features: fp ? safeArray(fp.features).map((s) => safeString(s)) : [],
  };

  const lp = courseObj.learningPace as Record<string, unknown> | undefined;
  const hoursPerDay = lp?.hoursPerDay as Record<string, unknown> | undefined;
  const estimatedCompletion = lp?.estimatedCompletion as Record<string, unknown> | undefined;
  const learningPace = {
    hoursPerDay: {
      casual: hoursPerDay ? safeNumber(hoursPerDay.casual, 1) : 1,
      focused: hoursPerDay ? safeNumber(hoursPerDay.focused, 2) : 2,
      intensive: hoursPerDay ? safeNumber(hoursPerDay.intensive, 4) : 4,
    },
    estimatedCompletion: {
      casual: estimatedCompletion ? safeString(estimatedCompletion.casual, "—") : "—",
      focused: estimatedCompletion ? safeString(estimatedCompletion.focused, "—") : "—",
      intensive: estimatedCompletion ? safeString(estimatedCompletion.intensive, "—") : "—",
    },
  };

  return {
    course: {
      title: safeString(courseObj.title, "Untitled Course"),
      goal: safeString(courseObj.goal),
      totalWeeks: safeNumber(courseObj.totalWeeks, phases.length),
      difficulty: ensureDifficulty(courseObj.difficulty),
      prerequisite: safeArray(courseObj.prerequisite).map((s: unknown) => safeString(s)),
      phases,
      finalProject,
      learningPace,
      tips: safeArray(courseObj.tips).map((s: unknown) => safeString(s)),
    },
  };
}
