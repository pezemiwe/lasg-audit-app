import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { authenticate, requireRoles } from "../middleware/authMiddleware";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  (_req, res) => {
    sendSuccess(res, Object.values(Role));
  },
);

export default router;
