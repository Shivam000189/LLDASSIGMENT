import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const dbStateMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const dbState = mongoose.connection.readyState;
  const dbStatus = dbStateMap[dbState] || "unknown";

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      provider: "mongodb",
      status: dbStatus,
      host: mongoose.connection.host || null,
    },
  });
});

export default router;
