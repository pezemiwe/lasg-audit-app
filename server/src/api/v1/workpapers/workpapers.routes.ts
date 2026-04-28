import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";

export const workpapersRouter = Router();
workpapersRouter.use(authenticate);

// TODO: Add route guards / validation middleware per route
