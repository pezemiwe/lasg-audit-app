import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpError } from "../errors/httpError";

export function validateRequest(req: Request, _res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  next(new HttpError(400, "Validation failed", result.array()));
}
