import dotenv from "dotenv";

// Load environment variables - in production, these come from Vercel
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

import express, { type Request, Response, NextFunction } from "express";
import { serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize and register routes
let appInitialized = false;

async function initializeApp() {
  if (appInitialized) return app;

  try {
    // Initialize application ID counters before registering routes
    const { initializeApplicationCounters } = await import("./services/namingSeries");
    await initializeApplicationCounters();

    // Use dynamic import for routes to ensure dotenv loads first
    const { registerRoutes } = await import("./routes");
    await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // Serve static files in production
    serveStatic(app);

    appInitialized = true;
    log("App initialized successfully for Vercel");
  } catch (error) {
    console.error("Failed to initialize app:", error);
    throw error;
  }

  return app;
}

// Export for Vercel serverless
export default async (req: Request, res: Response) => {
  const initializedApp = await initializeApp();
  return initializedApp(req, res);
};
