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
    <div className="max-w-6xl mx-auto px-4 py-10 bg-black text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white">
          Low-Level Design Practice Problems
        </h1>
        <p className="mt-2 text-base text-neutral-400">
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
        <div className="text-center py-16 bg-[#0d0d12] rounded-2xl border border-white/15 p-8">
          <p className="text-white text-lg">No practice problems available yet.</p>
          <p className="text-sm text-neutral-500 mt-1">
            Make sure the database is seeded by running <code className="bg-black px-1.5 py-0.5 rounded text-white">npm run seed</code> on the server.
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
                className="group flex flex-col justify-between bg-[#0d0d12] rounded-2xl border border-white/15 p-6 shadow-md hover:border-white/40 transition cursor-pointer"
              >
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-neutral-200 transition">
                    {problem.title}
                  </h2>
                  <p className="mt-3 text-sm text-neutral-400 line-clamp-2">
                    {teaser}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-[#16161f] text-white border border-white/15">
                      {problem.requirements?.length || 0} Requirements
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-[#16161f] text-white border border-white/15">
                      {problem.constraints?.length || 0} Constraints
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                  <Link
                    to={`/problems/${problem.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center px-5 py-2 text-xs font-black rounded-xl text-black bg-white hover:bg-neutral-200 transition shadow-sm"
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
