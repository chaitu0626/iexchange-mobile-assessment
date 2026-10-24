import type { RequestHandler } from "express";
import { AppError } from "../middleware/errorHandler";
import {
  getJobById,
  listJobs,
  listSavedJobs,
  saveJob,
  unsaveJob,
} from "../services/jobs.service";

function requireUserId(user: { id: string } | undefined): string {
  if (!user?.id) {
    throw new AppError(401, "Authentication required");
  }

  return user.id;
}

function readJobId(id: string | string[] | undefined): string {
  if (typeof id !== "string" || !id.trim()) {
    throw new AppError(400, "Job id is required");
  }

  return id.trim();
}

export const getJobs: RequestHandler = (req, res) => {
  const rawSearch = req.query.search;
  if (rawSearch !== undefined && typeof rawSearch !== "string") {
    throw new AppError(400, "search must be a string");
  }

  const search = rawSearch?.trim();
  const jobs = listJobs(search ? search : undefined);
  res.json({ data: jobs });
};

export const getJob: RequestHandler = (req, res) => {
  res.json({ data: getJobById(readJobId(req.params.id)) });
};

export const getSavedJobs: RequestHandler = (req, res) => {
  const userId = requireUserId(req.user);
  res.json({ data: listSavedJobs(userId) });
};

export const postSaveJob: RequestHandler = (req, res) => {
  const userId = requireUserId(req.user);
  const job = saveJob(userId, readJobId(req.params.id));
  res.status(201).json({ data: job });
};

export const deleteSavedJob: RequestHandler = (req, res) => {
  const userId = requireUserId(req.user);
  unsaveJob(userId, readJobId(req.params.id));
  res.status(204).send();
};
