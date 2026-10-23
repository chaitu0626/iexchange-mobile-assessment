import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function readEnv(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

export const env = {
  port: Number(readEnv("PORT", "3000")),
  databasePath: readEnv("DATABASE_PATH", "./data/app.db"),
  corsOrigin: readEnv("CORS_ORIGIN", "*"),
  nodeEnv: readEnv("NODE_ENV", "development"),
};
