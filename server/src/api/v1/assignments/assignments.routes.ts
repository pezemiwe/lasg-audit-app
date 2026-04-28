import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";

export const assignmentsRouter = Router();
assignmentsRouter.use(authenticate);

// TODO: Add route guards / validation middleware per route
