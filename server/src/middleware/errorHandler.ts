import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

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
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "A record with this value already exists" });
    }

    if (error.code === "P2025") {
      return res.status(404).json({ message: "Record not found" });
    }
  }

  const message = env.nodeEnv === "production" ? "Internal server error" : String(error);
  return res.status(500).json({ message });
}
