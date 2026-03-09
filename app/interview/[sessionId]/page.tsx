"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InterviewPrepKit } from "@/lib/interviewTypes";
import { getInterviewById } from "@/lib/interviewStorage";
import { CompanyIntelTab } from "@/components/interview/CompanyIntelTab";
import { ResumeTab } from "@/components/interview/ResumeTab";
import { QuestionBankTab } from "@/components/interview/QuestionBankTab";
import { StudyPlanTab } from "@/components/interview/StudyPlanTab";
import { DayOfTab } from "@/components/interview/DayOfTab";

const TABS = [
  { id: "company", label: "Company Intel" },
  { id: "resume", label: "Resume Analysis" },
  { id: "questions", label: "Question Bank" },
  { id: "study", label: "Study Plan" },
  { id: "dayof", label: "Day-of" },
];

export default function InterviewResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [data, setData] = useState<InterviewPrepKit | null>(null);
  const [activeTab, setActiveTab] = useState("company");
  const [practicedIds, setPracticedIds] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(() => {
    const saved = getInterviewById(sessionId);
    if (saved) {
      setData(saved.data);
    } else {
      const stored = localStorage.getItem(`interview_${sessionId}`);
      if (stored) setData(JSON.parse(stored));
      else router.replace("/interview");
    }
    const practiced = localStorage.getItem(`practiced_${sessionId}`);
    if (practiced) setPracticedIds(new Set(JSON.parse(practiced)));
  }, [sessionId, router]);

  const markPracticed = (id: string) => {
    const next = new Set(practicedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setPracticedIds(next);
    localStorage.setItem(`practiced_${sessionId}`, JSON.stringify(Array.from(next)));
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-white/90 backdrop-blur-sm px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/interview"
              className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-lg font-semibold text-[var(--foreground)] truncate max-w-[60%]">
              {data.sessionTitle}
            </h1>
            <span className="w-16" />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 -mb-px">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`shrink-0 px-4 py-2.5 text-sm font-medium transition border-b-2 ${
                  activeTab === t.id
                    ? "border-[var(--primary)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === "company" && <CompanyIntelTab data={data} />}
        {activeTab === "resume" && <ResumeTab data={data} sessionId={sessionId} />}
        {activeTab === "questions" && (
          <QuestionBankTab
            data={data}
            sessionId={sessionId}
            practicedIds={practicedIds}
            markPracticed={markPracticed}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
          />
        )}
        {activeTab === "study" && <StudyPlanTab data={data} sessionId={sessionId} />}
        {activeTab === "dayof" && <DayOfTab data={data} sessionId={sessionId} />}
      </main>
    </div>
  );
}
