import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function readEnv(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export const env = {
  port: Number(readEnv("PORT", "3000")),
  databasePath: readEnv("DATABASE_PATH", "./data/app.db"),
  corsOrigin: readEnv("CORS_ORIGIN", "*"),
  nodeEnv: readEnv("NODE_ENV", "development"),
  jwtSecret: readRequiredEnv("JWT_SECRET"),
  jwtExpiresInSeconds: Number(readEnv("JWT_EXPIRES_IN_SECONDS", "604800")),
};
