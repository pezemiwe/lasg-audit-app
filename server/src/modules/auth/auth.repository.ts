import { prisma } from "../../config/prisma";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserByIdOrThrow(id: string) {
  return prisma.user.findUniqueOrThrow({ where: { id } });
}

export function createPasswordResetToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return prisma.passwordResetToken.create({ data });
}

export function updatePasswordResetToken(
  id: string,
  data: { tokenHash?: string; expiresAt?: Date; usedAt?: Date },
) {
  return prisma.passwordResetToken.update({ where: { id }, data });
}

export function resetPasswordWithToken(data: {
  userId: string;
  tokenId: string;
  tokenHash: string;
  passwordHash: string;
}) {
  return prisma.$transaction(async (tx) => {
    const resetToken = await tx.passwordResetToken.findUnique({
      where: { tokenHash: data.tokenHash },
    });

    if (
      !resetToken ||
      resetToken.userId !== data.userId ||
      resetToken.id !== data.tokenId ||
      resetToken.usedAt ||
      resetToken.expiresAt <= new Date()
    ) {
      return null;
    }

    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    return tx.user.update({
      where: { id: data.userId },
      data: { passwordHash: data.passwordHash },
    });
  });
}
