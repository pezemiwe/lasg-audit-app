import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { prisma } from "../config/prisma";
import { authenticate } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";
import {
  getJwtExpirationDate,
  hashToken,
  signAccessToken,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from "../utils/auth";
import { serializeUser } from "../serializers/userSerializer";
import { writeActivityLog } from "../services/activityLogService";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().notEmpty(),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new HttpError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordMatches) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    req.user = { id: user.id, email: user.email, role: user.role };
    await writeActivityLog({
      req,
      action: "AUTH_LOGIN",
      entityType: "User",
      entityId: user.id,
    });

    sendSuccess(res, { token, user: serializeUser(user) });
  }),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.id },
    });

    sendSuccess(res, serializeUser(user));
  }),
);

router.post(
  "/reset-password",
  [body("email").isEmail().normalizeEmail(), validateRequest],
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user || user.status !== "ACTIVE") {
      return sendSuccess(res, null, 200, "If the email exists, a reset token has been issued");
    }

    const tokenRecord = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: `pending:${crypto.randomUUID()}`,
        expiresAt: new Date(),
      },
    });
    const resetToken = signPasswordResetToken(user.id, tokenRecord.id);
    await prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: {
        tokenHash: hashToken(resetToken),
        expiresAt: getJwtExpirationDate(resetToken),
      },
    });
    await writeActivityLog({
      req,
      action: "AUTH_PASSWORD_RESET_REQUEST",
      entityType: "User",
      entityId: user.id,
    });

    sendSuccess(res, { resetToken }, 200, "Password reset token issued");
  }),
);

router.post(
  "/new-password",
  [
    body("token").isString().notEmpty(),
    body("password").isLength({ min: 8 }),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const payload = verifyPasswordResetToken(req.body.token);
    if (payload.purpose !== "password-reset") {
      throw new HttpError(400, "Invalid reset token");
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const tokenHash = hashToken(req.body.token);

    const user = await prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
      });

      if (
        !resetToken ||
        resetToken.userId !== payload.sub ||
        resetToken.id !== payload.jti ||
        resetToken.usedAt ||
        resetToken.expiresAt <= new Date()
      ) {
        throw new HttpError(400, "Invalid or expired reset token");
      }

      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      });

      return tx.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });
    });

    req.user = { id: user.id, email: user.email, role: user.role };
    await writeActivityLog({
      req,
      action: "AUTH_PASSWORD_RESET_COMPLETE",
      entityType: "User",
      entityId: user.id,
    });

    sendSuccess(res, null, 200, "Password updated successfully");
  }),
);

export default router;
