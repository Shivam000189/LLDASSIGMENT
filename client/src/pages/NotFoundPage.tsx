import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Return Home &rarr;
        </Link>
      </div>
    </div>
  );
};
