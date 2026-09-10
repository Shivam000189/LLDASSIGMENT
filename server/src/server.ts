import app from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/db";

const startServer = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  // Start Express Server
  app.listen(config.port, () => {
    console.log(
      `[Server] Running in ${config.nodeEnv} mode on http://localhost:${config.port}`
    );
    console.log(
      `[Health] Endpoint available at http://localhost:${config.port}/api/health`
    );
  });
};

startServer().catch((err) => {
  console.error("[Server] Fatal bootstrap error:", err);
  process.exit(1);
});
