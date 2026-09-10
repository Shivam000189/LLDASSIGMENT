import { Router } from "express";
import healthRouter from "./health";
import problemsRouter from "./problems";
import attemptsRouter from "./attempts";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/problems", problemsRouter);
apiRouter.use("/attempts", attemptsRouter);

export default apiRouter;
