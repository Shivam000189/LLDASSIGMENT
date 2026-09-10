import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { config } from "../config/env";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("[Unhandled Error]:", err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(config.nodeEnv === "development" ? { stack: err.stack } : {}),
  });
};
