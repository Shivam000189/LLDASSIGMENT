import express, { Application } from "express";
import cors from "cors";
import { config } from "./config/env";
import apiRouter from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", apiRouter);

// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
