export interface InterviewStage {
  stage: string;
  format: string;
  focus: string;
  tips: string[];
}

export interface QuestionItem {
  id: string;
  category: "Behavioral" | "Technical" | "SystemDesign" | "RoleSpecific" | "CultureFit" | "Resume";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  whyTheyAsk: string;
  answerFramework: "STAR" | "PREP" | "Direct" | "Whiteboard";
  starTemplate: { situation: string; task: string; action: string; result: string };
  companyStyleTip: string;
  sampleAnswer: string;
  followUps: string[];
}

export interface InterviewPrepKit {
  sessionTitle: string;
  companyDataAvailable: boolean;
  companyInsights: {
    overview: string;
    culture: { keyword: string; description: string }[];
    interviewProcess: {
      stages: InterviewStage[];
      typicalDuration: string;
      knownDifficulty: string;
      source: string;
    };
    valuesTheyHireFor: string[];
    redFlags: string[];
    questionsToAskThem: string[];
  };
  resumeAnalysis: {
    strongPoints: string[];
    likelyProbed: { item: string; whyTheyAsk: string; prepNote: string }[];
    gaps: string[];
    keywordsToEmphasize: string[];
  };
  questionBank: QuestionItem[];
  studyPlan: {
    dailyPlan: { day: number; focus: string; tasks: string[]; timeEstimate: string }[];
  };
  prepChecklist: {
    oneWeekBefore: string[];
    oneDayBefore: string[];
    dayOf: string[];
    afterInterview: string[];
  };
}
