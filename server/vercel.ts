import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Initialize and register routes
let appInitialized = false;

async function initializeApp() {
  if (appInitialized) return app;

  try {
    console.log("Initializing Vercel serverless function...");

    // Initialize application ID counters before registering routes
    const { initializeApplicationCounters } = await import("./services/namingSeries");
    await initializeApplicationCounters();

    // Register routes
    const { registerRoutes } = await import("./routes");
    await registerRoutes(app);

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Error:", err);
      res.status(status).json({ message });
    });

    // Serve static files in production
    const distPath = path.resolve(import.meta.dirname, "public");

    if (!fs.existsSync(distPath)) {
      throw new Error(
        `Could not find the build directory: ${distPath}, make sure to build the client first`,
      );
    }

    app.use(express.static(distPath));

    // Fall through to index.html if the file doesn't exist
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });

    appInitialized = true;
    console.log("App initialized successfully for Vercel");
  } catch (error) {
    console.error("Failed to initialize app:", error);
    throw error;
  }

  return app;
}

// Export for Vercel serverless
export default async (req: Request, res: Response) => {
  try {
    const initializedApp = await initializeApp();
    return initializedApp(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
