import { getDb } from "../database/db";
import { AppError } from "../middleware/errorHandler";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  skills: string[];
  postedAt: string;
};

type JobRow = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  skills: string;
  postedAt: string;
};

function mapJob(row: JobRow): Job {
  let skills: string[] = [];

  try {
    const parsed: unknown = JSON.parse(row.skills);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      skills = parsed;
    }
  } catch {
    skills = [];
  }

  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    requirements: row.requirements,
    skills,
    postedAt: row.postedAt,
  };
}

function likePattern(value: string): string {
  const escaped = value.replace(/[#%_]/g, "#$&");
  return `%${escaped}%`;
}

export function listJobs(search?: string): Job[] {
  const db = getDb();

  if (!search) {
    const rows = db.prepare("SELECT * FROM jobs ORDER BY postedAt DESC").all() as JobRow[];
    return rows.map(mapJob);
  }

  const pattern = likePattern(search);
  const rows = db
    .prepare(
      `SELECT * FROM jobs
       WHERE title LIKE ? ESCAPE '#'
          OR company LIKE ? ESCAPE '#'
          OR location LIKE ? ESCAPE '#'
          OR skills LIKE ? ESCAPE '#'
       ORDER BY postedAt DESC`
    )
    .all(pattern, pattern, pattern, pattern) as JobRow[];

  return rows.map(mapJob);
}

export function getJobById(id: string): Job {
  const db = getDb();
  const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as JobRow | undefined;

  if (!row) {
    throw new AppError(404, "Job not found");
  }

  return mapJob(row);
}

export function listSavedJobs(userId: string): Job[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT jobs.*
       FROM saved_jobs
       INNER JOIN jobs ON jobs.id = saved_jobs.jobId
       WHERE saved_jobs.userId = ?
       ORDER BY saved_jobs.savedAt DESC`
    )
    .all(userId) as JobRow[];

  return rows.map(mapJob);
}

export function saveJob(userId: string, jobId: string): Job {
  const job = getJobById(jobId);
  const db = getDb();

  db.prepare(
    `INSERT OR IGNORE INTO saved_jobs (userId, jobId, savedAt)
     VALUES (?, ?, ?)`
  ).run(userId, jobId, new Date().toISOString());

  return job;
}

export function unsaveJob(userId: string, jobId: string): void {
  getJobById(jobId);
  const db = getDb();
  db.prepare("DELETE FROM saved_jobs WHERE userId = ? AND jobId = ?").run(userId, jobId);
}
