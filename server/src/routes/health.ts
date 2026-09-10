import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "../config/env";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const dbStateMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const dbState = mongoose.connection.readyState;
  const isDbReady = dbState === 1;
  const dbStatus = dbStateMap[dbState] || "unknown";

  const memoryUsage = process.memoryUsage();

  const healthData = {
    status: isDbReady ? "ok" : "degraded",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      provider: "mongodb",
      status: dbStatus,
      connected: isDbReady,
      host: mongoose.connection.host || null,
    },
    memory: {
      rssMb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapUsedMb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMb: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
    },
  };

  res.status(isDbReady ? 200 : 503).json(healthData);
});

export default router;
