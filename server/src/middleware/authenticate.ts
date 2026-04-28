import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorised" });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "change_me",
    ) as {
      id: string;
      role: string;
      email: string;
    };
    req.user = payload;
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};
