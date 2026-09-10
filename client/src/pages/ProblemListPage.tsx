import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProblems } from "../api/client";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import type { Problem } from "../types";

export const ProblemListPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchProblems() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProblems();
        if (isMounted) {
          setProblems(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load problems.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProblems();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Low-Level Design Practice Problems
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Select a design problem to practice writing clean, extensible object-oriented TypeScript solutions.
        </p>
      </header>

      {loading && <LoadingState message="Loading practice problems..." />}

      {error && !loading && (
        <ErrorState
          title="Error Loading Problems"
          message={error}
        />
      )}

      {!loading && !error && problems.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No practice problems available yet.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Make sure the database is seeded by running <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">npm run seed</code> on the server.
          </p>
        </div>
      )}

      {!loading && !error && problems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => {
            const firstReq = problem.requirements?.[0] || "No description provided.";
            const teaser = firstReq.length > 100 ? `${firstReq.slice(0, 100)}...` : firstReq;

            return (
              <div
                key={problem.id}
                onClick={() => navigate(`/problems/${problem.id}`)}
                className="group flex flex-col justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 transition cursor-pointer"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {problem.title}
                  </h2>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {teaser}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center px-2 py-0.5 rounded font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {problem.requirements?.length || 0} Requirements
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {problem.constraints?.length || 0} Constraints
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex justify-end">
                  <Link
                    to={`/problems/${problem.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    Practice &rarr;
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
