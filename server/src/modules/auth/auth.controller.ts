import type { Request, Response } from "express";
import { sendSuccess } from "../../common/responses/apiResponse";
import { writeActivityLog } from "../activity/activity.service";
import { getCurrentUser, issuePasswordResetToken, login, setNewPassword } from "./auth.service";

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body.email, req.body.password);

  req.user = {
    id: result.rawUser.id,
    email: result.rawUser.email,
    role: result.rawUser.role,
  };
  await writeActivityLog({
    req,
    action: "AUTH_LOGIN",
    entityType: "User",
    entityId: result.rawUser.id,
  });

  sendSuccess(res, { token: result.token, user: result.user });
}

export async function meController(req: Request, res: Response) {
  const user = await getCurrentUser(req.user!.id);
  sendSuccess(res, user);
}

export async function resetPasswordController(req: Request, res: Response) {
  const result = await issuePasswordResetToken(req.body.email);

  if (!result) {
    return sendSuccess(res, null, 200, "If the email exists, a reset token has been issued");
  }

  req.user = {
    id: result.user.id,
    email: result.user.email,
    role: result.user.role,
  };
  await writeActivityLog({
    req,
    action: "AUTH_PASSWORD_RESET_REQUEST",
    entityType: "User",
    entityId: result.user.id,
  });

  sendSuccess(res, { resetToken: result.resetToken }, 200, "Password reset token issued");
}

export async function newPasswordController(req: Request, res: Response) {
  const user = await setNewPassword(req.body.token, req.body.password);

  req.user = { id: user.id, email: user.email, role: user.role };
  await writeActivityLog({
    req,
    action: "AUTH_PASSWORD_RESET_COMPLETE",
    entityType: "User",
    entityId: user.id,
  });

  sendSuccess(res, null, 200, "Password updated successfully");
}
