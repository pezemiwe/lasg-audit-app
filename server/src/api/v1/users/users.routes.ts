import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";

export const usersRouter = Router();
usersRouter.use(authenticate);

// TODO: Add route guards / validation middleware per route
