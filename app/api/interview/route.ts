import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const { resume, jobDescription, companyName, role, manualTypes } = await req.json();

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert technical interview coach.

Company: ${companyName}
Role: ${role}
${manualTypes?.length ? `Interview Types (user specified): ${manualTypes.join(", ")}` : ""}

Resume:
${resume}

Job Description:
${jobDescription}

Return ONLY a valid JSON object with this exact structure, no markdown, no backticks:

{
  "sessionTitle": "Company — Role Prep",
  "companyDataAvailable": true,
  "companyInsights": {
    "overview": "2-3 sentence company overview",
    "culture": [{ "keyword": "Innovation", "description": "..." }],
    "interviewProcess": {
      "stages": [
        { "stage": "Recruiter Screen", "format": "30-min call", "focus": "background fit", "tips": ["tip1", "tip2"] }
      ],
      "typicalDuration": "2-3 weeks",
      "knownDifficulty": "High",
      "source": "Based on Glassdoor reports"
    },
    "valuesTheyHireFor": ["ownership", "curiosity"],
    "redFlags": ["vague answers", "no questions asked"],
    "questionsToAskThem": ["What does success look like in 90 days?"]
  },
  "resumeAnalysis": {
    "strongPoints": ["Strong TypeScript background matching JD"],
    "likelyProbed": [
      { "item": "Led team of 5", "whyTheyAsk": "Testing leadership depth", "prepNote": "Use STAR format" }
    ],
    "gaps": ["No mention of system design experience"],
    "keywordsToEmphasize": ["distributed systems", "REST APIs"]
  },
  "questionBank": [
    {
      "id": "q1",
      "category": "Behavioral",
      "difficulty": "Medium",
      "question": "Tell me about a time you handled conflict in a team.",
      "whyTheyAsk": "Tests emotional intelligence and collaboration",
      "answerFramework": "STAR",
      "starTemplate": {
        "situation": "Describe the team context and conflict",
        "task": "Your role in resolving it",
        "action": "Specific steps you took",
        "result": "Outcome and what you learned"
      },
      "companyStyleTip": "This company values direct communication — be specific.",
      "sampleAnswer": "At my previous role at...",
      "followUps": ["How would you handle it differently?", "How do you prevent conflicts?"]
    }
  ],
  "studyPlan": {
    "dailyPlan": [
      { "day": 1, "focus": "Company Research", "tasks": ["Read about company values", "Review job description"], "timeEstimate": "2h" }
    ]
  },
  "prepChecklist": {
    "oneWeekBefore": ["Research company thoroughly", "Practice 10 behavioral questions"],
    "oneDayBefore": ["Review your resume highlights", "Prepare 5 questions to ask"],
    "dayOf": ["Test your audio/video", "Arrive 10 mins early"],
    "afterInterview": ["Send thank you email within 24h", "Note questions you struggled with"]
  }
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text || !text.trim()) {
      throw new Error("Empty response from Gemini");
    }
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    console.error("[interview] API error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
