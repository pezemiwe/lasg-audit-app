import type { Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/client";
import { sendSuccess } from "../../common/responses/apiResponse";
import { writeActivityLog } from "../activity/activity.service";
import {
  createUser,
  deactivateUser,
  getUser,
  listUsers,
  roleValues,
  updateUser,
  updateUserPassword,
  updateUserStatus,
} from "./users.service";

export async function listUsersController(req: Request, res: Response) {
  const users = await listUsers({
    role: req.query.role as Role | undefined,
    status: req.query.status as UserStatus | undefined,
    zoneId: req.query.zoneId as string | undefined,
    councilId: req.query.councilId as string | undefined,
  });

  sendSuccess(res, users);
}

export async function createUserController(req: Request, res: Response) {
  const user = await createUser(req.body);

  await writeActivityLog({
    req,
    action: "USER_CREATED",
    entityType: "User",
    entityId: user.id,
    details: { role: user.role, email: user.email },
  });

  sendSuccess(res, user, 201);
}

export function listUserRolesController(_req: Request, res: Response) {
  sendSuccess(res, roleValues);
}

export async function getUserController(req: Request, res: Response) {
  const user = await getUser(req.params.id as string);
  sendSuccess(res, user);
}

export async function updateUserController(req: Request, res: Response) {
  const user = await updateUser(req.params.id as string, req.body);

  await writeActivityLog({
    req,
    action: "USER_UPDATED",
    entityType: "User",
    entityId: user.id,
  });

  sendSuccess(res, user);
}

export async function updateUserStatusController(req: Request, res: Response) {
  const user = await updateUserStatus(req.params.id as string, req.body.status);

  await writeActivityLog({
    req,
    action: "USER_STATUS_UPDATED",
    entityType: "User",
    entityId: user.id,
    details: { status: user.status },
  });

  sendSuccess(res, user);
}

export async function updateUserPasswordController(req: Request, res: Response) {
  const user = await updateUserPassword(req.params.id as string, req.body.password);

  await writeActivityLog({
    req,
    action: "USER_PASSWORD_UPDATED",
    entityType: "User",
    entityId: user.id,
  });

  sendSuccess(res, null, 200, "Password updated successfully");
}

export async function deactivateUserController(req: Request, res: Response) {
  const user = await deactivateUser(req.params.id as string);

  await writeActivityLog({
    req,
    action: "USER_DEACTIVATED",
    entityType: "User",
    entityId: user.id,
  });

  sendSuccess(res, null, 200, "User deactivated successfully");
}
