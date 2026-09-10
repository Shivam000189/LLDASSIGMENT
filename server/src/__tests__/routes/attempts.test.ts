/// <reference types="jest" />
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app";
import { ProblemModel } from "../../models/Problem";
import { AttemptModel } from "../../models/Attempt";
import { LLMEvaluator } from "../../evaluators/LLMEvaluator";
import { problems } from "../../seed/problems";
import { EvaluationResult } from "../../types";

describe("POST and GET /api/attempts route", () => {
  let mongoServer: MongoMemoryServer;
  let llmSpy: jest.SpyInstance;

  const mockLLMResult: EvaluationResult = {
    source: "llm",
    dimensions: {
      srp: { score: 0.9, explanation: "Well decoupled" },
      coupling: { score: 0.85, explanation: "Clean abstraction" },
      extensibility: { score: 0.95, explanation: "Highly extensible" },
      naming: { score: 0.9, explanation: "Standard naming" },
    },
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await ProblemModel.deleteMany({});
    await AttemptModel.deleteMany({});

    // Seed problems into test in-memory database
    for (const p of problems) {
      await ProblemModel.create({
        _id: p.id,
        title: p.title,
        requirements: p.requirements,
        constraints: p.constraints,
        expectedEntities: p.expectedEntities,
      });
    }

    // Mock LLM call so tests don't make real network requests
    llmSpy = jest
      .spyOn(LLMEvaluator.prototype, "evaluate")
      .mockResolvedValue(mockLLMResult);
  });

  afterEach(() => {
    llmSpy.mockRestore();
  });

  it("returns 202 immediately with status evaluating", async () => {
    const res = await request(app)
      .post("/api/attempts")
      .send({
        problemId: "parking-lot",
        learnerId: "learner-test-1",
        code: `
          export enum VehicleType { CAR }
          export class Vehicle { constructor(public type: VehicleType) {} }
          export class ParkingSpot { constructor(public id: string) {} }
          export class Ticket { constructor(public id: string) {} }
          export class ParkingLot { private spots: ParkingSpot[] = []; }
        `,
      });

    expect(res.status).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.status).toBe("evaluating");
    expect(res.body.data.problemId).toBe("parking-lot");
    expect(res.body.data.learnerId).toBe("learner-test-1");
  });

  it("rejects missing problemId with 400", async () => {
    const res = await request(app)
      .post("/api/attempts")
      .send({
        learnerId: "learner-test-1",
        code: "export class Test {}",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("problemId is required");
  });

  it("rejects empty code with 400", async () => {
    const res = await request(app)
      .post("/api/attempts")
      .send({
        problemId: "parking-lot",
        learnerId: "learner-test-1",
        code: "",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("code is required");
  });

  it("rejects unknown problemId with 400 or 404", async () => {
    const res = await request(app)
      .post("/api/attempts")
      .send({
        problemId: "unknown-problem-id",
        learnerId: "learner-test-1",
        code: "export class Test {}",
      });

    expect([400, 404]).toContain(res.status);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("not found");
  });

  it("GET /api/attempts/:id eventually reflects completed status", async () => {
    const createRes = await request(app)
      .post("/api/attempts")
      .send({
        problemId: "parking-lot",
        learnerId: "learner-test-1",
        code: `
          export enum VehicleType { CAR }
          export class Vehicle { constructor(public type: VehicleType) {} }
          export class ParkingSpot { constructor(public id: string) {} }
          export class Ticket { constructor(public id: string) {} }
          export class ParkingLot { private spots: ParkingSpot[] = []; }
        `,
      });

    expect(createRes.status).toBe(202);
    const attemptId = createRes.body.data.id;
    expect(attemptId).toBeDefined();

    // Poll until status is no longer "evaluating" (max ~5 seconds)
    const startTime = Date.now();
    let completedAttempt = null;

    while (Date.now() - startTime < 5000) {
      const getRes = await request(app).get(`/api/attempts/${attemptId}`);
      expect(getRes.status).toBe(200);

      if (getRes.body.data.status !== "evaluating") {
        completedAttempt = getRes.body.data;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    expect(completedAttempt).not.toBeNull();
    expect(completedAttempt.status).toBe("completed");
    expect(completedAttempt.feedback).toBeDefined();
    expect(completedAttempt.feedback.deterministic).toBeDefined();
    expect(
      completedAttempt.feedback.deterministic.dimensions.structurePresent.score
    ).toBe(1);
    expect(
      completedAttempt.feedback.deterministic.dimensions.entityCoverage.score
    ).toBe(1);
    expect(
      completedAttempt.feedback.deterministic.dimensions.statePresent.score
    ).toBe(1);
    expect(completedAttempt.feedback.llm).toEqual(mockLLMResult);
    expect(completedAttempt.feedback.usedFallback).toBe(false);
  });
});
