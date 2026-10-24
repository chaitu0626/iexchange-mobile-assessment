import type Database from "better-sqlite3";

export function createTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      skills TEXT NOT NULL,
      postedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_jobs (
      userId TEXT NOT NULL,
      jobId TEXT NOT NULL,
      savedAt TEXT NOT NULL,
      PRIMARY KEY (userId, jobId),
      FOREIGN KEY (jobId) REFERENCES jobs(id)
    );
  `);
}
