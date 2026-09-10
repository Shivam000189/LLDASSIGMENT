import { AttemptModel, IAttemptDocument } from "../models/Attempt";
import { feedbackAssembler } from "./FeedbackAssembler";
import { Problem, Submission, AttemptStatus } from "../types";

export class AttemptService {
  public async createPending(
    problemId: string,
    learnerId: string,
    code: string
  ): Promise<IAttemptDocument> {
    const submission: Submission = {
      code,
      language: "TS",
      submittedAt: new Date(),
    };

    const attempt = new AttemptModel({
      problemId,
      learnerId,
      status: "evaluating" as AttemptStatus,
      submission,
    });

    return attempt.save();
  }

  public async runEvaluationAndUpdate(
    attemptId: string,
    problem: Problem
  ): Promise<IAttemptDocument | null> {
    const attempt = await AttemptModel.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID "${attemptId}" not found for evaluation.`);
    }

    const feedback = await feedbackAssembler.assemble(attempt.submission, problem);

    attempt.feedback = feedback;
    attempt.status = "completed";
    return attempt.save();
  }

  public async markFailed(attemptId: string): Promise<void> {
    await AttemptModel.findByIdAndUpdate(attemptId, {
      status: "failed" as AttemptStatus,
    });
  }

  public async getAttemptById(id: string): Promise<IAttemptDocument | null> {
    return AttemptModel.findById(id);
  }

  public async getAttempts(
    problemId?: string,
    learnerId?: string
  ): Promise<IAttemptDocument[]> {
    const query: Record<string, string> = {};
    if (problemId) query.problemId = problemId;
    if (learnerId) query.learnerId = learnerId;

    return AttemptModel.find(query).sort({ createdAt: -1 });
  }
}

export const attemptService = new AttemptService();
