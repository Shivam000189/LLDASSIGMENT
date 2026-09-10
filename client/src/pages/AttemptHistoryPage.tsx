import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAttemptHistory, getProblem } from "../api/client";
import { getLearnerId } from "../lib/learner";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import type { Attempt, Problem } from "../types";

function calculateAverageScore(dimensions?: Record<string, { score: number }>): number | null {
  if (!dimensions) return null;
  const values = Object.values(dimensions);
  if (values.length === 0) return null;
  const sum = values.reduce((acc, curr) => acc + (typeof curr.score === "number" ? curr.score : 0), 0);
  return Math.round((sum / values.length) * 100);
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export const AttemptHistoryPage: React.FC = () => {
  const { id: problemId } = useParams<{ id: string }>();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId) return;
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const learnerId = getLearnerId();
        const [historyData, problemData] = await Promise.allSettled([
          getAttemptHistory(problemId!, learnerId),
          getProblem(problemId!),
        ]);

        if (!isMounted) return;

        if (historyData.status === "fulfilled") {
          setAttempts(historyData.value);
        } else {
          throw historyData.reason;
        }

        if (problemData.status === "fulfilled") {
          setProblem(problemData.value);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load attempt history.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [problemId]);

  if (loading) {
    return <LoadingState message="Loading attempt history..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState
          title="Error Loading History"
          message={error}
          backTo={`/problems/${problemId}`}
          backText="Back to Problem"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/problems/${problemId}`}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          &larr; Back to Problem
        </Link>
        <Link
          to={`/problems/${problemId}`}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
        >
          New Attempt &rarr;
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Attempt History
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {problem ? `Track your iterative progress for "${problem.title}".` : "Track your previous submissions and evaluations."}
        </p>
      </div>

      {/* Empty State */}
      {attempts.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-4xl mb-3">📝</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            No attempts yet
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            Be the first to try this problem! Submit your design to receive detailed structural and AI feedback.
          </p>
          <div className="mt-6">
            <Link
              to={`/problems/${problemId}`}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Start Attempt &rarr;
            </Link>
          </div>
        </div>
      ) : (
        /* Attempts List */
        <div className="space-y-4">
          {attempts.map((attempt, index) => {
            const detAvg = calculateAverageScore(attempt.feedback?.deterministic?.dimensions);
            const llmAvg = calculateAverageScore(attempt.feedback?.llm?.dimensions);

            const statusColors: Record<string, string> = {
              completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
              evaluating: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 animate-pulse",
              failed: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
            };

            return (
              <div
                key={attempt.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">
                      #{attempts.length - index}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                        statusColors[attempt.status] || "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {attempt.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(attempt.submission?.submittedAt || attempt.createdAt)}
                    </span>
                  </div>

                  {/* Score Breakdown Pills (if completed) */}
                  {attempt.status === "completed" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {detAvg !== null && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          <span className="text-gray-500 dark:text-gray-400">Structural:</span>
                          <span className={`font-bold ${detAvg >= 70 ? "text-emerald-600 dark:text-emerald-400" : detAvg >= 40 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {detAvg}%
                          </span>
                        </span>
                      )}

                      {llmAvg !== null && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          <span className="text-gray-500 dark:text-gray-400">AI Design:</span>
                          <span className={`font-bold ${llmAvg >= 70 ? "text-emerald-600 dark:text-emerald-400" : llmAvg >= 40 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {llmAvg}%
                          </span>
                        </span>
                      )}

                      {attempt.feedback?.usedFallback && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                          Fallback Used
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="sm:self-center">
                  <Link
                    to={`/attempts/${attempt.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
