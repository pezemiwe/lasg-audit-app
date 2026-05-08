import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { app } from "../../../app";
import { writeActivityLog } from "../../activity/activity.service";
import {
  createUser,
  deactivateUser,
  getUser,
  listUsers,
  updateUser,
  updateUserPassword,
  updateUserStatus,
} from "../users.service";

const mockCurrentUser = {
  id: "admin-1",
  email: "admin@example.com",
  role: "SYSTEM_ADMIN",
};

jest.mock("../../../common/middleware/authMiddleware", () => ({
  authenticate: (req: Request, _res: Response, next: NextFunction) => {
    req.user = mockCurrentUser as Request["user"];
    next();
  },
  requireRoles:
    (...roles: string[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new Error("Authentication is required"));
      }
      if (!roles.includes(req.user.role)) {
        const error = new Error("You do not have permission to perform this action") as Error & {
          statusCode: number;
        };
        error.statusCode = 403;
        return next(error);
      }
      return next();
    },
}));

jest.mock("../users.service", () => ({
  createUser: jest.fn(),
  deactivateUser: jest.fn(),
  getUser: jest.fn(),
  listUsers: jest.fn(),
  roleValues: [
    "SYSTEM_ADMIN",
    "STATE_AUDITOR_GENERAL",
    "AUDIT_SUPERVISOR",
    "AUDIT_LEAD",
    "TEAM_AUDITOR",
    "HEAD_OF_LOCAL_GOVERNMENT",
  ],
  statusValues: ["ACTIVE", "INACTIVE", "SUSPENDED"],
  updateUser: jest.fn(),
  updateUserPassword: jest.fn(),
  updateUserStatus: jest.fn(),
}));

jest.mock("../../activity/activity.service", () => ({
  writeActivityLog: jest.fn(),
}));

const mockedListUsers = jest.mocked(listUsers);
const mockedCreateUser = jest.mocked(createUser);
const mockedUpdateUserStatus = jest.mocked(updateUserStatus);
const mockedWriteActivityLog = jest.mocked(writeActivityLog);

describe("users.controller", () => {
  beforeEach(() => {
    mockCurrentUser.role = "SYSTEM_ADMIN";
    mockedWriteActivityLog.mockResolvedValue(undefined);
  });

  it("lists users with query filters", async () => {
    mockedListUsers.mockResolvedValue([
      {
        id: "user-1",
        email: "lead@example.com",
        name: "Lead Auditor",
        role: "AUDIT_LEAD",
        status: "ACTIVE",
      } as never,
    ]);

    const response = await request(app)
      .get("/api/v1/users")
      .query({ role: "AUDIT_LEAD", status: "ACTIVE", zoneId: "zone-1" });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([
      expect.objectContaining({ id: "user-1", role: "AUDIT_LEAD" }),
    ]);
    expect(mockedListUsers).toHaveBeenCalledWith({
      role: "AUDIT_LEAD",
      status: "ACTIVE",
      zoneId: "zone-1",
      councilId: undefined,
    });
  });

  it("creates a user and writes an activity log", async () => {
    mockedCreateUser.mockResolvedValue({
      id: "user-2",
      email: "new@example.com",
      name: "New User",
      role: "TEAM_AUDITOR",
      status: "ACTIVE",
    } as never);

    const response = await request(app).post("/api/v1/users").send({
      name: "New User",
      email: "new@example.com",
      password: "password123",
      role: "TEAM_AUDITOR",
      specialisations: ["Payroll"],
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({ id: "user-2", email: "new@example.com" });
    expect(mockedCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: "new@example.com", role: "TEAM_AUDITOR" }),
    );
    expect(mockedWriteActivityLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "USER_CREATED",
        entityType: "User",
        entityId: "user-2",
      }),
    );
  });

  it("rejects invalid create payload before service call", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "",
      email: "bad-email",
      password: "short",
      role: "NOT_A_ROLE",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(mockedCreateUser).not.toHaveBeenCalled();
  });

  it("updates user status", async () => {
    mockedUpdateUserStatus.mockResolvedValue({
      id: "user-3",
      email: "inactive@example.com",
      role: "TEAM_AUDITOR",
      status: "INACTIVE",
    } as never);

    const response = await request(app)
      .patch("/api/v1/users/user-3/status")
      .send({ status: "INACTIVE" });

    expect(response.status).toBe(200);
    expect(mockedUpdateUserStatus).toHaveBeenCalledWith("user-3", "INACTIVE");
    expect(mockedWriteActivityLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "USER_STATUS_UPDATED", entityId: "user-3" }),
    );
  });
});

void getUser;
void updateUser;
void updateUserPassword;
void deactivateUser;
