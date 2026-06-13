import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./env.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const backendRootDir = path.resolve(currentDir, "../..");

export const analysisArtifactRoot = env.ANALYSIS_ARTIFACT_DIR
  ? path.resolve(backendRootDir, env.ANALYSIS_ARTIFACT_DIR)
  : path.resolve(backendRootDir, "storage/analysis-artifacts");

export const analysisArtifactPublicPath = "/analysis-artifacts";
