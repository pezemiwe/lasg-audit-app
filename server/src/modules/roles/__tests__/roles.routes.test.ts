import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { app } from "../../../app";

const mockCurrentUser = {
  id: "admin-1",
  email: "admin@example.com",
  role: "STATE_AUDITOR_GENERAL",
};

jest.mock("../../../common/middleware/authMiddleware", () => ({
  authenticate: (req: Request, _res: Response, next: NextFunction) => {
    req.user = mockCurrentUser as Request["user"];
    next();
  },
  requireRoles:
    (...roles: string[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
      if (!roles.includes(req.user!.role)) {
        const error = new Error("You do not have permission to perform this action") as Error & {
          statusCode: number;
        };
        error.statusCode = 403;
        return next(error);
      }
      return next();
    },
}));

describe("roles.routes", () => {
  it("returns the supported user roles", async () => {
    const response = await request(app).get("/api/v1/roles");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        "SYSTEM_ADMIN",
        "STATE_AUDITOR_GENERAL",
        "AUDIT_SUPERVISOR",
        "AUDIT_LEAD",
        "TEAM_AUDITOR",
        "HEAD_OF_LOCAL_GOVERNMENT",
      ]),
    );
  });
});
