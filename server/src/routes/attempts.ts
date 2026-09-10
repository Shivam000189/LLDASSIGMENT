import { Router, Request, Response, NextFunction } from "express";
import { attemptService } from "../services/AttemptService";
import { ProblemModel } from "../models/Problem";

const router = Router();

// POST /api/attempts - Create attempt, respond immediately with 202, run evaluation in background
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problemId, learnerId, code } = req.body;

    // Validation: required fields
    if (!problemId || typeof problemId !== "string" || !problemId.trim()) {
      res.status(400).json({
        success: false,
        message: "problemId is required and must be a non-empty string.",
      });
      return;
    }

    if (!learnerId || typeof learnerId !== "string" || !learnerId.trim()) {
      res.status(400).json({
        success: false,
        message: "learnerId is required and must be a non-empty string.",
      });
      return;
    }

    if (!code || typeof code !== "string" || !code.trim()) {
      res.status(400).json({
        success: false,
        message: "code is required and must be a non-empty string.",
      });
      return;
    }

    // Validation: verify problem exists
    const problemDoc = await ProblemModel.findById(problemId.trim());
    if (!problemDoc) {
      res.status(404).json({
        success: false,
        message: `Problem with ID '${problemId}' not found.`,
      });
      return;
    }

    const problem = {
      id: problemDoc._id,
      title: problemDoc.title,
      requirements: problemDoc.requirements,
      constraints: problemDoc.constraints,
      expectedEntities: problemDoc.expectedEntities,
    };

    // 1. Create Attempt with status 'evaluating'
    const attempt = await attemptService.createPending(
      problemId.trim(),
      learnerId.trim(),
      code.trim()
    );

    // 2. Respond immediately with 202 and pending attempt
    res.status(202).json({
      success: true,
      data: attempt,
    });

    // 3. Fire-and-forget evaluation in background
    attemptService
      .runEvaluationAndUpdate(attempt._id.toString(), problem)
      .catch((err) => {
        console.error(
          `[POST /api/attempts] Evaluation pipeline failed for attempt ${attempt._id}:`,
          err
        );
        return attemptService.markFailed(attempt._id.toString());
      });
  } catch (error) {
    next(error);
  }
});

// GET /api/attempts/:id - Get specific attempt by ID (including status and feedback)
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const attempt = await attemptService.getAttemptById(id);

    if (!attempt) {
      res.status(404).json({
        success: false,
        message: `Attempt with ID '${id}' was not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/attempts - Query attempts history by problemId and learnerId sorted by createdAt descending
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problemId, learnerId } = req.query;

    const attempts = await attemptService.getAttempts(
      typeof problemId === "string" ? problemId : undefined,
      typeof learnerId === "string" ? learnerId : undefined
    );

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
