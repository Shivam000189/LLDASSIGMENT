import mongoose from "mongoose";
import { config } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    // Don't crash immediately in dev mode if mongo isn't started yet, but log clearly
    if (config.nodeEnv === "production") {
      process.exit(1);
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Connection lost. Reconnecting...");
});

mongoose.connection.on("error", (err) => {
  console.error("[MongoDB] Connection error event:", err);
});
