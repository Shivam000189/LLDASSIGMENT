import React from "react";
import { Link } from "react-router-dom";
import { getLearnerId } from "../lib/learner";

export const Nav: React.FC = () => {
  const learnerId = getLearnerId();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
            LLD
          </span>
          <span>LLD Practice Platform</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Learner ID:</span>
          <span className="font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {learnerId}
          </span>
        </div>
      </div>
    </header>
  );
};
