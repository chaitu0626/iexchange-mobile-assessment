import type { RequestHandler } from "express";
import { AppError } from "./errorHandler";
import { verifyAccessToken } from "../services/auth.service";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);
  const token = match?.[1];

  if (!token) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  try {
    req.user = { id: verifyAccessToken(token) };
    next();
  } catch (error) {
    next(error);
  }
};
