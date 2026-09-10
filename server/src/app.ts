import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "./config/env";
import { getCorsOptions } from "./config/cors";
import apiRouter from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// Trust reverse proxy (Cloudflare, Render, Railway, Nginx, ALB)
app.set("trust proxy", 1);

// Security Headers (configured to allow cross-origin requests)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// Response Compression
app.use(compression());

// CORS Configuration (dynamic origin matching, preflight support, and trailing slash handling)
const corsOptions = getCorsOptions();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Global Rate Limiting (applied unless in test environment)
if (config.nodeEnv !== "test") {
  const globalLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
  });
  app.use("/api", globalLimiter);
}

// Body Parsers with size limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// API Routes
app.use("/api", apiRouter);

// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
