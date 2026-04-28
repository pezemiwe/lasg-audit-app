import type { Request, Response, NextFunction } from "express";
import { notificationsService } from "./notifications.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await notificationsService.getAll( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const markRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await notificationsService.markRead( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const markAllRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await notificationsService.markAllRead( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await notificationsService.delete( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
