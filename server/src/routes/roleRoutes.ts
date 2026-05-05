import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { authenticate, requireRoles } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  (_req, res) => {
    res.json(Object.values(Role));
  },
);

export default router;
