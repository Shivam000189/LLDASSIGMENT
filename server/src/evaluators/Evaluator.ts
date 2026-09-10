import { Submission, Problem, EvaluationResult } from "../types";

export interface Evaluator {
  evaluate(submission: Submission, problem: Problem): Promise<EvaluationResult>;
}
