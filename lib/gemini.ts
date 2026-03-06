import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseCourseJson } from "./parser";
import type { Course } from "./types";

const SYSTEM_PROMPT = `You are DevPath — an expert software engineering mentor and curriculum designer.

When a user gives you a learning topic or goal, you MUST respond with a structured JSON object containing:

{
  "course": {
    "title": string,
    "goal": string,
    "totalWeeks": number,
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "prerequisite": string[],
    "phases": [
      {
        "phase": number,
        "title": string,
        "weeks": string,
        "objective": string,
        "topics": [
          {
            "name": string,
            "subtopics": string[],
            "estimatedHours": number,
            "difficulty": 1 | 2 | 3 | 4 | 5,
            "why": string,
            "studySteps": string[],
            "selfCheck": [
              { "question": string, "hint": string }
            ]
          }
        ],
        "project": {
          "title": string,
          "description": string,
          "techStack": string[],
          "difficulty": "Easy" | "Medium" | "Hard"
        },
        "resources": [
          {
            "type": "video" | "youtube" | "article" | "docs" | "book" | "course",
            "title": string,
            "url": string,
            "isFree": boolean,
            "isRecommended": boolean,
            "searchQuery": string,
            "embedType": "channel" | "video"
          }
        ],
        "checkpoints": string[]
      }
    ],
    "finalProject": {
      "title": string,
      "description": string,
      "techStack": string[],
      "features": string[]
    },
    "learningPace": {
      "hoursPerDay": {
        "casual": number,
        "focused": number,
        "intensive": number
      },
      "estimatedCompletion": {
        "casual": string,
        "focused": string,
        "intensive": string
      }
    },
    "tips": string[]
  }
}

Rules:
- Always return ONLY valid JSON. No markdown, no extra text.
- For each topic, provide: "why" (1 sentence on why it matters), "studySteps" (3–5 ordered steps to learn it), "selfCheck" (2–3 items with "question" and "hint"), and "difficulty" (1–5).
- Scale topic depth to difficulty level. Projects must be buildable solo. Checkpoints should be concrete and testable. Learning pace must be realistic.

CRITICAL RESOURCE RULES — follow exactly:
1. NEVER invent or guess URLs. Only use resource types and verified base URLs.
2. For "docs" type: set url to the official docs ROOT domain only (e.g. https://docs.spring.io, https://go.dev/doc, https://nodejs.org/docs).
3. For "youtube" type: set url to the channel URL only, never a video URL (e.g. https://www.youtube.com/@Fireship). Set embedType to "channel" so the frontend knows not to embed a video.
4. For "course" type: only use platforms from this verified list: freeCodeCamp, The Odin Project, Exercism, roadmap.sh, CS50, Kaggle Learn, Codecrafters, MDN Web Docs, Frontend Mentor. Use their official homepage URLs.
5. For "article" type: link to DEV.to, Medium, or Hashnode homepages, and add a searchQuery field with exact search terms to find the article (e.g. "searchQuery": "Spring Boot global exception handling @ControllerAdvice").
6. Include a "searchQuery" field on every resource (short phrase or keywords) so users can find it manually if the URL changes. For youtube/channel resources, searchQuery should describe the topic or video to search for on that channel.`;

// Supported model IDs: gemini-2.5-flash | gemini-2.0-flash | gemini-pro
const MODEL = "gemini-2.5-flash";

export async function generateCourse(userGoal: string): Promise<Course> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set. Add it to .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(
    `Generate a complete learning path for this goal. Return ONLY the JSON object, no other text.\n\nGoal: ${userGoal}`
  );

  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return parseCourseJson(text);
}
