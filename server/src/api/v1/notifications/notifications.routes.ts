import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";

export const notificationsRouter = Router();
notificationsRouter.use(authenticate);

// TODO: Add route guards / validation middleware per route
