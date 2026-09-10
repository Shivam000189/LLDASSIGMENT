/// <reference types="jest" />
import { FeedbackAssembler } from "../../services/FeedbackAssembler";
import { DeterministicEvaluator } from "../../evaluators/DeterministicEvaluator";
import { LLMEvaluator } from "../../evaluators/LLMEvaluator";
import { Problem, Submission, EvaluationResult } from "../../types";

describe("FeedbackAssembler", () => {
  const dummyProblem: Problem = {
    id: "parking-lot",
    title: "Parking Lot",
    requirements: ["Requirement 1"],
    constraints: ["Constraint 1"],
    expectedEntities: ["Vehicle", "ParkingSpot"],
  };

  const dummySubmission: Submission = {
    code: "class Vehicle {} class ParkingSpot {}",
    language: "TS",
    submittedAt: new Date(),
  };

  const mockDeterministicResult: EvaluationResult = {
    source: "deterministic",
    dimensions: {
      structurePresent: { score: 1, explanation: "Found class declarations" },
      entityCoverage: { score: 1, explanation: "All entities present" },
      statePresent: { score: 0, explanation: "No enum" },
      responsibilitySpread: { score: 0.67, explanation: "2 classes" },
    },
  };

  const mockLLMResult: EvaluationResult = {
    source: "llm",
    dimensions: {
      srp: { score: 0.85, explanation: "Good SRP" },
      coupling: { score: 0.8, explanation: "Low coupling" },
      extensibility: { score: 0.9, explanation: "High extensibility" },
      naming: { score: 0.95, explanation: "Clear naming" },
    },
  };

  let mockDeterministicEvaluator: jest.Mocked<DeterministicEvaluator>;
  let mockLLMEvaluator: jest.Mocked<LLMEvaluator>;

  beforeEach(() => {
    mockDeterministicEvaluator = {
      evaluate: jest.fn(),
    } as unknown as jest.Mocked<DeterministicEvaluator>;

    mockLLMEvaluator = {
      evaluate: jest.fn(),
    } as unknown as jest.Mocked<LLMEvaluator>;
  });

  it("combines both results when LLM succeeds", async () => {
    mockDeterministicEvaluator.evaluate.mockResolvedValue(mockDeterministicResult);
    mockLLMEvaluator.evaluate.mockResolvedValue(mockLLMResult);

    const assembler = new FeedbackAssembler(
      mockDeterministicEvaluator,
      mockLLMEvaluator
    );

    const feedback = await assembler.assemble(dummySubmission, dummyProblem);

    expect(feedback.usedFallback).toBe(false);
    expect(feedback.deterministic).toEqual(mockDeterministicResult);
    expect(feedback.llm).toEqual(mockLLMResult);
    expect(feedback.overallNotes).toBe(
      "Combined deterministic and AI-assisted feedback."
    );
  });

  it("falls back cleanly when LLM evaluator throws", async () => {
    mockDeterministicEvaluator.evaluate.mockResolvedValue(mockDeterministicResult);
    mockLLMEvaluator.evaluate.mockRejectedValue(
      new Error("Anthropic API rate limit or invalid API key")
    );

    const assembler = new FeedbackAssembler(
      mockDeterministicEvaluator,
      mockLLMEvaluator
    );

    const feedback = await assembler.assemble(dummySubmission, dummyProblem);

    expect(feedback.usedFallback).toBe(true);
    expect(feedback.llm).toBeNull();
    expect(feedback.deterministic).toEqual(mockDeterministicResult);
    expect(feedback.overallNotes).toBe(
      "AI evaluation unavailable — showing rule-based feedback."
    );
  });

  it("still returns deterministic result even if DeterministicEvaluator itself throws unexpectedly", async () => {
    mockDeterministicEvaluator.evaluate.mockRejectedValue(
      new Error("Critical unexpected parser crash")
    );
    mockLLMEvaluator.evaluate.mockResolvedValue(mockLLMResult);

    const assembler = new FeedbackAssembler(
      mockDeterministicEvaluator,
      mockLLMEvaluator
    );

    const feedback = await assembler.assemble(dummySubmission, dummyProblem);

    expect(feedback).toBeDefined();
    expect(feedback.deterministic).toBeDefined();
    expect(feedback.deterministic.source).toBe("deterministic");
    expect(feedback.deterministic.parseError).toBe("Unexpected evaluator failure");
    expect(feedback.llm).toEqual(mockLLMResult);
  });
});
