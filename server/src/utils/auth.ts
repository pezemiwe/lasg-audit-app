import crypto from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role } from "../generated/prisma/client";
import { env } from "../config/env";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface ResetTokenPayload {
  sub: string;
  purpose: "password-reset";
  jti: string;
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

export function signPasswordResetToken(userId: string, tokenId: string) {
  return jwt.sign(
    { sub: userId, purpose: "password-reset", jti: tokenId } satisfies ResetTokenPayload,
    env.jwtResetSecret,
    { expiresIn: env.jwtResetExpiresIn } as SignOptions,
  );
}

export function verifyPasswordResetToken(token: string) {
  return jwt.verify(token, env.jwtResetSecret) as ResetTokenPayload;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getJwtExpirationDate(token: string) {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === "string" || typeof decoded.exp !== "number") {
    throw new Error("Token does not contain an expiration timestamp");
  }

  return new Date(decoded.exp * 1000);
}
