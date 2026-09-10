import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getLearnerId } from "../lib/learner";

export const Nav: React.FC = () => {
  const learnerId = getLearnerId();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(learnerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Site Name (No logo icon, just clean name in white) */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-white hover:opacity-90 transition focus:outline-none flex items-center gap-1"
        >
          <span>LLSOLVE</span>
        </Link>

        {/* User ID on the right */}
        <div className="flex items-center">
          <button
            onClick={handleCopyId}
            title="Click to copy Learner ID"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-[#111115] text-white/90 border border-white/20 hover:border-white/40 hover:bg-[#1a1a20] transition-colors shadow-xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-white/50">Learner ID:</span>
            <span className="text-white font-semibold">{learnerId.slice(0, 12)}...</span>
            <span className="text-[11px] text-white/80 font-sans ml-1">
              {copied ? "✓ Copied" : "📋"}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
