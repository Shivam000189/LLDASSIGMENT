import React from "react";
import { Link } from "react-router-dom";

interface ErrorStateProps {
  title?: string;
  message: string;
  backTo?: string;
  backText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Error Loading Content",
  message,
  backTo,
  backText = "Back to Safety",
}) => {
  return (
    <div className="max-w-4xl mx-auto py-10">
      {backTo && (
        <Link
          to={backTo}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-flex items-center gap-1"
        >
          &larr; {backText}
        </Link>
      )}
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 shadow-sm">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm mt-1 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
