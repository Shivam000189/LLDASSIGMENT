export interface Problem {
  id: string;
  title: string;
  requirements: string[];
  constraints: string[];
  createdAt: string;
  updatedAt: string;
}

export type AttemptStatus = "evaluating" | "completed" | "failed";

export interface Submission {
  code: string;
  language: "TS";
  submittedAt: string;
}

export interface DimensionScore {
  score: number;
  explanation: string;
}

export interface EvaluationResult {
  source: "deterministic" | "llm";
  dimensions: Record<string, DimensionScore>;
  parseError?: string;
}

export interface Feedback {
  deterministic: EvaluationResult;
  llm: EvaluationResult | null;
  usedFallback: boolean;
  overallNotes: string;
}

export interface Attempt {
  id: string;
  problemId: string;
  learnerId: string;
  status: AttemptStatus;
  submission: Submission;
  feedback?: Feedback;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}
