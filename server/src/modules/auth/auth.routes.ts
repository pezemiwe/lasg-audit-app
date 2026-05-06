import { Router } from "express";
import { authenticate } from "../../common/middleware/authMiddleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  loginController,
  meController,
  newPasswordController,
  resetPasswordController,
} from "./auth.controller";
import {
  loginValidator,
  newPasswordValidator,
  resetPasswordValidator,
} from "./auth.validators";

const router = Router();

router.post("/login", loginValidator, asyncHandler(loginController));
router.get("/me", authenticate, asyncHandler(meController));
router.post("/reset-password", resetPasswordValidator, asyncHandler(resetPasswordController));
router.post("/new-password", newPasswordValidator, asyncHandler(newPasswordController));

export default router;
