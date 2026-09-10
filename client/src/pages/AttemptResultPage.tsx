import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAttempt } from "../api/client";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import type { Attempt, DimensionScore } from "../types";

function humanizeDimension(key: string): string {
  const map: Record<string, string> = {
    structurePresent: "Structure & Class Declarations",
    entityCoverage: "Domain Entity Coverage",
    statePresent: "State & Enum Modeling",
    responsibilitySpread: "Class Decomposition",
    srp: "Single Responsibility Principle (SRP)",
    coupling: "Coupling & Abstraction",
    extensibility: "Extensibility & Open/Closed",
    naming: "Naming & Readability",
  };
  return (
    map[key] ||
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  );
}

function getScoreColor(score: number): {
  badge: string;
  bar: string;
  border: string;
} {
  if (score >= 0.7) {
    return {
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      bar: "bg-emerald-500",
      border: "border-emerald-200 dark:border-emerald-800/60",
    };
  }
  if (score >= 0.4) {
    return {
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      bar: "bg-amber-500",
      border: "border-amber-200 dark:border-amber-800/60",
    };
  }
  return {
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
    bar: "bg-rose-500",
    border: "border-rose-200 dark:border-rose-800/60",
  };
}

export const AttemptResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<boolean>(false);

  // Polling useEffect logic: polls every 1.5s while status is "evaluating", stops on completed/failed, cleans up on unmount
  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    async function poll() {
      try {
        const data = await getAttempt(id!);
        if (!isMounted) return;

        setAttempt(data);
        setLoading(false);

        // Continue polling only if status is "evaluating"
        if (data.status === "evaluating") {
          timerId = setTimeout(poll, 1500);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load attempt results.");
        setLoading(false);
      }
    }

    setLoading(true);
    setError(null);
    poll();

    return () => {
      isMounted = false;
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [id]);

  if (loading && !attempt) {
    return <LoadingState message="Fetching attempt details..." />;
  }

  if (error || !attempt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState
          title="Error Loading Attempt"
          message={error || "Attempt not found."}
          backTo="/"
          backText="Back to Problem List"
        />
      </div>
    );
  }

  // 1. EVALUATING STATE
  if (attempt.status === "evaluating") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-5">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Evaluating your submission...
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Running deterministic static analysis checks and AI design evaluation. This page updates automatically.
          </p>

          {/* Collapsible Submitted Code Preview */}
          <div className="mt-8 max-w-2xl mx-auto text-left">
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              {showCode ? "Hide Submitted Code" : "Preview Submitted Code"} {showCode ? "▲" : "▼"}
            </button>
            {showCode && (
              <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono overflow-x-auto max-h-60 border border-gray-800">
                <code>{attempt.submission?.code}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. FAILED STATE
  if (attempt.status === "failed") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900/40 shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4 text-xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Evaluation Failed Unexpectedly
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            An unexpected error occurred while processing this attempt. Please try submitting again.
          </p>
          <div className="mt-6">
            <Link
              to={`/problems/${attempt.problemId}`}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Back to Problem &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. COMPLETED STATE
  const feedback = attempt.feedback;
  const deterministicDims = feedback?.deterministic?.dimensions || {};
  const llmDims = feedback?.llm?.dimensions || null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            to={`/problems/${attempt.problemId}`}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            &larr; Back to Problem
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Evaluation Results
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
            <span>Attempt ID: <span className="font-mono">{attempt.id}</span></span>
            <span>&bull;</span>
            <span>Submitted {new Date(attempt.submission?.submittedAt || attempt.createdAt).toLocaleTimeString()}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                attempt.submission?.language === "PY"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
              }`}
            >
              {attempt.submission?.language === "PY" ? "Python" : "TypeScript"}
            </span>
          </p>
        </div>

        <Link
          to={`/problems/${attempt.problemId}`}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
        >
          Submit Another Attempt
        </Link>
      </div>

      {/* Fallback Notice Banner (if usedFallback is true) */}
      {feedback?.usedFallback && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-300 flex items-start gap-3">
          <span className="text-amber-600 dark:text-amber-400 font-bold text-lg mt-0.5">⚠️</span>
          <div>
            <h3 className="text-sm font-semibold">AI Evaluation Fallback</h3>
            <p className="text-xs mt-0.5 leading-relaxed">{feedback.overallNotes}</p>
          </div>
        </div>
      )}

      {/* Overall Summary Card if available */}
      {feedback?.overallNotes && !feedback?.usedFallback && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 text-indigo-950 dark:text-indigo-300 text-sm">
          <span className="font-semibold">Summary: </span>
          {feedback.overallNotes}
        </div>
      )}

      {/* Structural Checks Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Structural Checks (Deterministic)
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">Static rule-based validation</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(deterministicDims).map(([key, dim]: [string, DimensionScore]) => {
            const colors = getScoreColor(dim.score);
            const percentage = Math.round(dim.score * 100);

            return (
              <div
                key={key}
                className={`bg-white dark:bg-gray-800 rounded-xl border ${colors.border} p-5 shadow-sm`}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {humanizeDimension(key)}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
                    {percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full ${colors.bar} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {dim.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Design Feedback Section (Only rendered if feedback.llm is not null) */}
      {llmDims && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>✨</span> AI Design Critique & SOLID Principles
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">Qualitative architecture assessment</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(llmDims).map(([key, dim]: [string, DimensionScore]) => {
              const colors = getScoreColor(dim.score);
              const percentage = Math.round(dim.score * 100);

              return (
                <div
                  key={key}
                  className={`bg-white dark:bg-gray-800 rounded-xl border ${colors.border} p-5 shadow-sm`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                      {humanizeDimension(key)}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${colors.bar} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {dim.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Submitted Code Reference */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Submitted Code
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                attempt.submission?.language === "PY"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
              }`}
            >
              {attempt.submission?.language === "PY" ? "Python" : "TypeScript"}
            </span>
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {showCode ? "Collapse" : "Expand"}
          </button>
        </div>

        {showCode && (
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono overflow-x-auto border border-gray-800">
            <code>{attempt.submission?.code}</code>
          </pre>
        )}
      </section>
    </div>
  );
};
