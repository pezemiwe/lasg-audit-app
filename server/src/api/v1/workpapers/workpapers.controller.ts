import type { Request, Response, NextFunction } from "express";
import { workpapersService } from "./workpapers.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await workpapersService.getAll( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await workpapersService.getById( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await workpapersService.create( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await workpapersService.update( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await workpapersService.delete( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const sign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await workpapersService.sign( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
