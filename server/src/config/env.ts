import dotenv from "dotenv";

dotenv.config();

const parseCorsOrigin = (origin?: string): string | string[] => {
  if (!origin || origin === "*") return "*";
  if (origin.includes(",")) {
    return origin.split(",").map((o) => o.trim());
  }
  return origin;
};

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lld_assignment",
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 mins default
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "300", 10), // 300 requests per window
};
