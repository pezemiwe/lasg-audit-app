import type { Request, Response, NextFunction } from "express";
import { assignmentsService } from "./assignments.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await assignmentsService.getAll( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await assignmentsService.getById( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await assignmentsService.create( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await assignmentsService.update( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await assignmentsService.delete( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
