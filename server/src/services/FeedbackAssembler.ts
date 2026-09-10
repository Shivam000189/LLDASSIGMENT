import { Problem, Submission, Feedback, EvaluationResult } from "../types";
import { DeterministicEvaluator } from "../evaluators/DeterministicEvaluator";
import { LLMEvaluator } from "../evaluators/LLMEvaluator";

export class FeedbackAssembler {
  private deterministicEvaluator: DeterministicEvaluator;
  private llmEvaluator: LLMEvaluator;

  constructor(
    deterministicEvaluator?: DeterministicEvaluator,
    llmEvaluator?: LLMEvaluator
  ) {
    this.deterministicEvaluator =
      deterministicEvaluator || new DeterministicEvaluator();
    this.llmEvaluator = llmEvaluator || new LLMEvaluator();
  }

  public async assemble(
    submission: Submission,
    problem: Problem
  ): Promise<Feedback> {
    const [deterministicSettled, llmSettled] = await Promise.allSettled([
      this.deterministicEvaluator.evaluate(submission, problem),
      this.llmEvaluator.evaluate(submission, problem),
    ]);

    const deterministicResult: EvaluationResult =
      deterministicSettled.status === "fulfilled"
        ? deterministicSettled.value
        : {
            source: "deterministic",
            dimensions: {},
            parseError: "Unexpected evaluator failure",
          };

    const usedFallback = llmSettled.status === "rejected";
    const llmResult = llmSettled.status === "fulfilled" ? llmSettled.value : null;

    if (usedFallback && llmSettled.status === "rejected") {
      console.warn(
        "[FeedbackAssembler] LLM evaluation threw error, activating fallback:",
        llmSettled.reason instanceof Error
          ? llmSettled.reason.message
          : llmSettled.reason
      );
    }

    const overallNotes = usedFallback
      ? "AI evaluation unavailable — showing rule-based feedback."
      : "Combined deterministic and AI-assisted feedback.";

    return {
      deterministic: deterministicResult,
      llm: llmResult,
      usedFallback,
      overallNotes,
    };
  }
}

export const feedbackAssembler = new FeedbackAssembler();
