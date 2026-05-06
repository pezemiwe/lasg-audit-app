import type { User } from "../../generated/prisma/client";

export function serializeUser(user: User) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}
