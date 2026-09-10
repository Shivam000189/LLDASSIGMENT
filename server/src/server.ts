import http from "http";
import mongoose from "mongoose";
import app from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import { ProblemModel } from "./models/Problem";
import { problems } from "./seed/problems";

let server: http.Server | null = null;

// Ensure all seed problems exist in the database on startup
const ensureProblemsSeeded = async (): Promise<void> => {
  try {
    for (const problem of problems) {
      await ProblemModel.findOneAndUpdate(
        { _id: problem.id },
        {
          _id: problem.id,
          title: problem.title,
          requirements: problem.requirements,
          constraints: problem.constraints,
          expectedEntities: problem.expectedEntities,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`[AutoSeed] Ensured ${problems.length} default problems are seeded.`);
  } catch (err) {
    console.warn("[AutoSeed] Problem auto-seed skipped or failed:", err);
  }
};

const startServer = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  // Auto-seed problems if necessary
  await ensureProblemsSeeded();

  // Start Express Server
  server = app.listen(config.port, () => {
    console.log(
      `[Server] Running in ${config.nodeEnv} mode on http://localhost:${config.port}`
    );
    console.log(
      `[Health] Endpoint available at http://localhost:${config.port}/api/health`
    );
  });
};

// Graceful Shutdown handler
const gracefulShutdown = (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log("[Server] HTTP server closed.");
      try {
        await mongoose.connection.close();
        console.log("[MongoDB] Connection closed cleanly.");
        process.exit(0);
      } catch (err) {
        console.error("[MongoDB] Error during disconnect:", err);
        process.exit(1);
      }
    });

    // Force exit if shutdown takes longer than 10s
    setTimeout(() => {
      console.error("[Server] Forced shutdown after timeout.");
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Process level exception traps
process.on("uncaughtException", (error: Error) => {
  console.error("[Fatal] Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("[Fatal] Unhandled Rejection:", reason);
  process.exit(1);
});

startServer().catch((err) => {
  console.error("[Server] Fatal bootstrap error:", err);
  process.exit(1);
});
