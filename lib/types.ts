// DevPath AI — single source of truth for course structure

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ProjectDifficulty = "Easy" | "Medium" | "Hard";
export type ResourceType =
  | "youtube"
  | "video"
  | "article"
  | "docs"
  | "book"
  | "course";
export type LearningPaceKey = "casual" | "focused" | "intensive";

export interface TopicSelfCheckItem {
  question: string;
  hint: string;
}

export interface Topic {
  name: string;
  subtopics: string[];
  estimatedHours: number;
  /** 1–5 difficulty level for the topic */
  difficulty?: number;
  /** 1–2 sentence context on why this topic matters */
  why?: string;
  /** 3–5 ordered steps to learn this topic */
  studySteps?: string[];
  /** 2–3 questions to verify understanding (hint = brief answer hint) */
  selfCheck?: TopicSelfCheckItem[];
}

export interface PhaseProject {
  title: string;
  description: string;
  techStack: string[];
  difficulty: ProjectDifficulty;
}

export interface Resource {
  type: ResourceType;
  title: string;
  url: string;
  isFree: boolean;
  isRecommended?: boolean;
  /** Fallback search string so users can find the resource if the URL changes */
  searchQuery?: string;
  /** Only embed YouTube if "video"; "channel" = show channel card + search */
  embedType?: "channel" | "video";
}

export interface Phase {
  phase: number;
  title: string;
  weeks: string;
  objective: string;
  topics: Topic[];
  project: PhaseProject;
  resources: Resource[];
  checkpoints: string[];
}

export interface FinalProject {
  title: string;
  description: string;
  techStack: string[];
  features: string[];
}

export interface LearningPace {
  hoursPerDay: {
    casual: number;
    focused: number;
    intensive: number;
  };
  estimatedCompletion: {
    casual: string;
    focused: string;
    intensive: string;
  };
}

export interface Course {
  course: {
    title: string;
    goal: string;
    totalWeeks: number;
    difficulty: Difficulty;
    prerequisite: string[];
    phases: Phase[];
    finalProject: FinalProject;
    learningPace: LearningPace;
    tips: string[];
  };
}

export interface SavedCourse extends Course {
  id: string;
  createdAt: number;
  name?: string;
}

export interface CheckpointProgress {
  [courseId: string]: {
    [phaseIndex: string]: boolean[]; // phase index -> checkpoint completed flags
  };
}
