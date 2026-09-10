import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProblem, createAttempt } from "../api/client";
import { getLearnerId } from "../lib/learner";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import type { Problem } from "../types";

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      const attempt = await createAttempt(problem.id, learnerId, code.trim());
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState
          title="Error Loading Problem"
          message={error || "Problem not found."}
          backTo="/"
          backText="Back to Problem List"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          &larr; All Problems
        </Link>
        <Link
          to={`/problems/${problem.id}/history`}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          View Past Attempts &rarr;
        </Link>
      </div>

      {/* Problem Specification Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {problem.title}
        </h1>

        {/* Requirements */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Requirements
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
            {problem.requirements?.map((req, index) => (
              <li key={index} className="leading-relaxed">
                {req}
              </li>
            ))}
          </ul>
        </section>

        {/* Constraints */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Constraints & Design Principles
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
            {problem.constraints?.map((constraint, index) => (
              <li key={index} className="leading-relaxed">
                {constraint}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Code Submission Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Your TypeScript Solution
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Write class definitions, interfaces, and methods in TypeScript adhering to SOLID principles.
        </p>

        {submitError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your TypeScript solution here&#10;export class Vehicle {&#10;  constructor(public id: string) {}&#10;}&#10;&#10;export class ParkingLot {&#10;  // your design implementation...&#10;}"
              spellCheck={false}
              className="w-full p-4 font-mono text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-y"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Language: <span className="font-semibold">TypeScript (TS)</span>
            </span>

            <button
              type="submit"
              disabled={!code.trim() || submitting}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
