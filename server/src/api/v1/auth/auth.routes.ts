import { Router } from "express";
import { login, logout, register, refreshToken, me } from "./auth.controller";
import { authenticate } from "../../../middleware/authenticate";

export const authRouter = Router();

// Public routes
authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/refresh", refreshToken);

// Protected routes
authRouter.post("/logout", authenticate, logout);
authRouter.get("/me", authenticate, me);
