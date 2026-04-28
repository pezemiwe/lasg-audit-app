import type { Request, Response, NextFunction } from "express";
import { documentsService } from "./documents.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await documentsService.getAll( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await documentsService.getById( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await documentsService.upload( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const download = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await documentsService.download( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await documentsService.delete( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
