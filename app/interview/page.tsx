"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, Loader2, Target, Trash2 } from "lucide-react";
import { getSavedInterviews, saveInterview, deleteInterview } from "@/lib/interviewStorage";

const INTERVIEW_TYPES = [
  "Behavioral / HR",
  "Technical Coding",
  "System Design",
  "Take-home Project",
  "Portfolio Review",
  "Culture Fit",
  "Technical Phone Screen",
  "Pair Programming",
  "Panel Interview",
];

const LOADING_STEPS = [
  "🔍 Researching company...",
  "📋 Analyzing your resume...",
  "🧠 Generating questions...",
  "✅ Building your study plan...",
];

export default function InterviewPage() {
  const router = useRouter();
  const [savedPreps, setSavedPreps] = useState<ReturnType<typeof getSavedInterviews>>([]);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [manualTypes, setManualTypes] = useState<string[]>([]);
  const [typesExpanded, setTypesExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  useEffect(() => {
    setSavedPreps(getSavedInterviews());
  }, []);

  const toggleType = (t: string) => {
    setManualTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleGenerate = async () => {
    if (!companyName || !resume || !jobDescription) return;
    setLoading(true);
    setLoadingStep(LOADING_STEPS[0]);
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_STEPS.length;
      setLoadingStep(LOADING_STEPS[i]);
    }, 2000);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          jobDescription,
          companyName,
          role,
          manualTypes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const saved = saveInterview(data);
      setSavedPreps(getSavedInterviews());
      router.push(`/interview/${saved.id}`);
    } catch (e) {
      clearInterval(interval);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const canSubmit = companyName.trim() && resume.trim() && jobDescription.trim();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-[var(--foreground)]"
          >
            <Target className="h-5 w-5 text-[var(--primary)]" />
            DevPath AI
          </Link>
          {savedPreps.length > 0 && (
            <span className="text-sm text-[var(--muted)]">
              {savedPreps.length} saved
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Interview Prep
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Get personalized prep from your resume and job description.
          </p>
        </div>

        {savedPreps.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Your saved prep kits</h2>
            <ul className="space-y-2">
              {savedPreps.map((prep) => (
                <li
                  key={prep.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3"
                >
                  <Link
                    href={`/interview/${prep.id}`}
                    className="flex-1 min-w-0 group"
                  >
                    <p className="font-medium text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition">
                      {prep.sessionTitle}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {new Date(prep.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm("Delete this prep kit?")) {
                        deleteInterview(prep.id);
                        setSavedPreps(getSavedInterviews());
                      }
                    }}
                    className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] transition"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-black/5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-[var(--foreground)] mb-1"
                  >
                    Company name
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-[var(--foreground)] mb-1"
                  >
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Resume (paste full text)
                </label>
                <textarea
                  id="resume"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume content here..."
                  rows={10}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition resize-y"
                />
                <p className="mt-1 text-xs text-slate-500">{resume.length} characters</p>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="jd"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Job description
                </label>
                <textarea
                  id="jd"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description..."
                  rows={10}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition resize-y"
                />
                <p className="mt-1 text-xs text-slate-500">{jobDescription.length} characters</p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setTypesExpanded(!typesExpanded)}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"
                >
                  Optional: Specify interview types
                  {typesExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {typesExpanded && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {INTERVIEW_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleType(t)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                          manualTypes.includes(t)
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "border border-slate-200 bg-slate-50 text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canSubmit || loading}
                className="mt-8 w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-white font-medium hover:bg-[var(--primary-muted)] disabled:opacity-50 disabled:pointer-events-none transition"
              >
                Generate Prep Kit
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 sticky top-24">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li>• Include your full resume for accurate analysis.</li>
                <li>• Paste the complete job description for better matching.</li>
                <li>• Add interview types if you know the format (e.g. System Design).</li>
                <li>• Results are saved in your browser for later review.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {loading && (
        <div className="fixed inset-0 bg-[var(--background)]/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
          <p className="mt-4 text-sm text-[var(--muted)]">{loadingStep}</p>
        </div>
      )}
    </div>
  );
}
