import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { Prisma } from "../../generated/prisma/client";
import { env } from "../../config/env";
import { HttpError } from "../errors/httpError";
import { sendError } from "../responses/apiResponse";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof HttpError) {
    return sendError(res, error.statusCode, error.message, error.details ?? null);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return sendError(res, 409, "A record with this value already exists");
    }

    if (error.code === "P2025") {
      return sendError(res, 404, "Record not found");
    }
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return sendError(res, 400, "Signature file must not exceed 2MB");
    }

    return sendError(res, 400, error.message);
  }

  const message = env.nodeEnv === "production" ? "Internal server error" : String(error);
  return sendError(res, 500, message);
}
