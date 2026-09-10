import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LLD_CODE_SAMPLES, type CodeSample } from "../data";

export const LandingPage: React.FC = () => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [activeLine, setActiveLine] = useState<number>(13);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solveState, setSolveState] = useState<"idle" | "evaluating" | "solved">("idle");
  const [showTestRunner, setShowTestRunner] = useState<boolean>(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const currentSample: CodeSample = LLD_CODE_SAMPLES[selectedSampleIndex];

  // Handle the interactive "Solve" button click
  const handleInteractiveSolve = () => {
    if (isSolving) return;
    setIsSolving(true);
    setSolveState("evaluating");
    setShowTestRunner(true);

    // Simulate animated AST evaluation and test run
    setTimeout(() => {
      setSolveState("solved");
      setIsSolving(false);
    }, 1800);
  };

  const handleCopyCode = () => {
    const rawCode = currentSample.lines
      .map((l) => l.tokens.map((t) => t.text).join(""))
      .join("");
    navigator.clipboard.writeText(rawCode);
    setCopyFeedback("Code Copied!");
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white transition-colors duration-300">
      {/* Background Subtle Radial Auras */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-white"></div>
      <div className="absolute top-1/3 right-5 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ------------------------------------------------------------- */}
          {/* LEFT COLUMN: Hero Copy & Value Proposition                    */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            
            {/* Pill Badge with pulse dot */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111116] border border-white/20 text-white text-xs sm:text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span>AI-Powered Low-Level Design Platform</span>
              <span className="bg-[#1f1f28] text-[11px] px-2 py-0.5 rounded-full text-white/90 border border-white/15 font-bold ml-1">
                v2.4
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] mb-6">
              Learn LLD for<br />
              Better <span className="relative inline-block text-white underline decoration-white/40 decoration-wavy underline-offset-8">
                Coder
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl mb-8">
              Empowering developers with an AI-integrated coding ecosystem.
              Master Object-Oriented Design, SOLID principles, and architectural patterns in TypeScript with instant test execution and real-time evaluation.
            </p>

            {/* Interactive Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto">
              {/* Interactive "Solve" Button */}
              <button
                id="hero-solve-btn"
                onClick={handleInteractiveSolve}
                disabled={isSolving}
                className={`relative group overflow-hidden px-8 py-4 rounded-xl font-black transition-all duration-300 transform active:scale-95 flex items-center gap-3 cursor-pointer ${
                  solveState === "solved"
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                    : "bg-white text-black shadow-lg shadow-white/10 hover:bg-neutral-200 hover:-translate-y-0.5"
                }`}
              >
                {isSolving ? (
                  <>
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-black animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span>Evaluating AST...</span>
                  </>
                ) : solveState === "solved" ? (
                  <>
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All Tests Solved!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Solve in IDE</span>
                  </>
                )}
              </button>

              {/* "Get Started / Practice" Secondary Button */}
              <Link
                to="/problems"
                className="px-7 py-4 rounded-xl font-bold text-white bg-[#111116] hover:bg-[#1a1a22] border border-white/20 hover:border-white/50 shadow-sm transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Explore Problems</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-white/10 w-full max-w-lg">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#111116] border border-white/15 flex items-center justify-center text-xl text-white shadow-xs">
                  📚
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">50+</div>
                  <div className="text-xs font-medium text-neutral-400">LLD Patterns</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#111116] border border-white/15 flex items-center justify-center text-xl text-white shadow-xs">
                  ⚡
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">&lt; 200ms</div>
                  <div className="text-xs font-medium text-neutral-400">AI Evaluation</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#111116] border border-white/15 flex items-center justify-center text-xl text-white shadow-xs">
                  👥
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">12K+</div>
                  <div className="text-xs font-medium text-neutral-400">Learners</div>
                </div>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: Interactive TypeScript Code IDE & Floating HUD  */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-6 relative">
            
            {/* Floating Card 1: 95% Completion Rate Badge (Top Left) */}
            <div className="absolute -top-7 -left-4 sm:-left-6 z-20 bg-[#111116]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/80 border border-white/20 flex items-center gap-3.5 animate-float-slow">
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-neutral-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-white"
                    strokeDasharray="95, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-white">95%</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Architecture Mastery</h4>
                <p className="text-[11px] text-neutral-400 font-medium">95% Completion Rate</p>
              </div>
            </div>

            {/* Floating Card 2: Code Compiled & Verified (Top Right) */}
            <div className="absolute -top-6 -right-2 sm:-right-6 z-20 bg-[#111116]/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-black/80 border border-white/20 flex items-center gap-3 animate-float-reverse">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-base font-bold shadow-xs">
                ✓
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">SOLID Verified</h5>
                <p className="text-[10px] text-emerald-400 font-semibold">Strategy & Factory Clean</p>
              </div>
            </div>

            {/* Floating Card 3: AI Assistant & Concurrency Check (Bottom Left) */}
            <div className="absolute -bottom-7 -left-3 sm:-left-6 z-20 bg-[#111116]/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl shadow-black/80 border border-white/20 flex items-center gap-3 animate-float-reverse">
              <div className="w-9 h-9 rounded-xl bg-black border border-white/20 text-white flex items-center justify-center text-base shadow-xs">
                🤖
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">AI Design Analysis</h5>
                <p className="text-[10px] text-neutral-400 font-medium">Zero Race Conditions • Thread-Safe</p>
              </div>
            </div>

            {/* Floating Card 4: AI Path Suggestion (Bottom Right) */}
            <div className="hidden sm:flex absolute -bottom-8 -right-4 z-20 bg-[#111116]/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl shadow-black/80 border border-white/20 items-center gap-3 animate-float-slow">
              <div className="w-9 h-9 rounded-xl bg-black border border-white/20 text-white flex items-center justify-center text-base shadow-xs">
                🚀
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Personalized LLD Path</h5>
                <p className="text-[10px] text-neutral-400">Next: Rate Limiter & LRU Cache</p>
              </div>
            </div>

            {/* ========================================================= */}
            {/* THE CODE IDE CONTAINER                                    */}
            {/* ========================================================= */}
            <div className="relative rounded-2xl bg-[#08080c] border border-white/20 shadow-2xl shadow-black overflow-hidden text-white">
              
              {/* IDE Header Bar */}
              <div className="bg-[#111116] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                
                {/* Traffic lights + file tabs */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#febc2e] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#28c840] inline-block"></span>
                  </div>

                  {/* Code File Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {LLD_CODE_SAMPLES.map((sample, idx) => (
                      <button
                        key={sample.id}
                        onClick={() => {
                          setSelectedSampleIndex(idx);
                          setSolveState("idle");
                        }}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          selectedSampleIndex === idx
                            ? "bg-[#08080c] text-white border-t-2 border-white font-bold shadow-xs"
                            : "text-neutral-400 hover:text-white hover:bg-[#1a1a22]"
                        }`}
                      >
                        <span className="text-[10px] text-blue-400 font-bold">TS</span>
                        <span>{sample.filename}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Header Action: Copy / Run */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="text-xs px-2.5 py-1 rounded text-neutral-400 hover:text-white hover:bg-[#1a1a22] transition"
                    title="Copy TypeScript snippet"
                  >
                    {copyFeedback || "Copy"}
                  </button>
                  <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1c24] text-neutral-300 border border-white/10">
                    TypeScript 5.4
                  </span>
                </div>
              </div>

              {/* IDE Body: Syntax Highlighted TypeScript Lines */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed custom-code-scroll overflow-x-auto max-h-[380px] sm:max-h-[420px]">
                {currentSample.lines.map((line) => {
                  const isCurrentActive = line.num === activeLine;
                  return (
                    <div
                      key={line.num}
                      onClick={() => setActiveLine(line.num)}
                      className={`group flex items-start rounded px-2 py-0.5 transition-colors cursor-pointer ${
                        isCurrentActive
                          ? "bg-white/[0.08] border-l-2 border-white -ml-0.5"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Line Number */}
                      <span className="w-8 select-none text-right pr-4 text-neutral-600 group-hover:text-neutral-400 font-mono text-xs">
                        {line.num}
                      </span>

                      {/* Line Tokens */}
                      <span className="flex-1 whitespace-pre">
                        {line.tokens.map((token, tIdx) => (
                          <span
                            key={tIdx}
                            className={
                              token.type === "keyword"
                                ? "token-keyword"
                                : token.type === "type"
                                ? "token-type"
                                : token.type === "function"
                                ? "token-function"
                                : token.type === "string"
                                ? "token-string"
                                : token.type === "variable"
                                ? "token-variable"
                                : token.type === "number"
                                ? "token-number"
                                : token.type === "comment"
                                ? "token-comment"
                                : token.type === "operator"
                                ? "token-operator"
                                : token.type === "property"
                                ? "token-property"
                                : "token-punctuation"
                            }
                          >
                            {token.text}
                          </span>
                        ))}
                        {line.num === currentSample.lines.length && (
                          <span className="inline-block w-2 h-4 bg-white animate-cursor-blink ml-1 align-middle"></span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Test Runner Panel */}
              {showTestRunner && (
                <div className="border-t border-white/10 bg-[#0d0d12] px-4 py-3 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="font-semibold text-white font-mono">
                        Test Suite: {currentSample.problemTitle}
                      </span>
                      <span className="text-[10px] text-neutral-300 bg-[#1c1c24] px-2 py-0.5 rounded border border-white/10">
                        {currentSample.pattern}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {solveState === "evaluating"
                        ? "Evaluating AST & Concurrency..."
                        : `${currentSample.testCasesCount}/${currentSample.testCasesCount} Passed (100%)`}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    {currentSample.testCases.slice(0, 3).map((test, tIdx) => (
                      <div key={tIdx} className="flex items-center justify-between text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{test.name}</span>
                        </span>
                        <span className="text-neutral-500">{test.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">
                      Ready to write your own solution?
                    </span>
                    <Link
                      to={`/problems/${currentSample.id === "parking-lot" ? "parking-lot" : "vending-machine"}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
                    >
                      <span>Open in Sandbox</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED LOW-LEVEL DESIGN PROBLEMS (Practice Catalog)                     */}
      {/* ========================================================================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111116] text-white border border-white/20 text-xs font-bold uppercase tracking-wider mb-3">
            Real Interview Challenges
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Featured Low-Level Design Problems
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            Master OOP architecture by implementing extensible TypeScript solutions evaluated instantly by our AI AST engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Problem Card 1: Parking Lot */}
          <div className="bg-[#0d0d12] rounded-2xl p-6 border border-white/15 hover:border-white/40 shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-black">
                  Medium
                </span>
                <span className="text-xs text-neutral-400 font-mono">Strategy Pattern</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-neutral-200 transition">
                Parking Lot System
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Design a multi-level parking lot supporting motorcycle, car, and truck spots with dynamic hourly fee strategies and concurrency locks.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Vehicle", "ParkingSpot", "PricingStrategy", "Ticket"].map((e) => (
                  <span key={e} className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#16161f] text-neutral-300 border border-white/10">
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-white">5 Test Suites</span>
              <Link
                to="/problems/parking-lot"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition shadow-xs"
              >
                Solve Problem &rarr;
              </Link>
            </div>
          </div>

          {/* Problem Card 2: Vending Machine */}
          <div className="bg-[#0d0d12] rounded-2xl p-6 border border-white/15 hover:border-white/40 shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-black">
                  Medium
                </span>
                <span className="text-xs text-neutral-400 font-mono">State Pattern</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-neutral-200 transition">
                Vending Machine
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Model item inventory, multi-denomination currency handling, change dispensing, and transaction cancellation using the State Pattern.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Item", "Inventory", "VendingMachineState", "Coin"].map((e) => (
                  <span key={e} className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#16161f] text-neutral-300 border border-white/10">
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-white">6 Test Suites</span>
              <Link
                to="/problems/vending-machine"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition shadow-xs"
              >
                Solve Problem &rarr;
              </Link>
            </div>
          </div>

          {/* Problem Card 3: Token Bucket Rate Limiter */}
          <div className="bg-[#0d0d12] rounded-2xl p-6 border border-white/15 hover:border-white/40 shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-black">
                  Hard
                </span>
                <span className="text-xs text-neutral-400 font-mono">Token Bucket</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-neutral-200 transition">
                Distributed Rate Limiter
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Implement a concurrency-safe rate limiter handling sudden burst traffic with precision refill algorithms and per-tenant partitioning.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["TokenBucket", "LeakyBucket", "RateLimiterStrategy"].map((e) => (
                  <span key={e} className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#16161f] text-neutral-300 border border-white/10">
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-white">4 Test Suites</span>
              <Link
                to="/problems"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition shadow-xs"
              >
                Explore Problem &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
          >
            <span>View all 50+ Low-Level Design practice problems</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW LLSOLVE EVALUATION ENGINE WORKS                                       */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How LLSOLVE Evaluates Your Code
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            Unlike simple coding platforms that only check output values, LLSOLVE analyzes your actual software architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#0d0d12] p-6 rounded-2xl border border-white/15 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white text-black font-black text-lg flex items-center justify-center mb-4">
              01
            </div>
            <h4 className="text-lg font-bold text-white mb-2">AST Parsing</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We extract TypeScript Abstract Syntax Trees to verify expected entity classes, inheritance hierarchies, and interfaces.
            </p>
          </div>

          <div className="bg-[#0d0d12] p-6 rounded-2xl border border-white/15 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white text-black font-black text-lg flex items-center justify-center mb-4">
              02
            </div>
            <h4 className="text-lg font-bold text-white mb-2">SOLID Verification</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Check separation of concerns, dependency inversion, and extensibility without modifying core classes.
            </p>
          </div>

          <div className="bg-[#0d0d12] p-6 rounded-2xl border border-white/15 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white text-black font-black text-lg flex items-center justify-center mb-4">
              03
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Automated Tests</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Execute sandboxed behavioral unit tests verifying edge cases, state transitions, and concurrency locks.
            </p>
          </div>

          <div className="bg-[#0d0d12] p-6 rounded-2xl border border-white/15 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white text-black font-black text-lg flex items-center justify-center mb-4">
              04
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Qualitative AI</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Receive actionable design feedback highlighting design patterns, code smells, and scaling bottlenecks.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CALL TO ACTION BANNER                                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-[#0d0d12] border border-white/20 p-8 sm:p-12 text-white shadow-2xl shadow-black">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Ready to Master Low-Level Design?
            </h3>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
              Join thousands of developers leveling up their system architecture skills with real-time feedback and structured challenges.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/problems"
                className="px-8 py-3.5 rounded-xl font-black bg-white text-black hover:bg-neutral-200 shadow-md transition transform active:scale-95"
              >
                Browse All Problems
              </Link>
              <Link
                to="/problems/parking-lot"
                className="px-8 py-3.5 rounded-xl font-bold bg-[#171720] hover:bg-[#20202c] text-white border border-white/20 transition"
              >
                Solve Parking Lot &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/10 py-10 text-center text-xs text-neutral-500 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-white text-sm">
            <span>LLSOLVE</span>
          </div>
          <p>© {new Date().getFullYear()} LLSOLVE. Built for engineers mastering Low-Level Design & System Architecture.</p>
          <div className="flex gap-4 font-medium text-neutral-400">
            <Link to="/problems" className="hover:text-white">Problems</Link>
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <Link to="/problems/parking-lot" className="hover:text-white">Sandbox</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
