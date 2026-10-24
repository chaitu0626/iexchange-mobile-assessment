import { apiRequest } from "./api";
import type { Job } from "../types/job";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseJob(value: unknown): Job {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.company !== "string" ||
    typeof value.location !== "string" ||
    typeof value.description !== "string" ||
    typeof value.requirements !== "string" ||
    !Array.isArray(value.skills) ||
    !value.skills.every((skill: unknown) => typeof skill === "string") ||
    typeof value.postedAt !== "string"
  ) {
    throw new Error("The server returned incomplete job details.");
  }

  return {
    id: value.id,
    title: value.title,
    company: value.company,
    location: value.location,
    description: value.description,
    requirements: value.requirements,
    skills: value.skills,
    postedAt: value.postedAt,
  };
}

export async function getJobs(search?: string): Promise<Job[]> {
  const query = search?.trim();
  const path = query
    ? `/jobs?search=${encodeURIComponent(query)}`
    : "/jobs";
  const response = await apiRequest(path);

  if (!isRecord(response) || !Array.isArray(response.data)) {
    throw new Error("The server returned an unexpected jobs response.");
  }

  return response.data.map(parseJob);
}

export async function getJobById(id: string): Promise<Job> {
  const response = await apiRequest(`/jobs/${encodeURIComponent(id)}`);

  if (!isRecord(response) || !("data" in response)) {
    throw new Error("The server returned an unexpected job response.");
  }

  return parseJob(response.data);
}

export async function getSavedJobs(token: string): Promise<Job[]> {
  const response = await apiRequest("/jobs/saved", { token });

  if (!isRecord(response) || !Array.isArray(response.data)) {
    throw new Error("The server returned an unexpected saved jobs response.");
  }

  return response.data.map(parseJob);
}

export async function saveJob(id: string, token: string): Promise<Job> {
  const response = await apiRequest(
    `/jobs/${encodeURIComponent(id)}/save`,
    { method: "POST", token }
  );

  if (!isRecord(response) || !("data" in response)) {
    throw new Error("The server returned an unexpected saved job response.");
  }

  return parseJob(response.data);
}

export async function unsaveJob(id: string, token: string): Promise<void> {
  await apiRequest(`/jobs/${encodeURIComponent(id)}/save`, {
    method: "DELETE",
    token,
  });
}
