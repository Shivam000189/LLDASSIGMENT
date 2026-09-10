import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProblemListPage } from "./pages/ProblemListPage";
import { ProblemDetailPage } from "./pages/ProblemDetailPage";
import { AttemptHistoryPage } from "./pages/AttemptHistoryPage";
import { AttemptResultPage } from "./pages/AttemptResultPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { getLearnerId } from "./lib/learner";

export const App: React.FC = () => {
  useEffect(() => {
    // Initialize or retrieve learner ID at startup
    getLearnerId();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white flex flex-col antialiased">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ProblemListPage />} />
              <Route path="/problems/:id" element={<ProblemDetailPage />} />
              <Route path="/problems/:id/history" element={<AttemptHistoryPage />} />
              <Route path="/attempts/:id" element={<AttemptResultPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
