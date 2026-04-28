import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";

export const auditsRouter = Router();
auditsRouter.use(authenticate);

// TODO: Add route guards / validation middleware per route
