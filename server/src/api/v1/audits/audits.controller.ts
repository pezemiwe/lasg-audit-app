import type { Request, Response, NextFunction } from "express";
import { auditsService } from "./audits.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await auditsService.getAll( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await auditsService.getById( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await auditsService.create( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await auditsService.update( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await auditsService.delete( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await auditsService.updateStatus( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
