import { Router } from "express";
import { param, query } from "express-validator";
import { prisma } from "../config/prisma";
import { authenticate, requireRoles } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.use(authenticate, requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"));

router.get(
  "/",
  [
    query("userId").optional().isString(),
    query("entityType").optional().isString(),
    query("entityId").optional().isString(),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const logs = await prisma.auditLog.findMany({
      where: {
        userId: req.query.userId as string | undefined,
        entityType: req.query.entityType as string | undefined,
        entityId: req.query.entityId as string | undefined,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    sendSuccess(res, logs);
  }),
);

router.get(
  "/:id",
  [param("id").isString(), validateRequest],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const log = await prisma.auditLog.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    sendSuccess(res, log);
  }),
);

export default router;
