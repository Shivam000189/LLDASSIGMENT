import { CorsOptions } from "cors";

export const getCorsOptions = (): CorsOptions => {
  return {
    origin: (requestOrigin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, health checks)
      if (!requestOrigin) {
        return callback(null, true);
      }

      // If configured to allow all
      if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === "*") {
        return callback(null, true);
      }

      const configuredOrigins = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((o) => o.trim().replace(/\/+$/, ""))
        .filter(Boolean);

      const cleanRequestOrigin = requestOrigin.replace(/\/+$/, "");

      // 1. Direct match with configured origins
      if (configuredOrigins.includes(cleanRequestOrigin)) {
        return callback(null, true);
      }

      // 2. Allow any vercel.app preview and production domains (e.g. *.vercel.app)
      if (/^https:\/\/[a-zA-Z0-9-_.]+\.vercel\.app$/.test(cleanRequestOrigin)) {
        return callback(null, true);
      }

      // 3. Allow localhost / 127.0.0.1 development origins
      if (
        /^http:\/\/localhost(:\d+)?$/.test(cleanRequestOrigin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(cleanRequestOrigin)
      ) {
        return callback(null, true);
      }

      // If origin is not allowed, reject safely
      console.warn(`[CORS] Rejected origin: ${cleanRequestOrigin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Content-Length", "X-Total-Count"],
    optionsSuccessStatus: 204,
  };
};
