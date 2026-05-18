import bcrypt from "bcryptjs";
import { Role, UserStatus } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";

export function listUsers(filters: {
  role?: Role;
  status?: UserStatus;
  zoneId?: string;
  councilId?: string;
}) {
  return prisma.user.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
  });
}

export async function zoneExists(id: string) {
  const zone = await prisma.zone.findUnique({
    where: { id },
    select: { id: true },
  });

  return zone !== null;
}

export async function councilExists(id: string) {
  const council = await prisma.council.findUnique({
    where: { id },
    select: { id: true },
  });

  return council !== null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  zoneId?: string;
  councilId?: string;
  specialisations?: string[];
}) {
  return await bcrypt.hash(data.password, 12).then((passwordHash) =>
    prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        zoneId: data.zoneId,
        councilId: data.councilId,
        specialisations: data.specialisations ?? [],
        passwordHash,
      },
    }),
  );
}

export function getUserById(id: string) {
  return prisma.user.findUniqueOrThrow({ where: { id } });
}

export function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string | null;
    role?: Role;
    zoneId?: string | null;
    councilId?: string | null;
    specialisations?: string[];
  },
) {
  return prisma.user.update({ where: { id }, data });
}

export function updateUserStatus(id: string, status: UserStatus) {
  return prisma.user.update({ where: { id }, data: { status } });
}

export async function updateUserPassword(id: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.update({ where: { id }, data: { passwordHash } });
}

export function deactivateUser(id: string) {
  return prisma.user.update({ where: { id }, data: { status: "INACTIVE" } });
}
