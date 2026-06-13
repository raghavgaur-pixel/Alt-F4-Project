import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { analysisArtifactPublicPath, analysisArtifactRoot } from "./config/storage.js";
import { errorHandler } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";

export const app = express();
const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const backendDistDir = path.resolve(currentDir, "..");
const repoRootDir = path.resolve(backendDistDir, "..");
const frontendDistDir = env.FRONTEND_DIST_DIR ? path.resolve(backendDistDir, env.FRONTEND_DIST_DIR) : path.resolve(repoRootDir, "frontend/dist");
const hasFrontendBuild = existsSync(path.join(frontendDistDir, "index.html"));

app.use(
  cors({
    origin: env.CLIENT_URL
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(analysisArtifactPublicPath, express.static(analysisArtifactRoot));
app.use("/api", apiRouter);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistDir, { extensions: ["html"] }));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDistDir, "index.html"));
  });
}

app.use(errorHandler);

