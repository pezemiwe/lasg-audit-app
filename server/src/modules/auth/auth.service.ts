import crypto from "crypto";
import bcrypt from "bcryptjs";
import { HttpError } from "../../common/errors/httpError";
import {
  getJwtExpirationDate,
  hashToken,
  signAccessToken,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from "../../common/utils/token";
import { serializeUser } from "../users/users.serializer";
import {
  createPasswordResetToken,
  findUserByEmail,
  findUserByIdOrThrow,
  resetPasswordWithToken,
  updatePasswordResetToken,
} from "./auth.repository";

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user || user.status !== "ACTIVE") {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user: serializeUser(user), rawUser: user };
}

export async function getCurrentUser(userId: string) {
  const user = await findUserByIdOrThrow(userId);
  return serializeUser(user);
}

export async function issuePasswordResetToken(email: string) {
  const user = await findUserByEmail(email);

  if (!user || user.status !== "ACTIVE") {
    return null;
  }

  const tokenRecord = await createPasswordResetToken({
    userId: user.id,
    tokenHash: `pending:${crypto.randomUUID()}`,
    expiresAt: new Date(),
  });
  const resetToken = signPasswordResetToken(user.id, tokenRecord.id);

  await updatePasswordResetToken(tokenRecord.id, {
    tokenHash: hashToken(resetToken),
    expiresAt: getJwtExpirationDate(resetToken),
  });

  return { resetToken, user };
}

export async function setNewPassword(token: string, password: string) {
  const payload = verifyPasswordResetToken(token);
  if (payload.purpose !== "password-reset") {
    throw new HttpError(400, "Invalid reset token");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await resetPasswordWithToken({
    userId: payload.sub,
    tokenId: payload.jti,
    tokenHash: hashToken(token),
    passwordHash,
  });

  if (!user) {
    throw new HttpError(400, "Invalid or expired reset token");
  }

  return user;
}
