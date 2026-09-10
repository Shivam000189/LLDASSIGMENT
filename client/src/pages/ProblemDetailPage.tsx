import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProblem, createAttempt } from "../api/client";
import { getLearnerId } from "../lib/learner";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import type { Problem } from "../types";

const TS_PLACEHOLDER = `// Write your TypeScript solution here
export class Vehicle {
  constructor(public id: string) {}
}

export class ParkingLot {
  // your design implementation...
}`;

const PY_PLACEHOLDER = `# Write your Python solution here
from enum import Enum

class Vehicle:
    def __init__(self, id: str):
        self.id = id

class ParkingLot:
    # your design implementation...`;

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [language, setLanguage] = useState<"TS" | "PY">("TS");
  const [code, setCode] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProblemDetail() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getProblem(id);
        if (isMounted) {
          setProblem(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load problem details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProblemDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || !code.trim() || submitting) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      const learnerId = getLearnerId();
      const attempt = await createAttempt(problem.id, learnerId, code.trim(), language);
      navigate(`/attempts/${attempt.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit attempt for evaluation.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading problem details..." />;
  }

  if (error || !problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 bg-black text-white">
        <ErrorState
          title="Error Loading Problem"
          message={error || "Problem not found."}
          backTo="/problems"
          backText="Back to Problem List"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-black text-white">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/problems"
          className="text-sm font-semibold text-white hover:underline flex items-center gap-1"
        >
          &larr; All Problems
        </Link>
        <Link
          to={`/problems/${problem.id}/history`}
          className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-white/20 bg-[#111116] text-white hover:border-white/40 transition"
        >
          View Past Attempts &rarr;
        </Link>
      </div>

      {/* Problem Specification Card */}
      <div className="bg-[#0d0d12] rounded-2xl border border-white/15 p-6 shadow-md mb-8">
        <h1 className="text-2xl font-black text-white mb-6">
          {problem.title}
        </h1>

        {/* Requirements */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Requirements
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-neutral-300">
            {problem.requirements?.map((req, index) => (
              <li key={index} className="leading-relaxed">
                {req}
              </li>
            ))}
          </ul>
        </section>

        {/* Constraints */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Constraints & Design Principles
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-neutral-300">
            {problem.constraints?.map((constraint, index) => (
              <li key={index} className="leading-relaxed">
                {constraint}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Code Submission Area */}
      <div className="bg-[#0d0d12] rounded-2xl border border-white/15 p-6 shadow-md">
        
        {/* Language Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">
              Your {language === "TS" ? "TypeScript" : "Python"} Solution
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === "TS"
                ? "Write class definitions, interfaces, and types adhering to clean OOP principles."
                : "Write Python classes, Enums, and methods adhering to clean Pythonic OOP principles."}
            </p>
          </div>

          {/* Language Toggle */}
          <div className="inline-flex p-1 bg-[#16161f] rounded-xl border border-white/15 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setLanguage("TS")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === "TS"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              TypeScript (TS)
            </button>
            <button
              type="button"
              onClick={() => setLanguage("PY")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === "PY"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Python (PY)
            </button>
          </div>
        </div>

        {submitError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={language === "TS" ? TS_PLACEHOLDER : PY_PLACEHOLDER}
              spellCheck={false}
              className="w-full p-4 font-mono text-sm rounded-xl border border-white/15 bg-[#07070a] text-white focus:ring-2 focus:ring-white focus:outline-none transition resize-y"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-mono">
              Selected: <span className="font-bold text-white">{language === "TS" ? "TypeScript (.ts)" : "Python (.py)"}</span>
            </span>

            <button
              type="submit"
              disabled={!code.trim() || submitting}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-black rounded-xl text-black bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-white/10 cursor-pointer"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting for Evaluation...
                </>
              ) : (
                "Submit for Evaluation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
