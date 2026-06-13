import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const backendDir = path.resolve(currentDir, "../..");
const repoRootDir = path.resolve(backendDir, "..");

const envCandidates = [
  path.join(backendDir, ".env"),
  path.join(repoRootDir, ".env"),
  path.join(backendDir, ".env.example"),
  path.join(repoRootDir, ".env.example")
];

for (const envPath of envCandidates) {
  const result = dotenv.config({ path: envPath, override: false });

  if (!result.error) {
    break;
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  CLIENT_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const missingKeys = parsedEnv.error.issues.map((issue) => issue.path.join(".")).join(", ");
  throw new Error(
    `Invalid environment configuration. Missing or invalid: ${missingKeys}. Checked: ${envCandidates.join(", ")}`
  );
}

export const env = parsedEnv.data;
