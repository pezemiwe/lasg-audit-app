import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  assignHeadOfLocalGovernmentController,
  getCouncilController,
  listCouncilsController,
  updateCouncilController,
} from "./councils.controller";
import {
  assignHeadOfLocalGovernmentValidator,
  councilIdValidator,
  listCouncilsValidator,
  updateCouncilValidator,
} from "./councils.validators";

const router = Router();

router.use(authenticate);

router.get("/", listCouncilsValidator, asyncHandler(listCouncilsController));
router.get("/:id", councilIdValidator, asyncHandler(getCouncilController));
router.patch(
  "/:id/holg",
  requireRoles("SYSTEM_ADMIN"),
  assignHeadOfLocalGovernmentValidator,
  asyncHandler(assignHeadOfLocalGovernmentController),
);
router.put(
  "/:id",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  updateCouncilValidator,
  asyncHandler(updateCouncilController),
);

export default router;
