import type { ErrorRequestHandler, RequestHandler } from "express";

export class AppError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.path}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : "Internal server error";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
    },
  });
};
