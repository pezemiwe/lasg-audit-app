import type { Request, Response, NextFunction } from "express";
import { reportsService } from "./reports.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await reportsService.getAll( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await reportsService.getById( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const generate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await reportsService.generate( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const exportReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await reportsService.export( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await reportsService.delete( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
