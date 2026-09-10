export type AttemptStatus = "evaluating" | "completed" | "failed";

export type EvaluationSource = "deterministic" | "llm";

export interface Problem {
  id: string;
  title: string;
  requirements: string[];
  constraints: string[];
  expectedEntities: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Submission {
  code: string;
  language: "TS";
  submittedAt: Date;
}

export interface DimensionResult {
  score: number;
  explanation: string;
}

export interface EvaluationResult {
  source: EvaluationSource;
  dimensions: Record<string, DimensionResult>;
  parseError?: string;
}

export interface Feedback {
  deterministic: EvaluationResult;
  llm: EvaluationResult | null;
  usedFallback: boolean;
  overallNotes: string;
}

export interface Attempt {
  id?: string;
  problemId: string;
  learnerId: string;
  status: AttemptStatus;
  submission: Submission;
  feedback?: Feedback;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Evaluator {
  evaluate(submission: Submission, problem: Problem): Promise<EvaluationResult>;
}
