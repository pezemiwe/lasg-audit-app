import { Role, UserStatus, } from "../../generated/prisma/client";
import { HttpError } from "../../common/errors/httpError";
import { serializeUser } from "./users.serializer";
import * as usersRepository from "./users.repository";

export const roleValues = Object.values(Role);
export const statusValues = Object.values(UserStatus);

export async function listUsers(filters: {
  role?: Role;
  status?: UserStatus;
  zoneId?: string;
  councilId?: string;
}) {
  const users = await usersRepository.listUsers(filters);
  return users.map(serializeUser);
}

export async function createUser(data: Parameters<typeof usersRepository.createUser>[0]) {
  if (data.zoneId !== undefined) {
    const zoneExists = await usersRepository.zoneExists(data.zoneId);
    if (!zoneExists) {
      throw new HttpError(400, "zoneId must reference an existing zone");
    }
  }

  if (data.councilId !== undefined) {
    const councilExists = await usersRepository.councilExists(data.councilId);
    if (!councilExists) {
      throw new HttpError(400, "councilId must reference an existing council");
    }
  }

  const user = await usersRepository.createUser(data);
  return serializeUser(user);
}

export async function getUser(id: string) {
  const user = await usersRepository.getUserById(id);
  return serializeUser(user);
}

export async function updateUser(
  id: string,
  data: Parameters<typeof usersRepository.updateUser>[1],
) {
  const user = await usersRepository.updateUser(id, data);
  return serializeUser(user);
}

export async function updateUserStatus(id: string, status: UserStatus) {
  const user = await usersRepository.updateUserStatus(id, status);
  return serializeUser(user);
}

export function updateUserPassword(id: string, password: string) {
  return usersRepository.updateUserPassword(id, password);
}

export function deactivateUser(id: string) {
  return usersRepository.deactivateUser(id);
}
