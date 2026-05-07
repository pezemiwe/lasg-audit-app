import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../../app";
import { HttpError } from "../../../common/errors/httpError";
import { writeActivityLog } from "../../activity/activity.service";
import {
  getCurrentUser,
  issuePasswordResetToken,
  login,
  setNewPassword,
} from "../auth.service";

jest.mock("../auth.service", () => ({
  getCurrentUser: jest.fn(),
  issuePasswordResetToken: jest.fn(),
  login: jest.fn(),
  setNewPassword: jest.fn(),
}));

jest.mock("../../activity/activity.service", () => ({
  writeActivityLog: jest.fn(),
}));

const mockedLogin = jest.mocked(login);
const mockedWriteActivityLog = jest.mocked(writeActivityLog);

describe("auth.controller", () => {
  beforeEach(() => {
    mockedWriteActivityLog.mockResolvedValue(undefined);
  });

  describe("POST /api/v1/auth/login", () => {
    it("returns a token and serialized user for valid credentials", async () => {
      mockedLogin.mockResolvedValue({
        token: "access-token",
        user: {
          id: "user-1",
          email: "auditor@example.com",
          name: "Audit User",
          phone: null,
          role: "STATE_AUDITOR_GENERAL",
          status: "ACTIVE",
          councilId: null,
          zoneId: null,
          specialisations: [],
          createdAt: new Date("2026-05-01T10:00:00.000Z"),
          updatedAt: new Date("2026-05-01T10:00:00.000Z"),
        },
        rawUser: {
          id: "user-1",
          email: "auditor@example.com",
          passwordHash: "hashed-password",
          name: "Audit User",
          phone: null,
          role: "STATE_AUDITOR_GENERAL",
          status: "ACTIVE",
          councilId: null,
          zoneId: null,
          specialisations: [],
          createdAt: new Date("2026-05-01T10:00:00.000Z"),
          updatedAt: new Date("2026-05-01T10:00:00.000Z"),
        },
      });

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "auditor@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 200,
        message: "Successful",
        data: {
          token: "access-token",
          user: {
            id: "user-1",
            email: "auditor@example.com",
            role: "STATE_AUDITOR_GENERAL",
            status: "ACTIVE",
          },
        },
      });
      expect(response.body.data.user).not.toHaveProperty("passwordHash");
      expect(mockedLogin).toHaveBeenCalledWith("auditor@example.com", "password123");
      expect(mockedWriteActivityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "AUTH_LOGIN",
          entityType: "User",
          entityId: "user-1",
        }),
      );
    });

    it("returns validation errors for an invalid payload", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "not-an-email", password: "" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        status: 400,
        message: "Validation failed",
      });
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: "email" }),
          expect.objectContaining({ path: "password" }),
        ]),
      );
      expect(mockedLogin).not.toHaveBeenCalled();
      expect(mockedWriteActivityLog).not.toHaveBeenCalled();
    });

    it("returns 401 when credentials are rejected", async () => {
      mockedLogin.mockRejectedValue(new HttpError(401, "Invalid email or password"));

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "auditor@example.com", password: "wrong-password" });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        status: 401,
        message: "Invalid email or password",
        data: null,
      });
      expect(mockedWriteActivityLog).not.toHaveBeenCalled();
    });
  });
});

void getCurrentUser;
void issuePasswordResetToken;
void setNewPassword;
