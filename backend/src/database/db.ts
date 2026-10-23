import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "../config/env";

let db: Database.Database | undefined;

export function getDb(): Database.Database {
  if (!db) {
    throw new Error("Database has not been initialized. Call initDatabase() first.");
  }

  return db;
}

export function initDatabase(): Database.Database {
  const absolutePath = path.isAbsolute(env.databasePath)
    ? env.databasePath
    : path.resolve(__dirname, "../..", env.databasePath);

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

  db = new Database(absolutePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  return db;
}

export function closeDatabase(): void {
  if (!db) {
    return;
  }

  db.close();
  db = undefined;
}
