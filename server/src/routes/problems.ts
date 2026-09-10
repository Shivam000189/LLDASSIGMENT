import { Router, Request, Response, NextFunction } from "express";
import { ProblemModel } from "../models/Problem";

const router = Router();

// GET /api/problems - List problems without exposing expectedEntities
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const problems = await ProblemModel.find({}, "-expectedEntities").sort({ _id: 1 });
    res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/problems/:id - Single problem detail without expectedEntities
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const problem = await ProblemModel.findById(id, "-expectedEntities");

    if (!problem) {
      res.status(404).json({
        success: false,
        message: `Problem with ID '${id}' was not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
