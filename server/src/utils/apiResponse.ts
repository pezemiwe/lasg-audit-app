import type { Response } from "express";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  status = 200,
  message = "Successful",
) {
  return res.status(status).json({
    status,
    message,
    data,
  } satisfies ApiResponse<T>);
}

export function sendError(
  res: Response,
  status: number,
  message: string,
  data: unknown = null,
) {
  return res.status(status).json({
    status,
    message,
    data,
  } satisfies ApiResponse<unknown>);
}
