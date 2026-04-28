import type { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service";

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await usersService.getAll( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await usersService.getById( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await usersService.create( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await usersService.update( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await usersService.delete( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await usersService.changePassword( /* pass req params */ );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
