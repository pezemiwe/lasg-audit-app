import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";

export const reportsRouter = Router();
reportsRouter.use(authenticate);

// TODO: Add route guards / validation middleware per route
