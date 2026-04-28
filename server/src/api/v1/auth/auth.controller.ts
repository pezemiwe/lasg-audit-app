import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.login( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.logout( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.register( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.refreshToken( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.me( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
