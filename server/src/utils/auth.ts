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
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

export function signPasswordResetToken(userId: string) {
  return jwt.sign(
    { sub: userId, purpose: "password-reset" } satisfies ResetTokenPayload,
    env.jwtResetSecret,
    { expiresIn: env.jwtResetExpiresIn } as SignOptions,
  );
}

export function verifyPasswordResetToken(token: string) {
  return jwt.verify(token, env.jwtResetSecret) as ResetTokenPayload;
}
