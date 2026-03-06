# DevPath AI

A self-learning platform that generates personalized course plans using Google Gemini. Enter a learning goal and get a structured path with phases, projects, resources, and checkpoints.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API (gemini-1.5-flash)
- **State:** Zustand
- **Package manager:** Bun

## Setup

```bash
# Install dependencies
bun install

# Copy env and add your Gemini API key
cp .env.local.example .env.local
# Edit .env: GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
# Get a key at https://aistudio.google.com/app/apikey

# Run dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

1. **Course generation** — Enter a goal (e.g. "Learn backend with Node.js and PostgreSQL"); Gemini returns a full JSON course plan.
2. **Course overview** — Title, difficulty, weeks, prerequisites, and a 3-pace toggle (Casual / Focused / Intensive).
3. **Phase timeline** — All phases as cards with week range, objective, topic count, and project title; click to open phase detail.
4. **Phase detail** — Topics (accordion), project card, resources by type, and a persisted checkpoint checklist.
5. **Saved courses** — Save to localStorage; list, rename, and delete from the Saved page.
6. **Progress** — Global progress bar (X of Y checkpoints) on the course page; checkpoints persist.
7. **Export** — Download as Markdown or JSON; copy full plan to clipboard.

## Project structure

```
app/
  page.tsx                 # Home + topic input
  course/[id]/page.tsx     # Course overview + phase list
  course/[id]/phase/[phaseId]/page.tsx
  saved/page.tsx           # Saved courses list
components/                 # CourseInput, CourseOverview, PhaseCard, etc.
lib/
  gemini.ts                # Gemini client + system prompt
  parser.ts                # JSON parse + validate
  storage.ts               # localStorage helpers
  export.ts                # Markdown / JSON export
  types.ts                 # TypeScript interfaces
hooks/                     # useCourseGeneration, useCourseStorage
store/courseStore.ts       # Zustand store
```

## Env

| Variable         | Description                    |
|------------------|--------------------------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | API key from Google AI Studio  |
