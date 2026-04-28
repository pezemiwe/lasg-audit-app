import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";

export const documentsRouter = Router();
documentsRouter.use(authenticate);

// TODO: Add route guards / validation middleware per route
