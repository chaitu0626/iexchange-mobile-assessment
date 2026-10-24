import { Router } from "express";
import {
  deleteSavedJob,
  getJob,
  getJobs,
  getSavedJobs,
  postSaveJob,
} from "../controllers/jobs.controller";
import { requireAuth } from "../middleware/requireAuth";

const jobsRouter = Router();

jobsRouter.get("/", getJobs);
jobsRouter.get("/saved", requireAuth, getSavedJobs);
jobsRouter.post("/:id/save", requireAuth, postSaveJob);
jobsRouter.delete("/:id/save", requireAuth, deleteSavedJob);
jobsRouter.get("/:id", getJob);

export default jobsRouter;
