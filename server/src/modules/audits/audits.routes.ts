import { Router } from "express";
import { authenticate } from "../../common/middleware/authMiddleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  getAuditController,
  listAuditEngagementsController,
  listAuditsController,
} from "./audits.controller";
import { auditIdValidator, listAuditsValidator } from "./audits.validators";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  listAuditsValidator,
  asyncHandler(listAuditsController),
);

router.get(
  "/:id/engagements",
  auditIdValidator,
  asyncHandler(listAuditEngagementsController),
);

router.get(
  "/:id",
  auditIdValidator,
  asyncHandler(getAuditController),
);

export default router;
