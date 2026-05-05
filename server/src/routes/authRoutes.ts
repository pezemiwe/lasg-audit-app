import { Router } from "express";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { prisma } from "../config/prisma";
import { authenticate } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";
import {
  signAccessToken,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from "../utils/auth";
import { serializeUser } from "../serializers/userSerializer";
import { writeAuditLog } from "../services/auditLogService";

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
    await writeAuditLog({
      req,
      action: "AUTH_LOGIN",
      entityType: "User",
      entityId: user.id,
    });

    res.json({ token, user: serializeUser(user) });
  }),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.id },
    });

    res.json(serializeUser(user));
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
      return res.json({ message: "If the email exists, a reset token has been issued" });
    }

    const resetToken = signPasswordResetToken(user.id);
    await writeAuditLog({
      req,
      action: "AUTH_PASSWORD_RESET_REQUEST",
      entityType: "User",
      entityId: user.id,
    });

    res.json({
      message: "Password reset token issued",
      resetToken,
    });
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
    const user = await prisma.user.update({
      where: { id: payload.sub },
      data: { passwordHash },
    });

    req.user = { id: user.id, email: user.email, role: user.role };
    await writeAuditLog({
      req,
      action: "AUTH_PASSWORD_RESET_COMPLETE",
      entityType: "User",
      entityId: user.id,
    });

    res.json({ message: "Password updated successfully" });
  }),
);

export default router;
