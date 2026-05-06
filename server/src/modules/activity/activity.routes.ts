import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  getActivityController,
  listActivityController,
} from "./activity.controller";
import { getActivityValidator, listActivityValidator } from "./activity.validators";

const router = Router();

router.use(authenticate, requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"));

router.get("/", listActivityValidator, asyncHandler(listActivityController));
router.get("/:id", getActivityValidator, asyncHandler(getActivityController));

export default router;
