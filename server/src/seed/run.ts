import mongoose from "mongoose";
import { config } from "../config/env";
import { ProblemModel } from "../models/Problem";
import { problems } from "./problems";

export const runSeed = async (): Promise<void> => {
  try {
    console.log(`[Seed] Connecting to MongoDB: ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri);
    console.log("[Seed] Connected to MongoDB.");

    for (const problem of problems) {
      console.log(`[Seed] Upserting problem: ${problem.id} (${problem.title})...`);
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

    console.log(`[Seed] Successfully seeded ${problems.length} problems.`);
  } catch (error) {
    console.error("[Seed] Error while seeding problems:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("[Seed] Disconnected from MongoDB. Done.");
  }
};

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[Seed] Fatal error:", err);
      process.exit(1);
    });
}
